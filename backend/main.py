import json
import re
import os
import gc
import uuid
import shutil
import subprocess
import tempfile
import platform as plt_module
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
from typing import List, Dict
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import BackgroundTasks
from pydantic import BaseModel
from fastapi.responses import Response
from fpdf import FPDF

from utils.pdf_parser import extract_text_from_memory
from llms.provider import MCQProvider
import uvicorn

# --- RAG IMPORTS ---
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma

# --- LIBREOFFICE CONFIGURATION ---
if plt_module.system() == 'Windows':
    # LOCAL: You must install LibreOffice on your Windows PC to test this locally!
    LIBREOFFICE_PATH = r"C:\Program Files\LibreOffice\program\soffice.exe"
else:
    # PRODUCTION (Render/Linux Docker):
    LIBREOFFICE_PATH = "libreoffice"

# --- DEPLOYMENT SAFETY NET ---
# This runs once when the server starts. It wipes any orphaned databases.
@asynccontextmanager
async def lifespan(app: FastAPI):
    temp_dir = "temp_data"
    if os.path.exists(temp_dir):
        try:
            shutil.rmtree(temp_dir)
            print("🧹 Server Startup: Wiped all legacy temp_data.")
        except Exception as e:
            print(f"⚠️ Could not clean temp_data on startup: {e}")
    os.makedirs(temp_dir, exist_ok=True)
    yield
    
app = FastAPI(title="MCQ Generator API (RAG Version)", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://quest-ai-six.vercel.app",
        "http://localhost:3000"            
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

provider = MCQProvider()

# Ensure a directory exists to store our vector databases
os.makedirs("temp_data", exist_ok=True)

# Initialize the local embedding model (downloads a tiny, fast model the first time)
embeddings_model = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=os.getenv("GEMINI_API_KEY")
)


class GenerateRequest(BaseModel):
    file_id: str
    num_questions: int = 10
    difficulty: str = "Medium"
    topic: str = "main concepts and key details" 

class MCQItem(BaseModel):
    question: str
    options: list[str]
    answer: str

class PDFDownloadRequest(BaseModel):
    mcqs: list[MCQItem]
    include_answers: bool = False

class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    file_id: str
    message: str
    history: List[ChatMessage] = []

def cleanup_chroma_folder(directory_path: str):
    """Silently deletes the vector database folder to free up server RAM/Disk space."""
    if os.path.exists(directory_path):
        try:
            shutil.rmtree(directory_path)
            print(f"🧹 Success: Cleaned up temporary DB at {directory_path}")
        except Exception as e:
            print(f"⚠️ Error cleaning up {directory_path}: {e}")

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """API 1: Extracts text, CHUNKS it, and saves to Chroma VectorDB."""
    try:
        file_bytes = await file.read()
        text = extract_text_from_memory(file_bytes)
        
        if not text or len(text) < 50:
            raise HTTPException(status_code=400, detail="PDF is empty or too short.")
        
        file_id = str(uuid.uuid4())
        
        # --- RAG: CHUNKING & EMBEDDING ---
        # 1. Split the massive text into smaller 1000-character blocks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_text(text)
        
        # 2. Convert to LangChain Documents
        docs = [Document(page_content=chunk) for chunk in chunks]
        
        # 3. Create a temporary Chroma database specifically for this file
        persist_dir = f"temp_data/chroma_{file_id}"
        vectorstore = Chroma.from_documents(
            documents=docs,
            embedding=embeddings_model,
            persist_directory=persist_dir
        )

        # vectorstore.persist()
            
        return {
            "success": True, 
            "file_id": file_id, 
            "message": f"PDF processed into {len(chunks)} searchable chunks."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-mcqs")
async def generate_mcqs(request: GenerateRequest, background_tasks: BackgroundTasks):
    """API 2: SEARCHES the VectorDB, then uses existing Fallback logic to generate."""
    persist_dir = f"temp_data/chroma_{request.file_id}"
    
    if not os.path.exists(persist_dir):
        raise HTTPException(status_code=404, detail="Session expired or file not found. Please re-upload.")

    try:
        # --- RAG: RETRIEVAL ---
        # 1. Connect to the saved Chroma database for this file
        vectorstore = Chroma(persist_directory=persist_dir, embedding_function=embeddings_model)
        
        # 2. Search for the most relevant blocks of text based on the topic
        relevant_docs = vectorstore.similarity_search(request.topic, k=12)
        
        # 3. Combine the retrieved text into one focused context string
        context = "\n\n".join([doc.page_content for doc in relevant_docs])

        print(f"context given to LLM:\n{context[:500]}...")  # Log the first 500 chars of context for debugging

        # --- GENERATION ---
        prompt = f"""
        Analyze the following context and generate exactly {request.num_questions} multiple-choice questions about '{request.topic}' at a '{request.difficulty}' difficulty level.
        
        CRITICAL STYLE RULES:
        1. Write the questions as standalone exam questions.
        2. ABSOLUTELY DO NOT use phrases like "According to the text", "The text introduces", "As mentioned in the document", or "Based on the excerpt".
        3. The questions must sound natural and make perfect sense to a student who has never seen the source material.

        Difficulty Definitions:
        - Easy: Direct, factual questions easily found in the text.
        - Medium: Requires understanding of concepts or connecting two ideas in the text.
        - Hard: Requires deep analysis, inference, or applying the text's concepts to complex scenarios.

        You must output ONLY valid JSON in the exact format below, with no additional conversational text or markdown.
        Each question MUST have exactly 4 options. The answer must be the exact string from the options array.

        {{
          "status": "success",
          "count": {request.num_questions},
          "mcqs": [
            {{
              "question": "Which of the following is NOT a primary problem that jQuery addresses for raw JavaScript developers?",
              "options": ["Complexity", "Cross-browser inconsistencies", "Server-side processing", "Inconsistent styling methods"],
              "answer": "Server-side processing"
            }}
          ]
        }}

        Context to analyze: 
        {context}
        """

        raw_response = await provider.generate_mcqs(prompt)
        
        # Clean the response
        cleaned_response = re.sub(r'```json\n|\n```|```', '', raw_response).strip()

        try:
            parsed_data = json.loads(cleaned_response)
            # background_tasks.add_task(cleanup_chroma_folder, persist_dir)
            
            # gc.collect()

            return parsed_data
            
        except json.JSONDecodeError:
            # background_tasks.add_task(cleanup_chroma_folder, persist_dir)
            return {
                "status": "error", 
                "message": "LLM did not return valid JSON.", 
                "raw_output": cleaned_response
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/download-pdf")
async def download_question_paper(request: PDFDownloadRequest):
    """API 3: Takes a list of MCQs and generates a formatted PDF question paper."""
    pdf = FPDF()
    pdf.set_title("MCQ Question Paper")
    pdf.set_author("MCQ Generator")
    pdf.set_creator("MCQ Generator App")
    pdf.set_subject("Educational Question Paper")
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    # --- TITLE ---
    pdf.set_font("Arial", style="B", size=16)
    pdf.cell(0, 10, txt="MCQ Question Paper", ln=True, align='C')
    pdf.ln(5)
    
    # --- QUESTIONS & OPTIONS ---
    pdf.set_font("Arial", size=12)
    labels = ["A", "B", "C", "D"]
    
    for i, mcq in enumerate(request.mcqs, 1):
        pdf.set_font("Arial", style="B", size=12)
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(0, 8, txt=f"{i}. {mcq.question}")
        
        pdf.set_font("Arial", size=12)
        for j, option in enumerate(mcq.options):
            label = labels[j] if j < len(labels) else "*"
            pdf.set_x(20)
            pdf.multi_cell(0, 8, txt=f"{label}. {option}")
        
        if request.include_answers:
            ans_label = "Unknown"
            for j, option in enumerate(mcq.options):
                if option == mcq.answer:
                    ans_label = labels[j] if j < len(labels) else "*"
                    break
            
            pdf.set_font("Arial", style="I", size=11)
            pdf.set_x(pdf.l_margin)
            pdf.multi_cell(0, 8, txt=f"Answer: {ans_label}. {mcq.answer}")
        
        pdf.set_x(pdf.l_margin)
        pdf.ln(4)

    pdf_bytes = bytes(pdf.output())
    
    return Response(
        content=pdf_bytes, 
        media_type="application/pdf", 
        headers={"Content-Disposition": "attachment; filename=question_paper.pdf"}
    )

@app.post("/chat")
async def chat_with_pdf(request: ChatRequest):
    persist_dir = f"temp_data/chroma_{request.file_id}"
    
    if not os.path.exists(persist_dir):
        raise HTTPException(status_code=404, detail="Session expired or file not found. Please re-upload.")

    try:
        # 1. Connect to the existing vector database
        vectorstore = Chroma(
            persist_directory=persist_dir, 
            embedding_function=embeddings_model # Uses your global embedding model
        )
        
        # 2. Search for the answer to the user's specific chat message
        relevant_docs = vectorstore.similarity_search(request.message, k=5)
        context = "\n\n".join([doc.page_content for doc in relevant_docs])
        
        # Free up memory (Windows file lock prevention)
        del relevant_docs
        del vectorstore
        gc.collect()

        # 3. Format the chat history for the prompt
        formatted_history = ""
        for msg in request.history[-4:]: # Only keep the last 4 messages for context window efficiency
            formatted_history += f"{msg.role.capitalize()}: {msg.content}\n"

        prompt = f"""You are an expert, encouraging AI Tutor for the QuestAI learning platform. Your primary goal is to help a student understand the material from their uploaded document.

                You must strictly adhere to the following rules:
                1. PRIMARY GROUNDING: Always prioritize answering the user's question using the provided "Document Context" first.
                2. GRACEFUL FALLBACK (OUTSIDE KNOWLEDGE): If the user asks for a better explanation, an analogy, or a concept that is NOT in the document context, you are allowed to use your general AI knowledge to help them learn. 
                * CRITICAL: If you use outside knowledge, you MUST explicitly state it. Use phrases like: "The document doesn't specifically mention this, but to help you understand..." or "Stepping outside the provided text for a moment..."
                3. CLEAR FORMATTING: Use Markdown extensively. Use **bold text** for key terms, use bullet points for lists, and break long explanations into small, readable paragraphs.
                4. TUTOR PERSONA: Be encouraging, academic, and clear. If a concept is difficult, proactively offer to break it down step-by-step or provide an analogy.
                5. CONTEXT AWARENESS: Use the "Conversation History" to understand pronouns or references, but always ground your factual answers in the context when possible.

                --- Document Context ---
                {context}

                --- Conversation History ---
                {formatted_history}

                User: {request.message}
                Tutor:"""

        # 5. Use your custom MCQProvider to get the response!
        provider = MCQProvider()
        response_text = await provider.generate_mcqs(prompt)
        
        return {"reply": response_text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/convert-ppt")
async def convert_ppt_to_pdf(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    # 1. Create a secure, temporary directory
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    
    # 2. Save the uploaded PPT/PPTX file
    with open(input_path, "wb") as f:
        f.write(await file.read())
        
    try:
        # 3. Run the Headless LibreOffice conversion command
        print(f"🔄 Converting {file.filename} to PDF...")
        subprocess.run(
            [LIBREOFFICE_PATH, "--headless", "--convert-to", "pdf", input_path, "--outdir", temp_dir],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True
        )
        
        # 4. Find the newly generated PDF file
        pdf_filename = os.path.splitext(file.filename)[0] + ".pdf"
        pdf_path = os.path.join(temp_dir, pdf_filename)
        
        if not os.path.exists(pdf_path):
            raise Exception("LibreOffice ran, but no PDF was generated.")
            
        # 5. Clean up the temp folder AFTER the file is sent to the user
        if background_tasks:
            background_tasks.add_task(shutil.rmtree, temp_dir, ignore_errors=True)
        
        # 6. Return the actual PDF file!
        return FileResponse(
            pdf_path, 
            media_type="application/pdf", 
            filename=pdf_filename
        )
        
    except FileNotFoundError:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(
            status_code=500, 
            detail="LibreOffice not found. If on Windows, please install it. If on Render, check Dockerfile."
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")
    

@app.post("/cleanup/{file_id}")
async def force_cleanup(file_id: str, background_tasks: BackgroundTasks):
    """Triggered by the frontend when the user leaves the page."""
    persist_dir = f"temp_data/chroma_{file_id}"
    background_tasks.add_task(cleanup_chroma_folder, persist_dir)
    return {"status": "cleanup_scheduled"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
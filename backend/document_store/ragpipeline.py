   
import json
import re
import os
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils.pdf_parser import extract_text_from_memory
from llms.provider import MCQProvider
import uvicorn
from fastapi.responses import FileResponse
from fastapi import Response
from fpdf import FPDF

app = FastAPI(title="MCQ Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

provider = MCQProvider()

class GenerateRequest(BaseModel):
    file_id: str
    num_questions: int = 10
    difficulty: str = "Medium"  # Default to Medium if the user doesn't choose

class MCQItem(BaseModel):
    question: str
    options: list[str]
    answer: str

class PDFDownloadRequest(BaseModel):
    mcqs: list[MCQItem]
    include_answers: bool = False

document_store = {}

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """API 1: Extracts text IN MEMORY and stores it in RAM."""
    try:
        file_bytes = await file.read()
        text = extract_text_from_memory(file_bytes)
        
        if not text or len(text) < 50:
            raise HTTPException(status_code=400, detail="PDF is empty or too short.")
        
        file_id = str(uuid.uuid4())
        
        # Save to RAM instead of the hard drive
        document_store[file_id] = text
            
        return {
            "success": True, 
            "file_id": file_id, 
            "message": "PDF processed perfectly in memory."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
      
@app.post("/generate-mcqs")
async def generate_mcqs(request: GenerateRequest):
    """API 2: Reads text from RAM and generates questions."""
    
    # Fetch from RAM dictionary instead of file
    if request.file_id not in document_store:
        raise HTTPException(status_code=404, detail="Session expired or file not found. Please re-upload.")
        
    text = document_store[request.file_id]

    # The Strict Prompt with Difficulty Engineering
    # The Strict Prompt with Difficulty & Style Engineering
    prompt = f"""
    Analyze the following text and generate exactly {request.num_questions} multiple-choice questions at a '{request.difficulty}' difficulty level.
    
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

    Text to analyze: {text[:5000]} 
    """

    try:
        raw_response = await provider.generate_mcqs(prompt)
        
        # Clean the response (Remove markdown code blocks if the LLM adds them)
        cleaned_response = re.sub(r'```json\n|\n```|```', '', raw_response).strip()

        # Parse and return actual JSON
        try:
            parsed_data = json.loads(cleaned_response)
            return parsed_data
        except json.JSONDecodeError:
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
        # Print Question
        pdf.set_font("Arial", style="B", size=12)
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(0, 8, txt=f"{i}. {mcq.question}")
        
        # Print Options
        pdf.set_font("Arial", size=12)
        for j, option in enumerate(mcq.options):
            label = labels[j] if j < len(labels) else "*"
            pdf.set_x(20)
            pdf.multi_cell(0, 8, txt=f"{label}. {option}")
        
        # Print Answer (if requested)
        if request.include_answers:
            ans_label = "Unknown"
            for j, option in enumerate(mcq.options):
                if option == mcq.answer:
                    ans_label = labels[j] if j < len(labels) else "*"
                    break
            
            pdf.set_font("Arial", style="I", size=11)  # Italic for answer
            pdf.set_x(pdf.l_margin)
            pdf.multi_cell(0, 8, txt=f"Answer: {ans_label}. {mcq.answer}")
        
        pdf.set_x(pdf.l_margin)
        pdf.ln(4)

    pdf_bytes = bytes(pdf.output())
    
    # Stream directly to the user
    return Response(
        content=pdf_bytes, 
        media_type="application/pdf", 
        headers={"Content-Disposition": "attachment; filename=question_paper.pdf"}
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
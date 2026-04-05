import os

import aiohttp
from google import genai
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class MCQProvider:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.groq_key = os.getenv("GROQ_API_KEY")
        self.ollama_url = "http://localhost:11434/api/generate"

    async def generate_mcqs(self, prompt: str):
        # 1. Try Ollama (Local)
        try:
            async with aiohttp.ClientSession() as session:
                payload = {"model": "llama3", "prompt": prompt, "stream": False}
                async with session.post(self.ollama_url, json=payload, timeout=5) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        return data['response']
        except Exception:
            print("Ollama not found, switching to Gemini...")

        # 2. Try Gemini (Fast API)
        if self.gemini_key:
            try:
                client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                )
                return response.text
            except Exception as e:
                print(f"Gemini failed: {e}, switching to Groq...")

        # 3. Try Groq (Ultra-fast Backup)
        if self.groq_key:
            try:
                client = Groq(api_key=self.groq_key)
                chat_completion = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.1-8b-instant",
                )
                return chat_completion.choices[0].message.content
            except Exception as e:
                return f"Error: All providers failed. {str(e)}"

        return "No API keys provided for cloud fallback."
import io
import platform as plt_module
from PyPDF2 import PdfReader
from pdf2image import convert_from_bytes
import pytesseract

# --- DYNAMIC SYSTEM CONFIGURATION ---
# Use the alias 'plt_module' instead of 'platform'
if plt_module.system() == 'Windows':
    # LOCAL: Use your specific Windows paths
    POPPLER_PATH = r'C:\poppler\Library\bin' 
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
else:
    # PRODUCTION (Render/Linux): 
    POPPLER_PATH = None

def extract_text_from_memory(file_bytes: bytes) -> str:
    """Smart Hybrid Parser: Extracts text, uses OCR ONLY on pages that need it."""
    reader = PdfReader(io.BytesIO(file_bytes))
    full_text = ""
    
    # Process the PDF page by page
    for i, page in enumerate(reader.pages):
        page_text = page.extract_text()
        
        # Check if the page has actual text (more than just a few random characters)
        if page_text and len(page_text.strip()) > 20:
            full_text += page_text + "\n\n"
        else:
            print(f"🔍 No text found on page {i + 1}. Triggering OCR...")
            try:
                # Convert ONLY this specific page to an image
                # Note: pdf2image pages are 1-indexed, so we use i+1
                images = convert_from_bytes(
                    file_bytes, 
                    first_page=i + 1, 
                    last_page=i + 1, 
                    poppler_path=POPPLER_PATH
                )
                
                # Run Tesseract OCR on that single image
                for img in images:
                    ocr_text = pytesseract.image_to_string(img)
                    full_text += ocr_text + "\n\n"
            except Exception as e:
                print(f"⚠️ OCR failed on page {i + 1}: {e}")
                
    return full_text.strip()
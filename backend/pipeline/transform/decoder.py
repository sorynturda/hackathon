from docx import Document
from pypdf import PdfReader
from google import genai
from google.genai import types
from models.cv import CV
from prompts import llm_cv_prompt, llm_jd_prompt

client = genai.Client(api_key="API")


def get_text_pdf(filename):
    text = ""
    reader = PdfReader(filename)
    for page in reader.pages:
        text += page.extract_text() + '\n'
    return text


def get_text_docx(filename):
    doc = Document(filename)
    fullText = []
    for para in doc.paragraphs:
        fullText.append(para.text)
    return '\n'.join(fullText)



def callGemini(filename, filetype, type):
    file_text = get_text_docx(filename) if filetype=='docx' else get_text_pdf(filename)
    prompt = llm_cv_prompt + file_text if type == 'CV' else llm_jd_prompt + file_text
    response = client.models.generate_content(
        model="gemini-2.0-flash-lite", contents=prompt,
        config=types.GenerateContentConfig(
            # max_output_tokens=100,
            temperature=0.0
        )
    )
    print(response.usage_metadata.total_token_count)
    text = response.text
    text = text.removesuffix('```')
    text = text.removeprefix('```')
    index = text.find('{')
    result = text[index:] if index != -1 else text
    return result


# with open("img_prompt.txt", 'w') as f:
#     f.write(callGemini(prompt + image_response))
# # print(response.text)
# with open("pdf_prompt.txt", 'w') as f:
#     f.write(callGemini(prompt + txt))


from docx import Document
from pypdf import PdfReader
from google import genai
from google.genai import types
from models.cv import CV

llm_prompt = """You are a specialized CV analyzer that extracts structured information from a resume and returns it ONLY as a JSON object. Parse the CV systematically and output the data in the exact format specified below without any explanatory text.

Return your response in this exact JSON format:
{
    "TECHNICAL_SKILLS": ["skill1", "skill2", "skill3"],
    "SOFT_SKILLS": ["skill1", "skill2", "skill3"],
    "DOMAIN_KNOWLEDGE": ["domain1", "domain2", "domain3"],
    "PROFESSIONAL_EXPERIENCE": [
        {
            "company": "Company Name",
            "role": "Position Title",
            "period": ["start_date", "end_date"],
            "responsibilities": "Description of responsibilities"
        }
    ],
    "PROJECT_EXPERIENCE": [
        {
            "name": "Project Name",
            "technologies": ["tech1", "tech2", "tech3"],
            "description": "Brief description",
            "outcome": "Project outcome or link"
        }
    ],
    "CERTIFICATIONS": ["cert1", "cert2", "cert3"],
    "EDUCATION": [
        {
            "degree": "Degree Name",
            "institution": "Institution Name",
            "period": ["start_year", "end_year_or_Present"]
        }
    ],
    "LANGUAGES": [
        {
            "language": "Language Name",
            "proficiency": "Proficiency Level"
        }
    ]
}

Format dates consistently: use the original date format from the CV, preserving specificity (month/year or just year). For current positions, use "Present" as the end date.

Include ONLY information present in the CV. If a category has no relevant information, include an empty array for that category.

Return ONLY the JSON object. Do not include any introduction, explanations, backticks, code block markers, or additional text.\n"""

client = genai.Client(api_key="AIzaSyCvdbsLw-GOzbq0SXhg5b0bAN06fsAA2h4")


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



def callGeminiForCV(filename, type):
    file_text = get_text_docx(filename) if type=='docx' else get_text_pdf(filename)
    prompt = llm_prompt + file_text
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


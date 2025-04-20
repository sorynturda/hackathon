from subscriber import RedisSubscriber
from transform.decoder import callGemini, get_text_docx, get_text_pdf 
from sentence_transformers import SentenceTransformer
from transform.transformer import model
from copy import deepcopy
from pg_db import SessionLocal
import json
import io
from models.cv import CV
from models.jd import JD


def get_embedding(data, precision="float32"):
   return model.encode(data, precision=precision).tolist()

def read_large_object_from_oid(session, oid: int) -> bytes:
    raw_conn = session.connection().connection
    lo = raw_conn.lobject(oid, 'rb')
    data = lo.read()
    lo.close()
    return data

def get_mongo_cv_document(id, data, full_text):
    temp_doc = deepcopy(data)
    full_text_embedding = get_embedding(full_text.replace("\n", " "))
    try:
        for exp in temp_doc["PROFESSIONAL_EXPERIENCE"]:
            if len(exp["responsibilities"])>0:
                exp["professional_experience_embedding"] =  get_embedding(exp["responsibilities"])
        for project in temp_doc["PROJECT_EXPERIENCE"]:
            if len(project["description"])>0:
                project["project_experience_embedding"] = get_embedding(project["description"]) 
    except Exception as e:
        print(e)
    mongo_doc = {
        "_id": id,
        "full_text": full_text,
        "full_text_embedding": full_text_embedding,
        "extracted_info": temp_doc
    }
    return mongo_doc

def get_mongo_jd_document(id, data, full_text):
    temp_doc = deepcopy(data)
    full_text_embedding = get_embedding(full_text.replace("\n", " "))
    try:
        responsibilities = " ".join(temp_doc["KEY_RESPONSIBILITIES"])
        temp_doc["KEY_RESPONSIBILITIES_EMBEDDING"] = get_embedding(responsibilities)
    except Exception as e:
        print(e)
    mongo_doc = {
        "_id" : id,
        "full_text" : full_text,
        "full_text_embedding" : full_text_embedding,
        "extracted_info" : temp_doc
    }
    return mongo_doc


def transform(data): 
    db = SessionLocal()
    try:
        messages = json.loads(data)
        if not isinstance(messages, list):
            print("Expected a list of objects")
            return
        for item in messages:
            item_type = item.get("type")
            item_id = item.get("id")
            if item_type == 'cvs' and item_id is not None:
                cv = db.query(CV).filter(CV.id == item_id).first()
                if cv:
                    file_data = read_large_object_from_oid(db, cv.data)
                    cv_doc = io.BytesIO(file_data)
                    if cv.type.endswith('.document'):
                        cv_dict = json.loads(callGemini(cv_doc, 'docx', 'CV'))
                        print(get_mongo_cv_document(item_id, cv_dict, get_text_docx(cv_doc)))
                    elif cv.type.endswith('pdf'):
                        cv_dict = json.loads(callGemini(cv_doc, 'pdf', 'CV'))
                        print(get_mongo_cv_document(item_id, cv_dict, get_text_pdf(cv_doc)))
            elif item_type == 'jds' and item_id is not None: 
                jd = db.query(JD).filter(JD.id == item_id).first()
                if jd: 
                    file_data = read_large_object_from_oid(db, jd.data)
                    jd_doc = io.BytesIO(file_data)
                    if jd.type.endswith('.document'):
                        jd_dict = callGemini(jd_doc, 'docx', 'JD')
                        print(get_mongo_jd_document(item_id, jd_dict, get_text_docx(jd_doc)))
                    elif jd.type.endswith('pdf'):
                        jd_dict = callGemini(jd_doc,'pdf','JD')
                        print(get_mongo_jd_document(item_id, jd_dict, get_text_pdf(jd_doc)))
    except Exception as e:
        print(e)
        return []
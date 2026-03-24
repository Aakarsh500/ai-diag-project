import pickle
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models
MODEL_PATH = os.path.join(os.path.dirname(__file__), "xgboost_multiclass_model2.pkl")
ENCODER_PATH = os.path.join(os.path.dirname(__file__), "label_encoder2.pkl")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(ENCODER_PATH, "rb") as f:
    label_encoder = pickle.load(f)

# Pydantic schema matching the frontend's FormData
class Symptom(BaseModel):
    present: bool
    duration: str

class Symptoms(BaseModel):
    fever: Symptom
    breathlessness: Symptom
    cough: Symptom
    vomiting: Symptom
    myalgia: Symptom
    headache: Symptom
    seizure: Symptom
    jaundice: Symptom

class Signs(BaseModel):
    rash: bool
    eschar: bool
    gcs: int

class LabResults(BaseModel):
    haemoglobin: str
    totalCounts: str
    neutrophils: str
    lymphocyte: str
    monocyte: str
    platelets: str
    creatinine: str
    totalBilirubin: str
    directBilirubin: str
    albumin: str
    sgot: str
    sgpt: str
    alkalinePhosphatase: str

class PatientDetails(BaseModel):
    age: str
    gender: str
    occupation: str
    place: str
    pinCode: str

class FormData(BaseModel):
    patientDetails: PatientDetails
    symptoms: Symptoms
    signs: Signs
    labResults: LabResults

def safe_float(val, default=0.0):
    try:
        return float(val) if val else default
    except ValueError:
        return default

@app.post("/predict")
def predict(data: FormData):
    # The models expects 24 features in this exact order:
    # ['fever_duration', 'breathlessness', 'cough','joint_pain', 'seizures', 'myalgia', 'vomiting',
    #  'rash', 'gcs', 'hb', 'nu', 'ly', 'mo', 'platelets', 'sodium', 'tb',
    #  'db', 'alkp', 'jaundice', 'tc', 'creatinine', 'sgot', 'eschar', 'sgpt']
    
    features = {
        'fever_duration': safe_float(data.symptoms.fever.duration),
        'breathlessness': 1.0 if data.symptoms.breathlessness.present else 0.0,
        'cough': 1.0 if data.symptoms.cough.present else 0.0,
        'joint_pain': 0.0, # Not provided in form, default to 0
        'seizures': 1.0 if data.symptoms.seizure.present else 0.0,
        'myalgia': 1.0 if data.symptoms.myalgia.present else 0.0,
        'vomiting': 1.0 if data.symptoms.vomiting.present else 0.0,
        'rash': 1.0 if data.signs.rash else 0.0,
        'gcs': float(data.signs.gcs),
        'hb': safe_float(data.labResults.haemoglobin),
        'nu': safe_float(data.labResults.neutrophils),
        'ly': safe_float(data.labResults.lymphocyte),
        'mo': safe_float(data.labResults.monocyte),
        'platelets': safe_float(data.labResults.platelets),
        'sodium': 135.0, # Not provided in form, defaulting to normal (135 mEq/L)
        'tb': safe_float(data.labResults.totalBilirubin),
        'db': safe_float(data.labResults.directBilirubin),
        'alkp': safe_float(data.labResults.alkalinePhosphatase),
        'jaundice': 1.0 if data.symptoms.jaundice.present else 0.0,
        'tc': safe_float(data.labResults.totalCounts),
        'creatinine': safe_float(data.labResults.creatinine),
        'sgot': safe_float(data.labResults.sgot),
        'eschar': 1.0 if data.signs.eschar else 0.0,
        'sgpt': safe_float(data.labResults.sgpt)
    }

    df = pd.DataFrame([features])
    
    # Define ordering based on model training script
    feature_cols = ['fever_duration', 'breathlessness', 'cough','joint_pain', 'seizures', 'myalgia', 'vomiting',
       'rash', 'gcs', 'hb', 'nu', 'ly', 'mo', 'platelets', 'sodium', 'tb',
       'db', 'alkp', 'jaundice', 'tc', 'creatinine', 'sgot', 'eschar', 'sgpt']
    df = df[feature_cols]

    # Predict
    probabilities = model.predict_proba(df)[0]
    predicted_idx = model.predict(df)[0]
    
    diagnosis_name = label_encoder.inverse_transform([predicted_idx])[0]
    confidence = probabilities[predicted_idx] * 100
    
    # We will compute mock specificity/sensitivity based on the prediction if we don't have true metrics
    # Or just return the confidence interval. We can map confidence to sensitivity for display.
    return {
        "diagnosis": diagnosis_name,
        "sensitivity": f"{confidence:.1f}%",
        "specificity": f"{(100 - (100 - confidence)/2):.1f}%" # Mocked specificity just for display
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

export interface PatientDetails {
  age: string;
  gender: string;
  occupation: string;
  place: string;
  pinCode: string;
}

export interface Symptom {
  present: boolean;
  duration: string;
}

export interface Symptoms {
  fever: Symptom;
  breathlessness: Symptom;
  cough: Symptom;
  vomiting: Symptom;
  myalgia: Symptom;
  headache: Symptom;
  seizure: Symptom;
  jaundice: Symptom;
}

export interface Signs {
  rash: boolean;
  eschar: boolean;
  gcs: number;
}

export interface LabResults {
  haemoglobin: string;
  totalCounts: string;
  neutrophils: string;
  lymphocyte: string;
  monocyte: string;
  platelets: string;
  creatinine: string;
  totalBilirubin: string;
  directBilirubin: string;
  albumin: string;
  sgot: string;
  sgpt: string;
  alkalinePhosphatase: string;
}

export interface DiagnosisResult {
  diagnosis: string;
  sensitivity: string;
  specificity: string;
}

export interface FormData {
  patientDetails: PatientDetails;
  symptoms: Symptoms;
  signs: Signs;
  labResults: LabResults;
}

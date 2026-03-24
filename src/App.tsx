import { useState, useCallback } from 'react';
import { ProgressIndicator } from './components/ProgressIndicator';
import { PatientDetails } from './components/PatientDetails';
import { Symptoms } from './components/Symptoms';
import { Signs } from './components/Signs';
import { LabResults } from './components/LabResults';
import { DiagnosisResult } from './components/DiagnosisResult';
import {
  PatientDetails as PatientDetailsType,
  Symptoms as SymptomsType,
  Signs as SignsType,
  LabResults as LabResultsType,
  FormData,
} from './types';

const initialPatientDetails: PatientDetailsType = {
  age: '',
  gender: '',
  occupation: '',
  place: '',
  pinCode: '',
};

const initialSymptoms: SymptomsType = {
  fever: { present: false, duration: '' },
  breathlessness: { present: false, duration: '' },
  cough: { present: false, duration: '' },
  vomiting: { present: false, duration: '' },
  myalgia: { present: false, duration: '' },
  headache: { present: false, duration: '' },
  seizure: { present: false, duration: '' },
  jaundice: { present: false, duration: '' },
};

const initialSigns: SignsType = {
  rash: false,
  eschar: false,
  gcs: 15,
};

const initialLabResults: LabResultsType = {
  haemoglobin: '',
  totalCounts: '',
  neutrophils: '',
  lymphocyte: '',
  monocyte: '',
  platelets: '',
  creatinine: '',
  totalBilirubin: '',
  directBilirubin: '',
  albumin: '',
  sgot: '',
  sgpt: '',
  alkalinePhosphatase: '',
};

const steps = [
  {
    id: 1,
    title: 'Patient Info',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Symptoms',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Signs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Lab Results',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Diagnosis',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [patientDetails, setPatientDetails] = useState<PatientDetailsType>(initialPatientDetails);
  const [symptoms, setSymptoms] = useState<SymptomsType>(initialSymptoms);
  const [signs, setSigns] = useState<SignsType>(initialSigns);
  const [labResults, setLabResults] = useState<LabResultsType>(initialLabResults);

  const handleStepComplete = useCallback((step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step]);
    }
    if (step < 5) {
      setCurrentStep(step + 1);
    }
  }, [completedSteps]);

  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleStartOver = useCallback(() => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setPatientDetails(initialPatientDetails);
    setSymptoms(initialSymptoms);
    setSigns(initialSigns);
    setLabResults(initialLabResults);
  }, []);

  const formData: FormData = {
    patientDetails,
    symptoms,
    signs,
    labResults,
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientDetails
            data={patientDetails}
            onChange={setPatientDetails}
            onComplete={() => handleStepComplete(1)}
          />
        );
      case 2:
        return (
          <Symptoms
            data={symptoms}
            onChange={setSymptoms}
            onComplete={() => handleStepComplete(2)}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Signs
            data={signs}
            onChange={setSigns}
            onComplete={() => handleStepComplete(3)}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <LabResults
            data={labResults}
            onChange={setLabResults}
            onComplete={() => handleStepComplete(4)}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <DiagnosisResult
            formData={formData}
            onStartOver={handleStartOver}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Medical Diagnosis Assistant</h1>
              <p className="text-sm text-slate-500">AI-Powered Disease Prediction Tool</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-4">
        <ProgressIndicator
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          completedSteps={completedSteps}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderStep()}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-slate-400">
        <p>Medical Diagnosis Assistant &copy; {new Date().getFullYear()}</p>
        <p className="text-xs mt-1">For research and educational purposes only</p>
      </footer>
    </div>
  );
}

export default App;

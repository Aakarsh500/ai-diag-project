
import { LabResults as LabResultsType } from '../types';
import { cn } from '../utils/cn';

interface LabResultsProps {
  data: LabResultsType;
  onChange: (data: LabResultsType) => void;
  onComplete: () => void;
  onBack: () => void;
}

interface LabField {
  key: keyof LabResultsType;
  label: string;
  unit: string;
  placeholder: string;
  normalRange?: string;
}

const labFields: LabField[] = [
  { key: 'haemoglobin', label: 'Haemoglobin', unit: 'g/dL', placeholder: '12.0', normalRange: '12-16' },
  { key: 'totalCounts', label: 'Total WBC Count', unit: '/μL', placeholder: '7000', normalRange: '4000-11000' },
  { key: 'neutrophils', label: 'Neutrophils', unit: '%', placeholder: '60', normalRange: '40-70' },
  { key: 'lymphocyte', label: 'Lymphocytes', unit: '%', placeholder: '30', normalRange: '20-40' },
  { key: 'monocyte', label: 'Monocytes', unit: '%', placeholder: '5', normalRange: '2-8' },
  { key: 'platelets', label: 'Platelets', unit: '/μL', placeholder: '250000', normalRange: '150k-400k' },
  { key: 'creatinine', label: 'Creatinine', unit: 'mg/dL', placeholder: '1.0', normalRange: '0.7-1.3' },
  { key: 'totalBilirubin', label: 'Total Bilirubin', unit: 'mg/dL', placeholder: '0.8', normalRange: '0.1-1.2' },
  { key: 'directBilirubin', label: 'Direct Bilirubin', unit: 'mg/dL', placeholder: '0.2', normalRange: '0-0.3' },
  { key: 'albumin', label: 'Albumin', unit: 'g/dL', placeholder: '4.0', normalRange: '3.5-5.5' },
  { key: 'sgot', label: 'SGOT (AST)', unit: 'U/L', placeholder: '25', normalRange: '8-45' },
  { key: 'sgpt', label: 'SGPT (ALT)', unit: 'U/L', placeholder: '30', normalRange: '7-56' },
  { key: 'alkalinePhosphatase', label: 'Alkaline Phosphatase', unit: 'U/L', placeholder: '70', normalRange: '44-147' },
];

export const LabResults: React.FC<LabResultsProps> = ({ data, onChange, onComplete, onBack }) => {
  const handleChange = (key: keyof LabResultsType, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const filledCount = Object.values(data).filter((v) => v !== '').length;
  const totalFields = labFields.length;
  const progress = (filledCount / totalFields) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Laboratory Results</h2>
        <p className="text-slate-500 mt-2">Enter the patient's lab values</p>
        
        {/* Progress indicator */}
        <div className="mt-4 max-w-xs mx-auto">
          <div className="flex justify-between text-sm text-slate-500 mb-1">
            <span>Completion</span>
            <span>{filledCount}/{totalFields} fields</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
        <div className="flex flex-col gap-3">
          {labFields.map((field, index) => (
            <div
              key={field.key}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200",
                data[field.key]
                  ? "border-teal-200 bg-teal-50"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Number indicator for easy tracking */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                  data[field.key]
                    ? "bg-teal-500 text-white"
                    : "bg-slate-200 text-slate-500"
                )}>
                  {index + 1}
                </div>
                
                {/* Label and normal range */}
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-semibold text-slate-700">
                    {field.label}
                  </label>
                  {field.normalRange && (
                    <p className="text-xs text-slate-400">Normal: {field.normalRange}</p>
                  )}
                </div>
                
                {/* Input field */}
                <div className="relative flex-shrink-0">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={data[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={cn(
                      "w-28 px-3 py-2.5 pr-2 rounded-lg border-2 outline-none transition-all duration-200 text-lg font-medium text-center",
                      data[field.key]
                        ? "border-teal-400 bg-white focus:ring-2 focus:ring-teal-200"
                        : "border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    )}
                  />
                </div>
                
                {/* Unit */}
                <span className="text-sm text-slate-400 font-medium w-12 flex-shrink-0">
                  {field.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between gap-4">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-slate-600 bg-white border-2 border-slate-200 hover:border-slate-300 transition-all duration-300"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </button>
        <button
          onClick={onComplete}
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Get Diagnosis
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};


import { Symptoms as SymptomsType, Symptom } from '../types';
import { cn } from '../utils/cn';

interface SymptomsProps {
  data: SymptomsType;
  onChange: (data: SymptomsType) => void;
  onComplete: () => void;
  onBack: () => void;
}

const symptomLabels: { key: keyof SymptomsType; label: string; description: string }[] = [
  { key: 'fever', label: 'Fever', description: 'Elevated body temperature' },
  { key: 'breathlessness', label: 'Breathlessness', description: 'Difficulty breathing' },
  { key: 'cough', label: 'Cough', description: 'Persistent coughing' },
  { key: 'vomiting', label: 'Vomiting', description: 'Nausea and vomiting' },
  { key: 'myalgia', label: 'Myalgia', description: 'Muscle pain or aches' },
  { key: 'headache', label: 'Headache', description: 'Head pain' },
  { key: 'seizure', label: 'Seizure', description: 'Convulsions or fits' },
  { key: 'jaundice', label: 'Jaundice', description: 'Yellowing of skin/eyes' },
];

const durationOptions = [
  { value: '1-3', label: '1-3 days' },
  { value: '4-7', label: '4-7 days' },
  { value: '8-14', label: '1-2 weeks' },
  { value: '15+', label: '> 2 weeks' },
];

export const Symptoms: React.FC<SymptomsProps> = ({ data, onChange, onComplete, onBack }) => {
  const handleToggle = (key: keyof SymptomsType) => {
    const current = data[key] as Symptom;
    onChange({
      ...data,
      [key]: { ...current, present: !current.present, duration: !current.present ? current.duration : '' },
    });
  };

  const handleDuration = (key: keyof SymptomsType, duration: string) => {
    const current = data[key] as Symptom;
    onChange({
      ...data,
      [key]: { ...current, duration },
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Symptoms Assessment</h2>
        <p className="text-slate-500 mt-2">Select all symptoms the patient is experiencing</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-3">
        {symptomLabels.map(({ key, label, description }) => {
          const symptom = data[key] as Symptom;
          return (
            <div
              key={key}
              className={cn(
                "rounded-xl border-2 transition-all duration-300 overflow-hidden",
                symptom.present
                  ? "border-teal-400 bg-teal-50"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <button
                type="button"
                onClick={() => handleToggle(key)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                      symptom.present
                        ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    )}
                  >
                    {symptom.present ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-slate-800 text-lg">{label}</span>
                    <p className="text-sm text-slate-500">{description}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                    symptom.present
                      ? "bg-teal-500 text-white"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  {symptom.present ? 'Yes' : 'No'}
                </div>
              </button>

              {/* Duration selector - slides down when symptom is present */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  symptom.present ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-4 pb-4 pt-2 border-t border-teal-200 bg-teal-50">
                  <label className="block text-sm font-medium text-teal-700 mb-2">Duration:</label>
                  <div className="flex flex-wrap gap-2">
                    {durationOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleDuration(key, option.value)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          symptom.duration === option.value
                            ? "bg-teal-500 text-white shadow-md"
                            : "bg-white text-teal-700 border border-teal-300 hover:bg-teal-100"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
          Continue to Signs
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

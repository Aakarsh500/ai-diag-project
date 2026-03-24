
import { PatientDetails as PatientDetailsType } from '../types';
import { cn } from '../utils/cn';

interface PatientDetailsProps {
  data: PatientDetailsType;
  onChange: (data: PatientDetailsType) => void;
  onComplete: () => void;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({ data, onChange, onComplete }) => {
  const handleChange = (field: keyof PatientDetailsType, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isValid = data.age && data.gender;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Patient Information</h2>
        <p className="text-slate-500 mt-2">Let's start with some basic details</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="150"
              value={data.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all duration-200 text-lg"
              placeholder="Enter age"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {['Male', 'Female', 'Other'].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleChange('gender', gender)}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 border-2",
                    data.gender === gender
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent shadow-lg"
                      : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-teal-50"
                  )}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Occupation</label>
          <input
            type="text"
            value={data.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all duration-200"
            placeholder="e.g., Farmer, Teacher, Engineer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Place</label>
            <input
              type="text"
              value={data.place}
              onChange={(e) => handleChange('place', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all duration-200"
              placeholder="City or village name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Pin Code</label>
            <input
              type="text"
              maxLength={6}
              value={data.pinCode}
              onChange={(e) => handleChange('pinCode', e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all duration-200"
              placeholder="6-digit pin code"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onComplete}
          disabled={!isValid}
          className={cn(
            "group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300",
            isValid
              ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
          Continue to Symptoms
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

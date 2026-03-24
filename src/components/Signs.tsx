
import { Signs as SignsType } from '../types';
import { cn } from '../utils/cn';

interface SignsProps {
  data: SignsType;
  onChange: (data: SignsType) => void;
  onComplete: () => void;
  onBack: () => void;
}

export const Signs: React.FC<SignsProps> = ({ data, onChange, onComplete, onBack }) => {
  const handleToggle = (field: 'rash' | 'eschar') => {
    onChange({ ...data, [field]: !data[field] });
  };

  const handleGCS = (value: number) => {
    onChange({ ...data, gcs: Math.min(15, Math.max(3, value)) });
  };

  const getGCSDescription = (gcs: number): { text: string; color: string } => {
    if (gcs >= 13) return { text: 'Mild (13-15)', color: 'text-green-600' };
    if (gcs >= 9) return { text: 'Moderate (9-12)', color: 'text-yellow-600' };
    return { text: 'Severe (3-8)', color: 'text-red-600' };
  };

  const gcsInfo = getGCSDescription(data.gcs);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Clinical Signs</h2>
        <p className="text-slate-500 mt-2">Record the physical examination findings</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* Rash */}
        <div className="space-y-3">
          <label className="block text-lg font-semibold text-slate-700">Rash Present?</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleToggle('rash')}
              className={cn(
                "flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 border-2",
                data.rash
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent shadow-lg"
                  : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                {data.rash && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Yes
              </div>
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...data, rash: false })}
              className={cn(
                "flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 border-2",
                !data.rash
                  ? "bg-slate-600 text-white border-transparent shadow-lg"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              )}
            >
              No
            </button>
          </div>
        </div>

        {/* Eschar */}
        <div className="space-y-3">
          <label className="block text-lg font-semibold text-slate-700">Eschar Present?</label>
          <p className="text-sm text-slate-500 -mt-1">Dark scab typically seen in scrub typhus</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleToggle('eschar')}
              className={cn(
                "flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 border-2",
                data.eschar
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent shadow-lg"
                  : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                {data.eschar && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Yes
              </div>
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...data, eschar: false })}
              className={cn(
                "flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 border-2",
                !data.eschar
                  ? "bg-slate-600 text-white border-transparent shadow-lg"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              )}
            >
              No
            </button>
          </div>
        </div>

        {/* GCS Score */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-lg font-semibold text-slate-700">Glasgow Coma Scale (GCS)</label>
              <p className="text-sm text-slate-500">Score range: 3-15</p>
            </div>
            <div className={cn("text-sm font-medium", gcsInfo.color)}>
              {gcsInfo.text}
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => handleGCS(data.gcs - 1)}
                disabled={data.gcs <= 3}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-200",
                  data.gcs > 3
                    ? "bg-white text-slate-700 shadow-md hover:shadow-lg active:scale-95 border-2 border-slate-200"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                −
              </button>
              
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  {data.gcs}
                </div>
                <div className="text-sm text-slate-500 mt-1">GCS Score</div>
              </div>
              
              <button
                type="button"
                onClick={() => handleGCS(data.gcs + 1)}
                disabled={data.gcs >= 15}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-200",
                  data.gcs < 15
                    ? "bg-white text-slate-700 shadow-md hover:shadow-lg active:scale-95 border-2 border-slate-200"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                +
              </button>
            </div>

            {/* GCS Visual Scale */}
            <div className="mt-6">
              <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${((data.gcs - 3) / 12) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>3</span>
                <span>9</span>
                <span>15</span>
              </div>
            </div>
          </div>
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
          Continue to Lab Results
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

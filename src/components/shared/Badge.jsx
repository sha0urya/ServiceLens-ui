const INTENT_COLORS = {
  FIND_IMPLEMENTATION: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  TRACE_CALL_CHAIN: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  TRACE_CALLERS: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  IMPACT_ANALYSIS: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  FIND_CONFIGURATION: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  UNDERSTAND_CONTRACT: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  DEBUG_ERROR: 'bg-red-500/15 text-red-400 border-red-500/30',
  NULL_SAFETY: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  UNDERSTAND_BUSINESS_RULE: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  FIND_ENDPOINTS: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  FIND_TESTS: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
};

const TYPE_COLORS = {
  CODE: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  TEST: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  CONFIG: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  SCHEMA: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  API_SPEC: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  DOCUMENTATION: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  BUSINESS_CONTEXT: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
};

export default function Badge({ label, variant = 'default' }) {
  let colors = 'bg-gray-500/15 text-gray-400 border-gray-500/30';

  if (variant === 'intent') {
    colors = INTENT_COLORS[label] || colors;
  } else if (variant === 'type') {
    colors = TYPE_COLORS[label] || colors;
  } else if (variant === 'confidence') {
    const val = parseFloat(label);
    if (val >= 0.8) colors = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    else if (val >= 0.5) colors = 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
    else colors = 'bg-red-500/15 text-red-400 border-red-500/30';
  } else if (variant === 'model') {
    colors = 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
  }

  const displayLabel = variant === 'intent'
    ? label.replace(/_/g, ' ').toLowerCase()
    : variant === 'confidence'
      ? `${(parseFloat(label) * 100).toFixed(0)}%`
      : label;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colors}`}>
      {displayLabel}
    </span>
  );
}

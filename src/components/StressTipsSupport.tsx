import React, { useState } from 'react';
import { 
  Heart, 
  ShieldAlert, 
  Wind, 
  Sparkles, 
  CheckCircle2, 
  PhoneCall, 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronRight, 
  HelpCircle,
  Eye,
  Volume2,
  RefreshCw,
  Sun,
  Flame,
  Activity,
  Pause,
  HeartHandshake,
  LogOut,
  Stethoscope,
  LifeBuoy,
  Users,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StressCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface StressTipsSupportProps {
  currentCategory?: StressCategory;
  stressScore?: number;
  onSelectBreathing?: () => void;
}

export const StressTipsSupport: React.FC<StressTipsSupportProps> = ({
  currentCategory = 'LOW',
  stressScore = 25,
  onSelectBreathing,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<StressCategory>(() => {
    if (currentCategory === 'MEDIUM') return 'MODERATE';
    return currentCategory || 'LOW';
  });
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathCount, setBreathCount] = useState<number>(0);
  const [breathTimer, setBreathTimer] = useState<NodeJS.Timeout | null>(null);

  // Sync tab when assessment category changes
  React.useEffect(() => {
    if (currentCategory) {
      setActiveTab(currentCategory === 'MEDIUM' ? 'MODERATE' : currentCategory);
    }
  }, [currentCategory]);

  const handleCopySupportNote = () => {
    const note = `${t('tips.immediateAnchor', 'Immediate Calming Anchor')}:\n` +
      `1. ${t('tips.stepInhale', 'Inhale slowly through your nose for 4 seconds.')}\n` +
      `2. ${t('tips.stepHold', 'Hold gently for 7 seconds.')}\n` +
      `3. ${t('tips.stepExhale', 'Exhale smoothly for 8 seconds.')}\n` +
      `4. ${t('tips.step54321', 'Name 5 things you see, 4 things you can feel, 3 things you hear, 2 things you smell, and 1 positive affirmation.')}\n` +
      `${t('nav.crisisSupport', '24/7 Helpline: 14566')}`;
    navigator.clipboard?.writeText(note);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  const handleCopyHighStressTips = () => {
    const tipsList = `${t('tips.highTitle', 'High Stress Safety Tips & Support')}:\n` +
      `1. ${t('tips.highTip1Title', 'Pause and focus on one task at a time.')}\n` +
      `2. ${t('tips.highTip2Title', 'Use calming breathing or grounding exercises.')}\n` +
      `3. ${t('tips.highTip3Title', 'Share your feelings with someone you trust.')}\n` +
      `4. ${t('tips.highTip4Title', 'Take time away from overwhelming situations when possible.')}\n` +
      `5. ${t('tips.highTip5Title', 'Consider speaking with a counselor or mental health professional.')}\n` +
      `6. ${t('tips.highTip6Title', 'Seek help if stress continues or affects daily life.')}\n` +
      `${t('tips.call247', 'Emergency Crisis Helpline: 14566')}`;
    navigator.clipboard?.writeText(tipsList);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  const handleCopyRiskStressTips = () => {
    const tipsList = `${t('tips.riskTab', 'Risk Level High Safety Tips & Support')}:\n` +
      `1. ${t('tips.riskTip1Title', 'Reach out to a trusted adult, family member, or counselor.')}\n` +
      `2. ${t('tips.riskTip2Title', 'Seek professional mental health support as soon as possible.')}\n` +
      `3. ${t('tips.riskTip3Title', 'Move to a quiet, comfortable place and focus on immediate needs.')}\n` +
      `4. ${t('tips.riskTip4Title', 'Avoid handling overwhelming stress completely alone.')}\n` +
      `${t('tips.call247', 'Emergency Crisis Helpline: 14566')}`;
    navigator.clipboard?.writeText(tipsList);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  const startGuidedBreath = (mode: 'box' | '478' | 'sigh') => {
    if (breathTimer) clearInterval(breathTimer);
    setBreathPhase('inhale');
    setBreathCount(mode === '478' ? 4 : mode === 'box' ? 4 : 2);

    let count = mode === '478' ? 4 : mode === 'box' ? 4 : 2;
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';

    const timer = setInterval(() => {
      count -= 1;
      setBreathCount(count);

      if (count <= 0) {
        if (mode === '478') {
          if (phase === 'inhale') {
            phase = 'hold';
            count = 7;
          } else if (phase === 'hold') {
            phase = 'exhale';
            count = 8;
          } else {
            phase = 'inhale';
            count = 4;
          }
        } else if (mode === 'box') {
          if (phase === 'inhale') {
            phase = 'hold';
            count = 4;
          } else if (phase === 'hold') {
            phase = 'exhale';
            count = 4;
          } else {
            phase = 'inhale';
            count = 4;
          }
        } else {
          // Physiological sigh
          if (phase === 'inhale') {
            phase = 'exhale';
            count = 6;
          } else {
            phase = 'inhale';
            count = 3;
          }
        }
        setBreathPhase(phase);
        setBreathCount(count);
      }
    }, 1000);

    setBreathTimer(timer);
  };

  const stopGuidedBreath = () => {
    if (breathTimer) clearInterval(breathTimer);
    setBreathPhase('idle');
    setBreathCount(0);
  };

  const isHighSafety = activeTab === 'HIGH' || activeTab === 'RISK';

  return (
    <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {isHighSafety ? (
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            ) : (
              <Sparkles className="w-4 h-4 text-sky-600" />
            )}
            <h3 className="font-bold text-stone-900 text-lg tracking-tight">
              {isHighSafety 
                ? t('tips.highTitle', 'High Safety Tips & Support') 
                : t('tips.title', 'Personalized Tips & Support by Stress Level')}
            </h3>
            {isHighSafety && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200">
                {t('tips.highSafetyBadge', 'High Safety Protocol Active')}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500">
            {isHighSafety
              ? t('tips.highSubtitle', 'Urgent clinical de-escalation protocols, somatic calming anchors, and 24/7 crisis emergency response resources.')
              : t('tips.subtitle', 'Scientifically grounded physiological recommendations and emergency support resources tailored for your state.')}
          </p>
        </div>

        {/* Level Switcher Tabs */}
        <div className="flex flex-wrap items-center p-1 bg-stone-100 rounded-xl border border-stone-200 gap-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('LOW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'LOW'
                ? 'bg-sky-100 text-sky-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-sky-600" />
            <span>{t('tips.lowTab', 'Low (0–35)')}</span>
          </button>

          <button
            onClick={() => setActiveTab('MODERATE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'MODERATE' || activeTab === 'MEDIUM'
                ? 'bg-amber-100 text-amber-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('tips.moderateTab', 'Moderate (36–65)')}</span>
          </button>

          <button
            onClick={() => setActiveTab('HIGH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'HIGH'
                ? 'bg-orange-100 text-orange-950 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span>{t('tips.highTab', 'High Safety Tips (66–84)')}</span>
          </button>

          <button
            onClick={() => setActiveTab('RISK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'RISK'
                ? 'bg-rose-100 text-rose-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
            <span>{t('tips.riskTab', 'Risk Level High Safety Tips (85–100)')}</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* ================= LOW STRESS (0–35) ================= */}
        {activeTab === 'LOW' && (
          <motion.div
            key="low"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Status Banner */}
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900">
                  Equilibrium & Parasympathetic Tone Verified (0–35)
                </h4>
                <p className="text-xs text-stone-700 mt-0.5">
                  Your vocal cords exhibit steady cadence, relaxed phonation, and low jitter. Maintain this equilibrium with simple preventive habits.
                </p>
              </div>
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                  Vocal Cord Hydration
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Sip room-temperature water regularly. Adequate laryngeal hydration reduces subglottic pressure and eliminates pitch jitter.
                </p>
                <div className="text-[11px] text-sky-800 font-medium">
                  ✓ Minimizes vocal fatigue during long calls or workdays
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-sky-700" />
                  Box Breathing Cadence
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Practice 4-4-4-4 rhythm: 4 seconds in, 4 seconds hold, 4 seconds out, 4 seconds hold. Stabilizes heart rate variability (HRV).
                </p>
                <button
                  onClick={() => startGuidedBreath('box')}
                  className="text-xs text-sky-800 font-semibold hover:underline flex items-center gap-1"
                >
                  Start Box Breathing Pacer
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-700" />
                  Proactive Routine
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Maintain regular sleep schedules, steady vocal hydration, and mindful micro-breaks while your nervous system remains balanced.
                </p>
                <div className="text-[11px] text-stone-400">
                  Builds neuro-resilience against future acute stress spikes
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= MODERATE STRESS (36–65) ================= */}
        {(activeTab === 'MODERATE' || activeTab === 'MEDIUM') && (
          <motion.div
            key="moderate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Status Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                  Elevated Vocal Cadence & Workday Strain Detected (36–65)
                </h4>
                <p className="text-xs text-stone-700 mt-0.5">
                  Your speech exhibits accelerated words-per-minute, truncated micro-pauses, or fatigue. Apply quick de-escalation methods now.
                </p>
              </div>
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2">
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-amber-700" />
                  4-7-8 Diaphragmatic Breath
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Inhale through the nose for 4s, hold for 7s, exhale completely through mouth for 8s. Directly engages the vagus nerve brake.
                </p>
                <button
                  onClick={() => startGuidedBreath('478')}
                  className="text-xs text-amber-800 font-semibold hover:underline flex items-center gap-1"
                >
                  Start 4-7-8 Breathing Guide
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2">
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-700" />
                  5-4-3-2-1 Sensory Grounding
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Name 5 things you see, 4 you can physically touch, 3 sounds you hear, 2 scents, and 1 positive affirmation. Pulls focus out of distress loops.
                </p>
                <div className="text-[11px] text-amber-900 font-medium">
                  ✓ Re-centers prefrontal cortex cognitive control
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2">
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-700" />
                  Pre-Escalation Check-in
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Take a 5-minute break away from high-stimulus screens, stretch your shoulders and neck, and hydrate with water.
                </p>
                <div className="text-[11px] text-stone-400">
                  Prevents cognitive exhaustion from deepening into acute panic
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= HIGH STRESS (66–84) ================= */}
        {activeTab === 'HIGH' && (
          <motion.div
            key="high"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Status Banner */}
            <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-900 flex items-center justify-center font-bold shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-950">
                    High Safety Tips & Support (66–84)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-200/80 text-orange-950">
                    Acute Sympathetic Arousal
                  </span>
                </div>
                <p className="text-xs text-stone-800 mt-1 leading-relaxed">
                  Noticeable vocal pitch jitter, hurried tempo, and vocal strain detected. Initiate immediate high safety down-regulation to relieve acute anxiety.
                </p>
              </div>
            </div>

            {/* High Stress Tips - 6 Core Practices */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-orange-950">
                  {t('tips.highActionPlan', 'Recommended High Safety Tips & Action Plan')}
                </h5>
              </div>
              <button
                onClick={handleCopyHighStressTips}
                className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200/80 text-orange-950 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-orange-200 shadow-2xs"
              >
                {copiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMemo ? 'Copied 6 Tips Checklist!' : 'Copy High Safety Tips'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Tip 1 */}
              <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200/90 space-y-2 flex flex-col justify-between hover:bg-orange-50/70 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
                      <Pause className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-orange-900/80 uppercase tracking-wider">Step 1</span>
                  </div>
                  <h6 className="text-xs font-bold text-orange-950 leading-snug">
                    {t('tips.highTip1Title', 'Pause and focus on one task at a time.')}
                  </h6>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Clear multitasking clutter and pause immediate demands. Monotasking dramatically reduces cognitive friction and settles rapid heart rate.
                  </p>
                </div>
                <div className="text-[11px] text-orange-900 font-medium pt-2 border-t border-orange-200/60">
                  ✓ Protects mental bandwidth
                </div>
              </div>

              {/* Tip 2 */}
              <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200/90 space-y-2 flex flex-col justify-between hover:bg-orange-50/70 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
                      <Wind className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-orange-900/80 uppercase tracking-wider">Step 2</span>
                  </div>
                  <h6 className="text-xs font-bold text-orange-950 leading-snug">
                    {t('tips.highTip2Title', 'Use calming breathing or grounding exercises.')}
                  </h6>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Practice slow physiological exhalations or sensory grounding (5-4-3-2-1) to down-regulate acute sympathetic stress triggers.
                  </p>
                </div>
                <button
                  onClick={() => startGuidedBreath('sigh')}
                  className="mt-2 w-full py-1.5 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Wind className="w-3.5 h-3.5" />
                  Start Calming Breathing
                </button>
              </div>

              {/* Tip 3 */}
              <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200/90 space-y-2 flex flex-col justify-between hover:bg-orange-50/70 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-orange-900/80 uppercase tracking-wider">Step 3</span>
                  </div>
                  <h6 className="text-xs font-bold text-orange-950 leading-snug">
                    {t('tips.highTip3Title', 'Share your feelings with someone you trust.')}
                  </h6>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Expressing what you are going through to a close friend, colleague, or loved one dissolves internal isolation and provides emotional grounding.
                  </p>
                </div>
                <div className="text-[11px] text-orange-900 font-medium pt-2 border-t border-orange-200/60">
                  ✓ Co-regulation through connection
                </div>
              </div>

              {/* Tip 4 */}
              <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200/90 space-y-2 flex flex-col justify-between hover:bg-orange-50/70 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
                      <LogOut className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-orange-900/80 uppercase tracking-wider">Step 4</span>
                  </div>
                  <h6 className="text-xs font-bold text-orange-950 leading-snug">
                    {t('tips.highTip4Title', 'Take time away from overwhelming situations when possible.')}
                  </h6>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Step outside into fresh air or step away into a quieter room. Creating physical space from acute stressors resets sensory thresholds.
                  </p>
                </div>
                <div className="text-[11px] text-orange-900 font-medium pt-2 border-t border-orange-200/60">
                  ✓ Immediate sensory decompression
                </div>
              </div>

              {/* Tip 5 */}
              <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200/90 space-y-2 flex flex-col justify-between hover:bg-orange-50/70 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-orange-900/80 uppercase tracking-wider">Step 5</span>
                  </div>
                  <h6 className="text-xs font-bold text-orange-950 leading-snug">
                    {t('tips.highTip5Title', 'Consider speaking with a counselor or mental health professional.')}
                  </h6>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Professional clinicians offer customized evidence-based modalities like CBT and somatic therapies to address root drivers of chronic strain.
                  </p>
                </div>
                <div className="text-[11px] text-orange-900 font-medium pt-2 border-t border-orange-200/60">
                  ✓ Structured therapeutic guidance
                </div>
              </div>

              {/* Tip 6 */}
              <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200/90 space-y-2 flex flex-col justify-between hover:bg-orange-50/70 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
                      <LifeBuoy className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-orange-900/80 uppercase tracking-wider">Step 6</span>
                  </div>
                  <h6 className="text-xs font-bold text-orange-950 leading-snug">
                    {t('tips.highTip6Title', 'Seek help if stress continues or affects daily life.')}
                  </h6>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Persistent tension, panic spikes, or disrupted sleep warrant compassionate intervention. Confidential support is available 24/7.
                  </p>
                </div>
                <a
                  href="tel:14566"
                  className="mt-2 w-full py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  {t('tips.callHelpline', 'Call 24/7 Crisis Support: 14566')}
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= RISK LEVEL (85–100) ================= */}
        {activeTab === 'RISK' && (
          <motion.div
            key="risk"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Status Banner */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold shrink-0">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                    High Safety Tips & Support (85–100)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-950">
                    Critical Emergency Armed
                  </span>
                </div>
                <p className="text-xs text-stone-800 mt-1 leading-relaxed">
                  Severe vocal tremor, breath gasps, or acute panic expressions detected. High safety emergency protocol is triggered with SMS notification dispatched to your designated contact and 24/7 Helpline direct dial.
                </p>
              </div>
            </div>

            {/* Critical Risk Tips - 4 Core Actions */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-rose-950">
                  {t('tips.riskActionPlan', 'Immediate Risk Safety Tips & Protocol')}
                </h5>
              </div>
              <button
                onClick={handleCopyRiskStressTips}
                className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200/80 text-rose-950 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-rose-200 shadow-2xs"
              >
                {copiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMemo ? t('tips.copiedTips', 'Copied 4 Tips Checklist!') : t('tips.copyTips', 'Copy Risk Safety Tips')}
              </button>
            </div>

            {/* 4 Core Risk Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tip 1 */}
              <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-2 flex flex-col justify-between hover:bg-rose-50/70 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-rose-900/80 uppercase tracking-wider">Step 1</span>
                  </div>
                  <h6 className="text-xs font-bold text-rose-950 leading-snug">
                    {t('tips.riskTip1Title', 'Reach out to a trusted adult, family member, or counselor.')}
                  </h6>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {t('tips.riskTip1Desc', 'Contact someone in your support circle right away. Having a trusted person present provides emotional safety, co-regulation, and de-escalates acute feelings of panic.')}
                  </p>
                </div>
                <div className="text-[11px] text-rose-900 font-medium pt-2 border-t border-rose-200/60">
                  ✓ Immediate human connection and co-regulation
                </div>
              </div>

              {/* Tip 2 */}
              <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-2 flex flex-col justify-between hover:bg-rose-50/70 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-rose-900/80 uppercase tracking-wider">Step 2</span>
                  </div>
                  <h6 className="text-xs font-bold text-rose-950 leading-snug">
                    {t('tips.riskTip2Title', 'Seek professional mental health support as soon as possible.')}
                  </h6>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {t('tips.riskTip2Desc', 'Acute vocal distress and emotional overload require licensed clinical guidance. Dedicated 24/7 crisis counselors provide free, confidential evaluation.')}
                  </p>
                </div>
                <a
                  href="tel:14566"
                  className="mt-2 w-full py-1.5 px-3 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-rose-200" />
                  {t('tips.callHelpline', 'Call 24/7 Crisis Support: 14566')}
                </a>
              </div>

              {/* Tip 3 */}
              <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-2 flex flex-col justify-between hover:bg-rose-50/70 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                      <Home className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-rose-900/80 uppercase tracking-wider">Step 3</span>
                  </div>
                  <h6 className="text-xs font-bold text-rose-950 leading-snug">
                    {t('tips.riskTip3Title', 'Move to a quiet, comfortable place and focus on immediate needs.')}
                  </h6>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {t('tips.riskTip3Desc', 'Step away from noise, bright lights, and chaotic settings. Sit with your back firmly supported against a chair or wall, take a sip of water, and focus on physical safety.')}
                  </p>
                </div>
                <button
                  onClick={() => startGuidedBreath('sigh')}
                  className="mt-2 w-full py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  {t('tips.startPacer', 'Start Emergency Calming Pacer')}
                </button>
              </div>

              {/* Tip 4 */}
              <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-2 flex flex-col justify-between hover:bg-rose-50/70 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-rose-900/80 uppercase tracking-wider">Step 4</span>
                  </div>
                  <h6 className="text-xs font-bold text-rose-950 leading-snug">
                    {t('tips.riskTip4Title', 'Avoid handling overwhelming stress completely alone.')}
                  </h6>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {t('tips.riskTip4Desc', 'Acute crisis intensity peaks faster when isolated. Do not bear this burden alone — maintain contact with your support circle or helpline until your physiological balance stabilizes.')}
                  </p>
                </div>
                <div className="text-[11px] text-rose-900 font-medium pt-2 border-t border-rose-200/60">
                  ✓ Essential crisis safeguard — reach out now
                </div>
              </div>
            </div>

            {/* Emergency Direct Dial Helplines Bar */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-700" />
                  24/7 Crisis Helplines & Emergency Direct Dial
                </div>
                <p className="text-xs text-stone-600">
                  Trained counselors are waiting on standby. Free, confidential, and available at all times.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="tel:14566"
                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <PhoneCall className="w-3 h-3" />
                  Helpline: 14566
                </a>
                <button
                  onClick={handleCopySupportNote}
                  className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  {copiedMemo ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedMemo ? 'Copied Note!' : 'Copy Grounding Note'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guided Breathing Overlay Pacer */}
      {breathPhase !== 'idle' && (
        <div className="p-5 bg-[#FAF9F6] border border-stone-300/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                scale: breathPhase === 'inhale' ? 1.4 : breathPhase === 'hold' ? 1.4 : 1,
                backgroundColor: breathPhase === 'inhale' ? '#BAE6FD' : breathPhase === 'hold' ? '#FFF3CD' : '#F8D7DA'
              }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm shadow-xs"
            >
              {breathCount}s
            </motion.div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {t('tips.activeGroundingGuide', 'Active Grounding Guide')}
              </div>
              <div className="text-base font-extrabold text-stone-900 capitalize">
                {breathPhase === 'inhale'
                  ? t('tips.inhale', 'Inhale deeply through nose...')
                  : breathPhase === 'hold'
                  ? t('tips.hold', 'Gently hold breath...')
                  : t('tips.exhale', 'Slow, complete exhale through mouth...')}
              </div>
            </div>
          </div>

          <button
            onClick={stopGuidedBreath}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
          >
            {t('tips.endBreathingPacer', 'End Breathing Pacer')}
          </button>
        </div>
      )}
    </div>
  );
};

export default StressTipsSupport;

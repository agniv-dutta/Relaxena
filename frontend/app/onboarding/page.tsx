"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  { title: 'Welcome to Relaxena', body: 'Smart venue intelligence, live guidance, and Rexi by your side.' },
  { title: 'Your Event', body: 'Confirm your seat, discover shortest queues, and receive proactive alerts.' },
  { title: 'Meet Rexi', body: 'Ask for routes, restroom guidance, and live recommendations instantly.' },
  { title: 'You are all set', body: 'Let us get you to your best match-day experience.' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const done = step === slides.length - 1;
  const progress = useMemo(() => ((step + 1) / slides.length) * 100, [step]);

  const finish = () => {
    localStorage.setItem('relaxena:onboarding:done', '1');
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="glass w-full max-w-2xl rounded-[2rem] p-8">
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden mb-6">
          <div className="h-full bg-gradient-to-r from-blue-400 to-pink-400" style={{ width: `${progress}%` }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-black heading-gradient">{slides[step].title}</h1>
            <p className="text-muted-foreground">{slides[step].body}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex items-center justify-between">
          <button className="text-xs text-muted-foreground" onClick={finish}>Skip</button>
          <button
            className="px-5 py-2 rounded-xl bg-white text-black text-sm font-bold"
            onClick={() => (done ? finish() : setStep((s) => s + 1))}
          >
            {done ? 'Go to Dashboard' : 'Next'}
          </button>
        </div>
      </div>
    </main>
  );
}

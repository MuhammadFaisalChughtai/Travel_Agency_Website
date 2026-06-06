"use client";

import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";

interface MathChallengeProps {
  onValidChange: (isValid: boolean, challengeData?: any) => void;
  resetKey?: number;
  brand?: "tt" | "rtu";
  labelColor?: string;
}

export function MathChallenge({ onValidChange, resetKey = 0, brand = "tt", labelColor }: MathChallengeProps) {
  const [challengeData, setChallengeData] = useState<{num1: number, num2: number, operator: string, payload: string, signature: string} | null>(null);
  const [userAnswer, setUserAnswer] = useState("");

  const fetchChallenge = async () => {
    try {
      const res = await fetch('/api/challenge');
      if (res.ok) {
        const data = await res.json();
        setChallengeData(data);
        setUserAnswer("");
        onValidChange(false, null);
      }
    } catch (err) {
      console.error("Failed to fetch math challenge", err);
    }
  };

  useEffect(() => {
    fetchChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    if (userAnswer === "" || !challengeData) {
      onValidChange(false, null);
      return;
    }

    const expected = challengeData.operator === "+" ? challengeData.num1 + challengeData.num2 : challengeData.num1 - challengeData.num2;
    const isValid = parseInt(userAnswer) === expected;
    
    if (isValid) {
      onValidChange(true, {
        payload: challengeData.payload,
        signature: challengeData.signature,
        answer: userAnswer
      });
    } else {
      onValidChange(false, null);
    }
  }, [userAnswer, challengeData, onValidChange]);

  const isRtu = brand === "rtu";
  const textColor = isRtu ? "text-[#064e3b]" : "text-[#6b4f4f]";
  const bgInput = isRtu ? "bg-slate-50 focus:border-[#064e3b] focus:ring-[#064e3b]" : "bg-[#f5f0eb] focus:border-[#6b4f4f] focus:ring-[#6b4f4f]";
  const borderColor = "border-slate-200";

  const finalLabelColor = labelColor || textColor;

  return (
    <div className="flex flex-col gap-2">
      <label className={`block text-xs font-black tracking-wide uppercase leading-6 ${finalLabelColor}`}>
        Human Verification *
      </label>
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center gap-2 px-4 h-[50px] rounded-xl border ${borderColor} bg-white shadow-sm font-bold text-slate-700 min-w-[100px] whitespace-nowrap`}>
          <Calculator className={`w-4 h-4 ${textColor} opacity-80`} />
          <span>{challengeData ? `${challengeData.num1} ${challengeData.operator} ${challengeData.num2} = ?` : "Loading..."}</span>
        </div>
        <input
          type="number"
          required
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Answer"
          className={`w-full px-4 h-[50px] rounded-xl text-slate-800 border ${borderColor} text-sm focus:bg-white focus:ring-1 outline-none transition-all font-medium placeholder-slate-400 ${bgInput}`}
        />
      </div>
    </div>
  );
}

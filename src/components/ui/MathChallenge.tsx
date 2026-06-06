"use client";

import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";

interface MathChallengeProps {
  onValidChange: (isValid: boolean) => void;
  resetKey?: number;
  brand?: "tt" | "rtu";
  labelColor?: string;
}

export function MathChallenge({ onValidChange, resetKey = 0, brand = "tt", labelColor }: MathChallengeProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<"+" | "-">("+");
  const [userAnswer, setUserAnswer] = useState("");

  const generateChallenge = () => {
    const isAddition = Math.random() > 0.5;
    let n1 = Math.floor(Math.random() * 10) + 1;
    let n2 = Math.floor(Math.random() * 10) + 1;

    // Ensure no negative answers for simplicity
    if (!isAddition && n2 > n1) {
      const temp = n1;
      n1 = n2;
      n2 = temp;
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(isAddition ? "+" : "-");
    setUserAnswer("");
    onValidChange(false);
  };

  useEffect(() => {
    generateChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    if (userAnswer === "") {
      onValidChange(false);
      return;
    }

    const expected = operator === "+" ? num1 + num2 : num1 - num2;
    onValidChange(parseInt(userAnswer) === expected);
  }, [userAnswer, num1, num2, operator, onValidChange]);

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
        <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border ${borderColor} bg-white shadow-sm font-bold text-slate-700 min-w-[100px] whitespace-nowrap`}>
          <Calculator className={`w-4 h-4 ${textColor} opacity-80`} />
          <span>{num1} {operator} {num2} = ?</span>
        </div>
        <input
          type="number"
          required
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Answer"
          className={`w-full px-4 py-3 rounded-xl text-slate-800 border ${borderColor} text-sm focus:bg-white focus:ring-1 outline-none transition-all font-medium placeholder-slate-400 ${bgInput}`}
        />
      </div>
    </div>
  );
}

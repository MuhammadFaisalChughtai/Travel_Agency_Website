"use client";

import { useState, useEffect } from "react";
import { Phone } from "lucide-react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  brand?: "tt" | "rtu";
}

const COUNTRY_CODES = [
  { code: "+44", label: "UK (+44)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+92", label: "Pakistan (+92)" },
  { code: "+880", label: "Bangladesh (+880)" },
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "USA/Canada (+1)" },
  { code: "+974", label: "Qatar (+974)" },
  { code: "+968", label: "Oman (+968)" },
  { code: "+973", label: "Bahrain (+973)" },
  { code: "+965", label: "Kuwait (+965)" },
  { code: "+20", label: "Egypt (+20)" },
  { code: "+962", label: "Jordan (+962)" },
  { code: "+212", label: "Morocco (+212)" },
  { code: "+90", label: "Turkey (+90)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+64", label: "New Zealand (+64)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+60", label: "Malaysia (+60)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+62", label: "Indonesia (+62)" },
];

export function PhoneInput({ value, onChange, brand = "tt" }: PhoneInputProps) {
  // Initialize state based on the incoming value
  const [countryCode, setCountryCode] = useState("+44");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    // If the parent resets the value to empty, reset our internal state
    if (!value) {
      setPhoneNumber("");
      return;
    }
    
    // Initial parse if value comes from outside (e.g. initial load)
    if (value && !phoneNumber) {
      const match = COUNTRY_CODES.find(c => value.startsWith(c.code));
      if (match) {
        setCountryCode(match.code);
        setPhoneNumber(value.substring(match.code.length).trim());
      } else {
        // Fallback if it doesn't start with a known code
        setPhoneNumber(value);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    onChange(`${newCode} ${phoneNumber}`);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value;
    setPhoneNumber(newNumber);
    onChange(`${countryCode} ${newNumber}`);
  };

  const isRtu = brand === "rtu";
  const textColor = isRtu ? "text-[#064e3b]" : "text-[#6b4f4f]";
  const bgInput = isRtu ? "bg-slate-50 focus:border-[#064e3b] focus:ring-[#064e3b]" : "bg-[#f5f0eb] focus:border-[#6b4f4f] focus:ring-[#6b4f4f]";
  const borderColor = "border-slate-200";

  return (
    <div className="relative flex shadow-sm rounded-xl overflow-hidden">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <Phone className={`w-4 h-4 ${textColor} opacity-80`} />
      </div>
      
      <select
        value={countryCode}
        onChange={handleCodeChange}
        className={`pl-10 pr-6 py-3 border-y border-l ${borderColor} border-r-0 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:bg-white font-medium cursor-pointer ${bgInput} appearance-none min-w-[100px] hover:bg-white transition-colors`}
        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
      >
        {COUNTRY_CODES.map((country) => (
          <option key={country.code} value={country.code}>
            {country.label}
          </option>
        ))}
      </select>

      <input
        type="tel"
        value={phoneNumber}
        onChange={handleNumberChange}
        required
        placeholder="Phone Number"
        className={`w-full px-4 py-3 border-y border-r border-l ${borderColor} text-slate-800 text-sm focus:outline-none focus:ring-1 focus:bg-white transition-all font-medium placeholder-slate-400 ${bgInput}`}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Phone } from "lucide-react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  brand?: "tt" | "rtu";
}

const COUNTRY_CODES = [
  { code: "+44", label: "UK +44" },
  { code: "+966", label: "KSA +966" },
  { code: "+971", label: "UAE +971" },
  { code: "+1", label: "USA +1" },
  { code: "+92", label: "PK +92" },
  { code: "+880", label: "BD +880" },
  { code: "+91", label: "IN +91" },
  { code: "+974", label: "QA +974" },
  { code: "+973", label: "BH +973" },
  { code: "+968", label: "OM +968" },
  { code: "+965", label: "KW +965" },
  { code: "+93", label: "AF +93" },
  { code: "+358", label: "AX +358" },
  { code: "+355", label: "AL +355" },
  { code: "+213", label: "DZ +213" },
  { code: "+1684", label: "AS +1684" },
  { code: "+376", label: "AD +376" },
  { code: "+244", label: "AO +244" },
  { code: "+1264", label: "AI +1264" },
  { code: "+672", label: "AQ +672" },
  { code: "+1268", label: "AG +1268" },
  { code: "+54", label: "AR +54" },
  { code: "+374", label: "AM +374" },
  { code: "+297", label: "AW +297" },
  { code: "+61", label: "AU +61" },
  { code: "+43", label: "AT +43" },
  { code: "+994", label: "AZ +994" },
  { code: "+1242", label: "BS +1242" },
  { code: "+1246", label: "BB +1246" },
  { code: "+375", label: "BY +375" },
  { code: "+32", label: "BE +32" },
  { code: "+501", label: "BZ +501" },
  { code: "+229", label: "BJ +229" },
  { code: "+1441", label: "BM +1441" },
  { code: "+975", label: "BT +975" },
  { code: "+591", label: "BO +591" },
  { code: "+387", label: "BA +387" },
  { code: "+267", label: "BW +267" },
  { code: "+55", label: "BR +55" },
  { code: "+246", label: "IO +246" },
  { code: "+673", label: "BN +673" },
  { code: "+359", label: "BG +359" },
  { code: "+226", label: "BF +226" },
  { code: "+257", label: "BI +257" },
  { code: "+855", label: "KH +855" },
  { code: "+237", label: "CM +237" },
  { code: "+1", label: "CA +1" },
  { code: "+238", label: "CV +238" },
  { code: "+345", label: "KY +345" },
  { code: "+236", label: "CF +236" },
  { code: "+235", label: "TD +235" },
  { code: "+56", label: "CL +56" },
  { code: "+86", label: "CN +86" },
  { code: "+61", label: "CX +61" },
  { code: "+61", label: "CC +61" },
  { code: "+57", label: "CO +57" },
  { code: "+269", label: "KM +269" },
  { code: "+242", label: "CG +242" },
  { code: "+243", label: "CD +243" },
  { code: "+682", label: "CK +682" },
  { code: "+506", label: "CR +506" },
  { code: "+225", label: "CI +225" },
  { code: "+385", label: "HR +385" },
  { code: "+53", label: "CU +53" },
  { code: "+357", label: "CY +357" },
  { code: "+420", label: "CZ +420" },
  { code: "+45", label: "DK +45" },
  { code: "+253", label: "DJ +253" },
  { code: "+1767", label: "DM +1767" },
  { code: "+1849", label: "DO +1849" },
  { code: "+593", label: "EC +593" },
  { code: "+20", label: "EG +20" },
  { code: "+503", label: "SV +503" },
  { code: "+240", label: "GQ +240" },
  { code: "+291", label: "ER +291" },
  { code: "+372", label: "EE +372" },
  { code: "+251", label: "ET +251" },
  { code: "+500", label: "FK +500" },
  { code: "+298", label: "FO +298" },
  { code: "+679", label: "FJ +679" },
  { code: "+358", label: "FI +358" },
  { code: "+33", label: "FR +33" },
  { code: "+594", label: "GF +594" },
  { code: "+689", label: "PF +689" },
  { code: "+241", label: "GA +241" },
  { code: "+220", label: "GM +220" },
  { code: "+995", label: "GE +995" },
  { code: "+49", label: "DE +49" },
  { code: "+233", label: "GH +233" },
  { code: "+350", label: "GI +350" },
  { code: "+30", label: "GR +30" },
  { code: "+299", label: "GL +299" },
  { code: "+1473", label: "GD +1473" },
  { code: "+590", label: "GP +590" },
  { code: "+1671", label: "GU +1671" },
  { code: "+502", label: "GT +502" },
  { code: "+44", label: "GG +44" },
  { code: "+224", label: "GN +224" },
  { code: "+245", label: "GW +245" },
  { code: "+595", label: "GY +595" },
  { code: "+509", label: "HT +509" },
  { code: "+379", label: "VA +379" },
  { code: "+504", label: "HN +504" },
  { code: "+852", label: "HK +852" },
  { code: "+36", label: "HU +36" },
  { code: "+354", label: "IS +354" },
  { code: "+62", label: "ID +62" },
  { code: "+98", label: "IR +98" },
  { code: "+964", label: "IQ +964" },
  { code: "+353", label: "IE +353" },
  { code: "+44", label: "IM +44" },
  { code: "+972", label: "IL +972" },
  { code: "+39", label: "IT +39" },
  { code: "+1876", label: "JM +1876" },
  { code: "+81", label: "JP +81" },
  { code: "+44", label: "JE +44" },
  { code: "+962", label: "JO +962" },
  { code: "+77", label: "KZ +77" },
  { code: "+254", label: "KE +254" },
  { code: "+686", label: "KI +686" },
  { code: "+850", label: "KP +850" },
  { code: "+82", label: "KR +82" },
  { code: "+996", label: "KG +996" },
  { code: "+856", label: "LA +856" },
  { code: "+371", label: "LV +371" },
  { code: "+961", label: "LB +961" },
  { code: "+266", label: "LS +266" },
  { code: "+231", label: "LR +231" },
  { code: "+218", label: "LY +218" },
  { code: "+423", label: "LI +423" },
  { code: "+370", label: "LT +370" },
  { code: "+352", label: "LU +352" },
  { code: "+853", label: "MO +853" },
  { code: "+389", label: "MK +389" },
  { code: "+261", label: "MG +261" },
  { code: "+265", label: "MW +265" },
  { code: "+60", label: "MY +60" },
  { code: "+960", label: "MV +960" },
  { code: "+223", label: "ML +223" },
  { code: "+356", label: "MT +356" },
  { code: "+692", label: "MH +692" },
  { code: "+596", label: "MQ +596" },
  { code: "+222", label: "MR +222" },
  { code: "+230", label: "MU +230" },
  { code: "+262", label: "YT +262" },
  { code: "+52", label: "MX +52" },
  { code: "+691", label: "FM +691" },
  { code: "+373", label: "MD +373" },
  { code: "+377", label: "MC +377" },
  { code: "+976", label: "MN +976" },
  { code: "+382", label: "ME +382" },
  { code: "+1664", label: "MS +1664" },
  { code: "+212", label: "MA +212" },
  { code: "+258", label: "MZ +258" },
  { code: "+95", label: "MM +95" },
  { code: "+264", label: "NA +264" },
  { code: "+674", label: "NR +674" },
  { code: "+977", label: "NP +977" },
  { code: "+31", label: "NL +31" },
  { code: "+599", label: "AN +599" },
  { code: "+687", label: "NC +687" },
  { code: "+64", label: "NZ +64" },
  { code: "+505", label: "NI +505" },
  { code: "+227", label: "NE +227" },
  { code: "+234", label: "NG +234" },
  { code: "+683", label: "NU +683" },
  { code: "+672", label: "NF +672" },
  { code: "+1670", label: "MP +1670" },
  { code: "+47", label: "NO +47" },
  { code: "+680", label: "PW +680" },
  { code: "+970", label: "PS +970" },
  { code: "+507", label: "PA +507" },
  { code: "+675", label: "PG +675" },
  { code: "+595", label: "PY +595" },
  { code: "+51", label: "PE +51" },
  { code: "+63", label: "PH +63" },
  { code: "+872", label: "PN +872" },
  { code: "+48", label: "PL +48" },
  { code: "+351", label: "PT +351" },
  { code: "+1939", label: "PR +1939" },
  { code: "+262", label: "RE +262" },
  { code: "+40", label: "RO +40" },
  { code: "+7", label: "RU +7" },
  { code: "+250", label: "RW +250" },
  { code: "+590", label: "BL +590" },
  { code: "+290", label: "SH +290" },
  { code: "+1869", label: "KN +1869" },
  { code: "+1758", label: "LC +1758" },
  { code: "+590", label: "MF +590" },
  { code: "+508", label: "PM +508" },
  { code: "+1784", label: "VC +1784" },
  { code: "+685", label: "WS +685" },
  { code: "+378", label: "SM +378" },
  { code: "+239", label: "ST +239" },
  { code: "+221", label: "SN +221" },
  { code: "+381", label: "RS +381" },
  { code: "+248", label: "SC +248" },
  { code: "+232", label: "SL +232" },
  { code: "+65", label: "SG +65" },
  { code: "+421", label: "SK +421" },
  { code: "+386", label: "SI +386" },
  { code: "+677", label: "SB +677" },
  { code: "+252", label: "SO +252" },
  { code: "+27", label: "ZA +27" },
  { code: "+500", label: "GS +500" },
  { code: "+211", label: "SS +211" },
  { code: "+34", label: "ES +34" },
  { code: "+94", label: "LK +94" },
  { code: "+249", label: "SD +249" },
  { code: "+597", label: "SR +597" },
  { code: "+47", label: "SJ +47" },
  { code: "+268", label: "SZ +268" },
  { code: "+46", label: "SE +46" },
  { code: "+41", label: "CH +41" },
  { code: "+963", label: "SY +963" },
  { code: "+886", label: "TW +886" },
  { code: "+992", label: "TJ +992" },
  { code: "+255", label: "TZ +255" },
  { code: "+66", label: "TH +66" },
  { code: "+670", label: "TL +670" },
  { code: "+228", label: "TG +228" },
  { code: "+690", label: "TK +690" },
  { code: "+676", label: "TO +676" },
  { code: "+1868", label: "TT +1868" },
  { code: "+216", label: "TN +216" },
  { code: "+90", label: "TR +90" },
  { code: "+993", label: "TM +993" },
  { code: "+1649", label: "TC +1649" },
  { code: "+688", label: "TV +688" },
  { code: "+256", label: "UG +256" },
  { code: "+380", label: "UA +380" },
  { code: "+598", label: "UY +598" },
  { code: "+998", label: "UZ +998" },
  { code: "+678", label: "VU +678" },
  { code: "+58", label: "VE +58" },
  { code: "+84", label: "VN +84" },
  { code: "+1284", label: "VG +1284" },
  { code: "+1340", label: "VI +1340" },
  { code: "+681", label: "WF +681" },
  { code: "+967", label: "YE +967" },
  { code: "+260", label: "ZM +260" },
  { code: "+263", label: "ZW +263" },
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
        className={`pl-10 pr-6 py-3 border-y border-l ${borderColor} border-r-0 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:bg-white font-medium cursor-pointer ${bgInput} appearance-none w-[100px] max-w-[100px] text-ellipsis overflow-hidden whitespace-nowrap hover:bg-white transition-colors`}
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

import os
import glob
import re

files = [
    "src/components/flights/FlightBookingForm.tsx",
    "src/components/flights/FlightEnquireButton.tsx",
    "src/components/holiday/HolidayBookingForm.tsx",
    "src/components/holiday/HolidaysBookingForm.tsx",
    "src/components/hajj/HajjBookingForm.tsx",
    "src/components/umrah/UmrahBookingForm.tsx",
    "src/components/visa/VisaBookingForm.tsx",
    "src/components/transport/TransportBookingForm.tsx",
    "src/components/contact/ContactForm.tsx",
    "src/components/view/EnquirySidebar.tsx",
    "src/components/roadtoumrah/flights/FlightBookingForm.tsx",
    "src/components/roadtoumrah/flights/FlightEnquireButton.tsx",
    "src/components/roadtoumrah/holiday/HolidayBookingForm.tsx",
    "src/components/roadtoumrah/holiday/HolidaysBookingForm.tsx",
    "src/components/roadtoumrah/hajj/HajjBookingForm.tsx",
    "src/components/roadtoumrah/umrah/UmrahBookingForm.tsx",
    "src/components/roadtoumrah/transport/TransportBookingForm.tsx",
    "src/components/roadtoumrah/visa/VisaBookingForm.tsx",
    "src/components/roadtoumrah/contact/ContactForm.tsx",
    "src/components/roadtoumrah/view/EnquirySidebar.tsx",
]

for filepath in files:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, does not exist.")
        continue

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Imports
    if "MathChallenge" not in content:
        # Find the last import
        import_match = list(re.finditer(r'^import .*;$', content, re.MULTILINE))
        if import_match:
            last_import = import_match[-1]
            content = content[:last_import.end()] + '\nimport { MathChallenge } from "@/components/ui/MathChallenge";\nimport { PhoneInput } from "@/components/ui/PhoneInput";' + content[last_import.end():]

    # 2. State
    if "const [isMathValid" not in content:
        content = re.sub(
            r'(const \[errorMsg, setErrorMsg\] = useState\(""\);)',
            r'\1\n  const [isMathValid, setIsMathValid] = useState(false);\n  const [resetMathKey, setResetMathKey] = useState(0);',
            content
        )

    # 3. Submit handler
    if "Please solve the math problem correctly." not in content:
        content = re.sub(
            r'(const handleSubmit = async \(e: React\.FormEvent\) => \{\s*e\.preventDefault\(\);\s*(?:if \(status === "loading"\) return;\s*)?setStatus\("loading"\);\s*setErrorMsg\(""\);)',
            r'\1\n\n    if (!isMathValid) {\n      setErrorMsg("Please solve the math problem correctly.");\n      setStatus("error");\n      return;\n    }',
            content
        )
        
        # Fallback if the first regex didn't match perfectly (e.g. FlightEnquireButton missing setErrorMsg(""))
        if "Please solve the math problem correctly." not in content:
            content = re.sub(
                r'(const handleSubmit = async \(e: React\.FormEvent\) => \{\s*e\.preventDefault\(\);\s*(?:if \(status === "loading"\) return;\s*)?setStatus\("loading"\);)',
                r'\1\n\n    if (!isMathValid) {\n      setErrorMsg("Please solve the math problem correctly.");\n      setStatus("error");\n      return;\n    }',
                content
            )

    # 4. Success handler
    if "setResetMathKey(prev => prev + 1);" not in content:
        content = re.sub(
            r'(setStatus\("success"\);)',
            r'\1\n      setResetMathKey(prev => prev + 1);\n      setIsMathValid(false);',
            content
        )

    brand = "rtu" if "roadtoumrah" in filepath else "tt"

    # 5. Phone Field
    if "<PhoneInput" not in content:
        # We need to find the variable used for state (form or formData)
        state_var_match = re.search(r'value=\{([^}]+)\.phone\}', content)
        if state_var_match:
            state_var = state_var_match.group(1) # 'form' or 'formData'
            setter = "setForm" if state_var == "form" else "setFormData"
            
            phone_replacement = f'<PhoneInput value={{{state_var}.phone}} onChange={{(val) => {setter}((prev: any) => ({{ ...prev, phone: val }}))}} brand="{brand}" />'
            
            # The phone block usually starts with <div className="relative"> and contains <Phone ... and ends with </div>
            content = re.sub(
                r'<div className="relative">\s*<Phone className=[^>]+/>\s*<input[^>]+name="phone"[\s\S]*?</div>',
                phone_replacement,
                content
            )

    # 6. Math Challenge
    if "<MathChallenge" not in content:
        math_tag = f'<MathChallenge onValidChange={{setIsMathValid}} resetKey={{resetMathKey}} brand="{brand}" />'
        
        # Insert right before the submit button
        content = re.sub(
            r'(<button\s+type="submit")',
            math_tag + r'\n\n                  \1',
            content
        )
        
        # FlightEnquireButton uses <button type="submit" ...> but some might just use <button type="submit">
        # Let's ensure it catches the right submit button (usually near the bottom of the form)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Patching complete.")

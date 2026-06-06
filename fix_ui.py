import glob
import re

files = glob.glob("src/components/**/*.tsx", recursive=True)

# Fix 1: PhoneInput layout
for f in files:
    if f.endswith("PhoneInput.tsx"):
        with open(f, "r", encoding="utf-8") as file:
            content = file.read()
        
        # Add text-ellipsis, overflow-hidden, and a fixed max-width to the select to stop it from blowing up the flex container
        content = re.sub(
            r'min-w-\[100px\]',
            r'w-[110px] max-w-[110px] text-ellipsis overflow-hidden whitespace-nowrap',
            content
        )
        # Fix the Math Challenge word wrapping
    elif f.endswith("MathChallenge.tsx"):
        with open(f, "r", encoding="utf-8") as file:
            content = file.read()
            
        content = re.sub(
            r'min-w-\[100px\]',
            r'min-w-[100px] whitespace-nowrap',
            content
        )
        
        with open(f, "w", encoding="utf-8") as file:
            file.write(content)
            
    else:
        # Fix MathChallenge parent container
        with open(f, "r", encoding="utf-8") as file:
            content = file.read()

        # Some forms have `<div className="flex justify-center">\n  <MathChallenge ... />`
        # We need to change `flex justify-center` to `flex flex-col items-center gap-6`
        
        # Let's find cases where `<MathChallenge` is right after `<div className="flex ...">`
        # Regex to match: <div className="flex justify-center"> (with or without other classes)
        # followed by whitespace, followed by <MathChallenge
        
        new_content = re.sub(
            r'<div className="([^"]*?flex[^"]*?)">\s*<MathChallenge',
            lambda m: f'<div className="{m.group(1)} flex-col items-center gap-6 w-full">\n              <MathChallenge',
            content
        )
        
        if new_content != content:
            with open(f, "w", encoding="utf-8") as file:
                file.write(new_content)
            print(f"Fixed {f}")

# Re-run for PhoneInput explicitly
with open("src/components/ui/PhoneInput.tsx", "r", encoding="utf-8") as file:
    content = file.read()
    content = re.sub(
        r'min-w-\[100px\]',
        r'w-[110px] max-w-[110px] text-ellipsis overflow-hidden whitespace-nowrap',
        content
    )
with open("src/components/ui/PhoneInput.tsx", "w", encoding="utf-8") as file:
    file.write(content)
print("Fixed PhoneInput.tsx")

import glob
import re

files = glob.glob("src/components/**/*.tsx", recursive=True)

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "isMathValid" in content and "<MathChallenge" not in content:
        brand = "rtu" if "roadtoumrah" in filepath else "tt"
        math_tag = f'<MathChallenge onValidChange={{setIsMathValid}} resetKey={{resetMathKey}} brand="{brand}" />'
        
        # We need to find the `<div className="flex justify-center">\n <Button ...>` pattern
        # and change it to `<div className="flex flex-col items-center gap-6 w-full">\n <MathChallenge...>\n <Button ...>`
        
        def replacer(match):
            div_start = match.group(1) # e.g. <div className="flex justify-center">
            button_tag = match.group(2) # e.g. <Button type="submit"
            
            # replace flex justify-center with flex flex-col items-center gap-6 w-full
            new_div = div_start.replace("flex justify-center", "flex flex-col items-center gap-6 w-full")
            if "flex-col" not in new_div:
                new_div = div_start.replace("flex", "flex flex-col items-center gap-6 w-full")
                
            return f'{new_div}\n              {math_tag}\n              {button_tag}'
            
        new_content = re.sub(
            r'(<div\s+className="[^"]*flex[^"]*">\s*)(<Button\s+type="submit")',
            replacer,
            content
        )
        
        if new_content == content:
            # Fallback if there is no wrapper div matched
            new_content = re.sub(
                r'(<Button\s+type="submit")',
                f'{math_tag}\n              \\1',
                content
            )

        if new_content != content:
            with open(filepath, "w", encoding="utf-8") as file:
                file.write(new_content)
            print(f"Fixed {filepath}")

import glob
import re

files = glob.glob("src/components/**/*.tsx", recursive=True)

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content

    # 1. Update MathChallenge wrapper for inline button
    # It might look like: <div className="flex justify-center flex-col items-center gap-6 w-full">
    # Or just: <div className="flex flex-col items-center gap-6 w-full">
    
    def replace_wrapper(m):
        # We want to change the flex-col items-center into flex-col sm:flex-row items-end
        original_class = m.group(1)
        new_class = original_class.replace("flex-col", "flex-col md:flex-row").replace("items-center", "items-end").replace("gap-6", "gap-4")
        if "justify-center" not in new_class:
            new_class += " justify-center"
        return f'<div className="{new_class}">'

    new_content = re.sub(r'<div className="([^"]*?flex-col items-center gap-6[^"]*?)">', replace_wrapper, new_content)
    
    # Also fix FlightBookingForm which might have been reverted and has `<div className="flex justify-center">`
    # wait, FlightBookingForm was reverted! So it has `<div className="flex justify-center">` again!
    if 'FlightBookingForm.tsx' in filepath and '<div className="flex justify-center">' in new_content:
        # Let's target the exact div that wraps MathChallenge
        new_content = re.sub(
            r'<div className="flex justify-center">\s*<MathChallenge',
            r'<div className="flex flex-col md:flex-row items-end justify-center gap-4 w-full">\n              <MathChallenge',
            new_content
        )

    # 2. Add labelColor
    if '<MathChallenge' in new_content and 'labelColor=' not in new_content:
        # Add labelColor={typeof isHome !== "undefined" && isHome ? "text-white/90" : undefined}
        new_content = re.sub(
            r'(<MathChallenge\s+)',
            r'\1labelColor={typeof isHome !== "undefined" && isHome ? "text-white/90" : undefined} ',
            new_content
        )

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as file:
            file.write(new_content)
        print(f"Updated {filepath}")

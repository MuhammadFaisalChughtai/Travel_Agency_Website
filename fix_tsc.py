import glob
import re

files = glob.glob("src/components/**/*.tsx", recursive=True)

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content

    # Check if `isHome` is actually a parameter/prop. A simple heuristic: `isHome` should appear at least 2 times (once in the prop destructing, once in the MathChallenge) or we can just regex for `isHome` before the MathChallenge.
    # The files that error are `ContactForm.tsx`, `FlightEnquireButton.tsx`, `EnquirySidebar.tsx`, etc.
    # These files only have `isHome` exactly 2 times (in the typeof check and the ternary), or they don't have it anywhere else.
    # Let's count the occurrences of `isHome` in the file.
    
    count = content.count('isHome')
    
    if count <= 2 and 'typeof isHome !== "undefined"' in content:
        # It means `isHome` is ONLY present because of the injected labelColor prop.
        # It's not an actual prop. We must remove it to fix TS2304.
        new_content = new_content.replace(
            'labelColor={typeof isHome !== "undefined" && isHome ? "text-white/90" : undefined} ',
            ''
        )

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as file:
            file.write(new_content)
        print(f"Fixed TS Error in {filepath}")

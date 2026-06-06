import glob
import re

files = glob.glob("src/components/**/*.tsx", recursive=True)

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content

    # 1. Add challengeData state
    if 'setChallengeData' not in new_content and 'setIsMathValid' in new_content:
        new_content = re.sub(
            r'(const \[isMathValid, setIsMathValid\] = useState\(false\);)',
            r'\1\n  const [challengeData, setChallengeData] = useState<any>(null);',
            new_content
        )
    
    # 2. Update onValidChange
    if 'setChallengeData(data)' not in new_content:
        new_content = re.sub(
            r'onValidChange=\{setIsMathValid\}',
            r'onValidChange={(valid, data) => { setIsMathValid(valid); setChallengeData(data); }}',
            new_content
        )
        
    # 3. Add challenge: challengeData to fetch payload
    if 'challenge: challengeData' not in new_content and 'setIsMathValid' in new_content:
        new_content = re.sub(
            r'(body:\s*JSON\.stringify\(\{)',
            r'\1\n          challenge: challengeData,',
            new_content
        )

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as file:
            file.write(new_content)
        print(f"Patched backend math logic in {filepath}")

import re
import urllib.request
import json

# Fetch standard country phone codes
url = 'https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json'
try:
    response = urllib.request.urlopen(url)
    data = json.loads(response.read().decode('utf-8'))
    
    # Sort and format
    countries = []
    # Prioritize UK, Saudi Arabia, UAE, USA at the top
    priority = ['GB', 'SA', 'AE', 'US', 'PK', 'BD', 'IN', 'QA', 'BH', 'OM', 'KW']
    
    def get_priority(c):
        if c['code'] in priority:
            return priority.index(c['code'])
        return 999
        
    data.sort(key=lambda x: (get_priority(x), x['name']))
    
    codes_str = 'const COUNTRY_CODES = [\n'
    for c in data:
        # dial_code might have space like '+1 242', clean it up
        dial = c['dial_code'].replace(' ', '')
        name = c['name'].replace('"', '')
        codes_str += f'  {{ code: "{dial}", label: "{name} ({dial})" }},\n'
    codes_str += '];'
    
    with open('src/components/ui/PhoneInput.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = re.sub(r'const COUNTRY_CODES = \[.*?\];', codes_str, content, flags=re.DOTALL)
    
    with open('src/components/ui/PhoneInput.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print('Successfully updated COUNTRY_CODES with full list.')
except Exception as e:
    print('Failed:', str(e))

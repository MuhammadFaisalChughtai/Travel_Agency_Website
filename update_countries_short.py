import re
import urllib.request
import json

url = 'https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json'
try:
    response = urllib.request.urlopen(url)
    data = json.loads(response.read().decode('utf-8'))
    
    priority = ['GB', 'SA', 'AE', 'US', 'PK', 'BD', 'IN', 'QA', 'BH', 'OM', 'KW']
    
    def get_priority(c):
        if c['code'] in priority:
            return priority.index(c['code'])
        return 999
        
    data.sort(key=lambda x: (get_priority(x), x['name']))
    
    codes_str = 'const COUNTRY_CODES = [\n'
    for c in data:
        dial = c['dial_code'].replace(' ', '')
        code = c['code']
        # For the top priority ones, we can use a slightly more recognizable abbreviation if we want, or just stick to ISO code
        if code == 'GB': short_name = 'UK'
        elif code == 'SA': short_name = 'KSA'
        elif code == 'AE': short_name = 'UAE'
        elif code == 'US': short_name = 'USA'
        else: short_name = code
            
        codes_str += f'  {{ code: "{dial}", label: "{short_name} {dial}" }},\n'
    codes_str += '];'
    
    with open('src/components/ui/PhoneInput.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = re.sub(r'const COUNTRY_CODES = \[.*?\];', codes_str, content, flags=re.DOTALL)
    
    # Let's also adjust the select width slightly so it perfectly fits "KSA +966"
    new_content = re.sub(
        r'w-\[110px\] max-w-\[110px\]',
        r'w-[100px] max-w-[100px]',
        new_content
    )
    
    with open('src/components/ui/PhoneInput.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print('Successfully updated COUNTRY_CODES with short names.')
except Exception as e:
    print('Failed:', str(e))

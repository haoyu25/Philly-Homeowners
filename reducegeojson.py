import json

# List of properties to KEEP
properties_to_keep = [
    'objectd', 'X_pred1', 'location', 'owner_1', 
    'trct_nm', 'dmnnt_l', 'dmnnt_p',
    'sm_ddrs', 'rntl_lc', 'cmmrcl_', 'avg_mr_', 
    'GEOID', 'ownr_c_', 'lmtd_n1', 'pp_dnst',
    'mdn_ncm'
]

# Load your GeoJSON
input_path = 'dashboarddata/property_without_exemption_address.geojson'
output_path = 'dashboarddata/property_without_exemption_final_reduced.geojson'

try:
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
except json.JSONDecodeError as e:
    print(f"Error loading JSON: {e}")
    print("Please validate your GeoJSON file for syntax errors.")
    exit(1)

# Clean the features
for feature in data.get('features', []):
    feature['properties'] = {k: v for k, v in feature['properties'].items() if k in properties_to_keep}

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Saved cleaned GeoJSON to {output_path}")
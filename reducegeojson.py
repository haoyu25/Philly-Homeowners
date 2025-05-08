import json

# List of properties to KEEP
properties_to_keep = [
    'X_pred_1', 'locatin', 'owner_1', 
    'cnss_tr', 'dominant_language', 'dominant_pct',
    'sm_ddrs', 'rntl_lc', 'cmmrcl_', 'avg_mr_', 
    'GEOID', 'ownr_c_', 'lmtd_n_', 'pp_dnst',
    'mdn_ncm'
]

# Load your GeoJSON
input_path = 'dashboarddata/properties_without_exemption_language_0505.geojson'
output_path = 'dashboarddata/property_without_exemption_0505.geojson'

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



import json

# Load the GeoJSON file
with open('dashboarddata/property_without_exemption_0505.geojson', 'r') as f:
    data = json.load(f)

# Count features with missing or empty 'location'
missing_location_count = 0
for feature in data.get('features', []):
    loc = feature.get('properties', {}).get('owner_1')
    if loc is None or (isinstance(loc, str) and loc.strip() == ''):
        missing_location_count += 1

print(f"Number of features with missing or empty 'location': {missing_location_count}")

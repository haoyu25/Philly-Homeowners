import json

# List of properties to KEEP
properties_to_keep = [
    'objectd', '_pred1',
    'sm_ddrs', 'rntl_lc', 'cmmrcl_', 'avg_mr_', 'GEOID', 'ownr_c_', 'pct_fr1',
    'ovrll_1', 'ownr_v_', 'yng_wn1', 'snr_wn1', 'fmly_h1', 'lmtd_n1', 'pp_dnst',
    'mdn_ncm_1', 'cst_br1'
]

# Load your GeoJSON
input_path = 'dashboarddata/property_without_exemption_tractdata.geojson'
output_path = 'dashboarddata/property_without_exemption_tractdata_reduced.geojson'

with open(input_path, 'r') as f:
    data = json.load(f)

# Clean the features
for feature in data['features']:
    feature['properties'] = {k: v for k, v in feature['properties'].items() if k in properties_to_keep}

# Save the cleaned GeoJSON
with open(output_path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"Saved cleaned GeoJSON to {output_path}")

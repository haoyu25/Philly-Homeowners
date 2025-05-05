import { updateWithoutExemptionLayer, toggleCommunityLayer, isCommunityLayerVisible, communityLayer} from './property-map.js';
let selectedAddresses = [];
let lastClickedGEOID = null;
let withoutExemptionData = null;
let threshold = 0.7;

// Load in Exemption Data
function loadWithoutExemptionData() {
  fetch('dashboarddata/property_without_exemption_final_reduced.geojson')
    .then(response => response.json())
    .then(data => {
      withoutExemptionData = data;
      console.log("Without Exemption Data Loaded:", withoutExemptionData);
      countPropertiesInTract();
    })
    .catch(error => {
      console.error('Problem loading without_exemption data:', error);
    });
}

loadWithoutExemptionData();

export function renderDashboardPanel() {
  const leftPanel = document.getElementById('left-panel');
  leftPanel.innerHTML = '';
  leftPanel.classList.add('show');

  const searchPrompt = document.createElement('p');
  searchPrompt.className = 'search-prompt';
  searchPrompt.textContent = 'Search a property to view results by census tract.';
  searchPrompt.style.fontStyle = 'italic';

  // Census tract name dynamically generated
  const tractName = document.createElement('h4');
  tractName.id = 'tract-name';
  tractName.textContent = 'Census Tract:';

  const tractHeader = document.createElement('h4');
  tractHeader.textContent = 'Census Tract Characteristics';
  tractHeader.className = 'subheader';

  const tractTable = document.createElement('table');
  tractTable.className = 'tract-table';
  tractTable.innerHTML = `
    <thead>
      <tr><th>Characteristic</th><th>Value</th></tr>
    </thead>
    <tbody id="tract-table-body">
      <tr><td colspan="2" style="text-align:center; font-style:italic;">No property selected</td></tr>
    </tbody>
  `;

  const outreachHeader = document.createElement('h4');
  outreachHeader.textContent = 'Outreach Campaign Optimizer';
  outreachHeader.className = 'subheader';

  const sliderLabel = document.createElement('label');
  sliderLabel.textContent = 'Eligibility Categorization Model Threshold:';
  sliderLabel.className = 'third-header';
  sliderLabel.style.display = 'inline-flex';
  sliderLabel.style.alignItems = 'center';

  // Create a container for the icon and tooltip
  const tooltipContainer = document.createElement('span');
  tooltipContainer.style.position = 'relative';
  tooltipContainer.style.display = 'inline-block';

  // Create the question mark image
  const tooltipIcon = document.createElement('img');
  tooltipIcon.src = 'dashboarddata/questionmark.png';
  tooltipIcon.alt = 'Help';
  tooltipIcon.style.width = '20px';
  tooltipIcon.style.height = '20px';
  tooltipIcon.style.marginLeft = '8px';
  tooltipIcon.style.cursor = 'pointer';
  tooltipIcon.style.verticalAlign = 'middle';

  // Create the tooltip popup
  const tooltipPopup = document.createElement('span');
  tooltipPopup.textContent = 'Adjusts the minimum eligibility score for properties to be included in the outreach. A higher threshold mean stricter eligibility and less properties included.';
  tooltipPopup.style.visibility = 'hidden';
  tooltipPopup.style.backgroundColor = '#333';
  tooltipPopup.style.color = '#fff';
  tooltipPopup.style.textAlign = 'left';
  tooltipPopup.style.borderRadius = '6px';
  tooltipPopup.style.padding = '8px 12px';
  tooltipPopup.style.position = 'absolute';
  tooltipPopup.style.zIndex = '9999';
  tooltipPopup.style.left = '110%';
  tooltipPopup.style.top = '50%';
  tooltipPopup.style.transform = 'translateY(-50%)';
  tooltipPopup.style.whiteSpace = 'normal';
  tooltipPopup.style.width = '220px';
  tooltipPopup.style.fontSize = '0.95em';
  tooltipPopup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

  // Show/hide tooltip on hover
  tooltipIcon.onmouseenter = () => { tooltipPopup.style.visibility = 'visible'; };
  tooltipIcon.onmouseleave = () => { tooltipPopup.style.visibility = 'hidden'; };

  // Assemble the tooltip
  tooltipContainer.appendChild(tooltipIcon);
  tooltipContainer.appendChild(tooltipPopup);

  // Add the icon and tooltip to the label
  sliderLabel.appendChild(tooltipContainer);

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = 'threshold-slider';
  slider.min = 0.5;
  slider.max = 1;
  slider.step = 0.1;
  slider.value = 0.7;

  slider.oninput = () => {
    sliderValue.textContent = slider.value;
    updateWithoutExemptionLayer(parseFloat(slider.value));
    updateTractCharacteristics(currentTractData, currentProperties);
    threshold = parseFloat(slider.value);
  };

  const sliderValue = document.createElement('p');
  sliderValue.id = 'threshold-value';
  sliderValue.textContent = `0.7`;

  const selectedProperties = document.createElement('h4');
  selectedProperties.id = 'selected-properties';
  selectedProperties.textContent = 'Number of Selected Properties:';

  const costHeader = document.createElement('h4');
  costHeader.textContent = 'Estimated Outreach Cost';
  costHeader.className = 'third-header';

  const costTable = document.createElement('table');
  costTable.className = 'cost-table';
  costTable.innerHTML = `
  <thead>
    <tr><th>Campaign Type</th><th>Total Cost</th></tr>
  </thead>
  <tbody>
    <tr><td colspan="2" style="text-align:center; font-style:italic;">No property selected</td></tr>
  </tbody>
`;
  costTable.style.fontStyle = 'italic';

  const benefitHeader = document.createElement('h4');
  benefitHeader.textContent = 'Estimated Potential Benefits';
  benefitHeader.className = 'third-header';

  const benefitTable = document.createElement('table');
  benefitTable.className = 'benefit-table';
  benefitTable.innerHTML = `<thead>
  <tr><th>Benefit Type</th><th>Value</th></tr>
  </thead>
  <tbody>
    <tr><td colspan="2" style="text-align:center; font-style:italic;">No property selected</td></tr>
  </tbody>
  `;
  benefitTable.style.fontStyle = 'italic';

const exportBtn = document.createElement('button');
exportBtn.className = 'menu-button';
exportBtn.textContent = 'Export Selected Addresses';
exportBtn.style.marginTop = '40px';

exportBtn.addEventListener('click', () => {
  if (!lastClickedGEOID) {
    alert("Please select a property first.");
    return;
  }

  const currentThreshold = parseFloat(document.getElementById('threshold-slider').value);
  // Find all properties in the tract that meet the threshold
  const propertiesInTract = withoutExemptionData.features.filter(feature => {
    return feature.properties.GEOID === lastClickedGEOID && feature.properties.X_pred1 >= currentThreshold;
  });

  // Build CSV rows, filtering out rows with empty addresses
  let csvRows = [["Address", "Owner Name"]];
  propertiesInTract.forEach(feature => {
    const address = feature.properties.location || "";
    const ownerName = feature.properties.owner_1 || "";
    // Only include rows where address is not empty or whitespace
    if (address.trim() !== "") {
      csvRows.push([address, ownerName]);
    }
  });

  // If no rows, show alert and stop
  if (csvRows.length === 1) {
    alert("No properties with addresses meet the current threshold in this tract.");
    return;
  }

  // Convert to CSV string
  let csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
  const filename = `tract_${lastClickedGEOID}_${currentThreshold}.csv`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});


const toggleContainer = document.createElement('div');
toggleContainer.style.display = 'flex';
toggleContainer.style.alignItems = 'center';
toggleContainer.style.gap = '10px';
toggleContainer.style.marginBottom = '15px';
toggleContainer.style.paddingTop = '24px';

const switchLabel = document.createElement('label');
switchLabel.className = 'switch';
switchLabel.style.margin = '0';

const switchInput = document.createElement('input');
switchInput.type = 'checkbox';
switchInput.checked = isCommunityLayerVisible();

switchInput.addEventListener('change', function() {
  toggleCommunityLayer(this.checked);
});

const switchSlider = document.createElement('span');
switchSlider.className = 'slider round';

switchLabel.append(switchInput, switchSlider);

const switchText = document.createElement('span');
switchText.textContent = 'Community Sites';
switchText.style.fontSize = '0.9em';

toggleContainer.append(switchLabel, switchText);

  leftPanel.append(
    searchPrompt,
    tractName,
    tractHeader,
    tractTable,
    outreachHeader,
    sliderLabel,
    slider,
    sliderValue,
    selectedProperties,
    costHeader,
    costTable,
    benefitHeader,
    benefitTable,
    exportBtn,
    toggleContainer
  );
};
// Store current tract data globally
let currentTractData = null;
let currentProperties = null;

export function updateTractCharacteristics(tractData, properties) {
  console.log("Updating tract:", tractData?.GEOID);
  currentTractData = tractData;
  currentProperties = properties;

  const tbody = document.getElementById('tract-table-body');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr><td>Owner Occupancy Rate</td><td>${tractData.ownr_c_.toFixed(2)}%</td></tr>
    <tr><td>Limited English Rate</td><td>${tractData.lmtd_n1.toFixed(2)}%</td></tr>
    <tr><td>Median Income</td><td>$${tractData.mdn_ncm.toFixed(2)}</td></tr>
    <tr><td>Population Density</td><td>${tractData.pp_dnst.toFixed(2)} people/sq mi</td></tr>
  `;

  // Update the Census Tract Name in the dashboard
  const tractNameElement = document.getElementById('tract-name');
  tractNameElement.textContent = `Census Tract: ${tractData.trct_nm}`;
  lastClickedGEOID = tractData.GEOID;

  // Update the number of selected properties based on threshold
  const selectedPropertiesCount = countPropertiesInTract(tractData.GEOID, parseFloat(document.getElementById('threshold-slider').value));
  const selectedPropertiesElement = document.getElementById('selected-properties');
  selectedPropertiesElement.textContent = `Number of Selected Properties: ${selectedPropertiesCount}`;

  // Calculate the total outreach costs for door-knocking and direct mailing
  const doorKnockingTotal = calculateCostForDoorKnocking(selectedPropertiesCount);
  const directMailingTotal = calculateCostForDirectMailing(selectedPropertiesCount);

  // Update the cost table with the calculated totals
  updateCostTable(doorKnockingTotal, directMailingTotal);

  // Calculate the Homeowner Tax Savings
  const homeownerTaxSavings = calculateHomeownerTaxSavings(selectedPropertiesCount);

  // Update the benefit table with the calculated savings and the additional message
  updateBenefitTable(homeownerTaxSavings);
}

function countPropertiesInTract(tractGEOID, threshold) {
  // Find properties in the same tract with X_pred1 >= threshold
  const propertiesInTract = withoutExemptionData.features.filter(feature => {
    return feature.properties.GEOID === tractGEOID && feature.properties.X_pred1 >= threshold;
  });

  // Store the addresses of those properties for exporting
  selectedAddresses = propertiesInTract.map(feature => feature.properties.location);

  // Return the count like before
  return propertiesInTract.length;
}

function calculateCostForDoorKnocking(propertiesCount) {
  return (32000 + (3.5 * propertiesCount)) * 1.1;
}

function calculateCostForDirectMailing(propertiesCount) {
  return (3500 + (0.38 * propertiesCount)) * 1.1;
}

function calculateHomeownerTaxSavings(propertiesCount) {
  return propertiesCount * 0.10 * 1399;
}

function updateCostTable(doorKnockingTotal, directMailingTotal) {
  const costTableBody = document.querySelector('.cost-table tbody');
  costTableBody.innerHTML = '';

  const doorRow = document.createElement('tr');
  doorRow.innerHTML = `
    <td>Door Knocking</td>
    <td>$${doorKnockingTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
  `;
  
  const mailRow = document.createElement('tr');
  mailRow.innerHTML = `
    <td>Direct Mailing</td>
    <td>$${directMailingTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
  `;

  costTableBody.appendChild(doorRow);
  costTableBody.appendChild(mailRow);
}

function updateBenefitTable(homeownerTaxSavings) {
  const benefitTableBody = document.querySelector('.benefit-table tbody');
  
  // Clear out existing rows
  benefitTableBody.innerHTML = '';

  // Calculate values
  const directBenefit = homeownerTaxSavings;
  const indirectBenefit = directBenefit * 2;
  const totalBenefit = directBenefit + indirectBenefit;

  // Build the rows
  const directRow = document.createElement('tr');
  directRow.innerHTML = `
    <td>Direct Homeowner Savings</td>
    <td>$${directBenefit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
  `;

  const indirectRow = document.createElement('tr');
  indirectRow.innerHTML = `
    <td>Broader Indirect Benefits</td>
    <td>$${indirectBenefit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
  `;

  const totalRow = document.createElement('tr');
  totalRow.innerHTML = `
    <td><strong>Total</strong></td>
    <td><strong>$${totalBenefit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
  `;

  // Append rows to table
  benefitTableBody.appendChild(directRow);
  benefitTableBody.appendChild(indirectRow);
  benefitTableBody.appendChild(totalRow);

  // Add the "Assuming 10% Post-Outreach Uptake" message under the table
  const tableContainer = document.querySelector('.benefit-table-container');
  let existingMessage = document.getElementById('uptake-message');
  if (!existingMessage) {
    const message = document.createElement('div');
    message.id = 'uptake-message';
    message.style.fontStyle = 'italic';
    message.style.marginTop = '8px';
    message.textContent = '*Assuming 10% Post-Outreach Uptake*';
    tableContainer.appendChild(message);
  }
}
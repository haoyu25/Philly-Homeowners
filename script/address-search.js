import { propertyMap } from './property-map.js';

const addressEntry = document.querySelector('#address-search');
const addressChoiceList = document.querySelector('#address-choices');
let currentMarker = null;

export function initializeAddressSearch() {
    addressEntry.addEventListener('input', debounce(handleAddressInput, 300));
    addressEntry.addEventListener('focus', () => {
      if (addressChoiceList.innerHTML.trim()) {
        addressChoiceList.classList.remove('hidden');
      }
    });
    document.querySelector('#search-btn').addEventListener('click', handleAddressSubmit);
    addressEntry.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddressSubmit();
      }
    });
  }

  async function handleAddressInput() {
    const partialAddress = addressEntry.value.trim();
  
    // Always clear previous suggestions immediately
    addressChoiceList.innerHTML = '';
    addressChoiceList.classList.add('hidden');
  
    if (!partialAddress) {
      return; // If blank, nothing else to do
    }
  
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(partialAddress + ', Philadelphia, PA')}&countrycodes=us&limit=5`
      );
      const results = await response.json();
      renderAddressSuggestions(results);
    } catch (error) {
      // ONLY show error if there's still text
      if (addressEntry.value.trim()) {
        renderAddressSuggestions([]);
      }
    }
}

function renderAddressSuggestions(results) {
  const phillyResults = results.filter(result =>
    result.display_name && result.display_name.toLowerCase().includes('philadelphia')
  );

  addressChoiceList.innerHTML = '';

  if (!phillyResults.length) {
    addressChoiceList.classList.add('hidden');
    return;
  }

  addressChoiceList.innerHTML = phillyResults.map(result => `
    <li data-lat="${result.lat}" data-lon="${result.lon}">
      ${result.display_name}
    </li>
  `).join('');
  
  addressChoiceList.classList.remove('hidden');
  addressChoiceList.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', handleAddressSelection);
  });
}

function handleAddressSelection(event) {
  const li = event.target.closest('li');
  const { lat, lon } = li.dataset;
  
  addressEntry.value = li.textContent;
  addressChoiceList.classList.add('hidden');
  centerMapOnAddress(lat, lon);
}

function handleAddressSubmit() {
  if (addressEntry.value.trim()) {
    handleAddressInput();
  }
}

function centerMapOnAddress(lat, lon) {
  const latLng = [parseFloat(lat), parseFloat(lon)];
  
  // Update map view
  propertyMap.setView(latLng, 18);
  
  // Clear previous marker
  if (currentMarker) {
    propertyMap.removeLayer(currentMarker);
  }
  
  // Add new marker with custom icon
  currentMarker = L.marker(latLng, {
    icon: L.icon({
      iconUrl: 'dashboarddata/pin.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    })
  }).addTo(propertyMap);

  // Auto-remove marker after 5 seconds
  setTimeout(() => {
    if (currentMarker) {
      propertyMap.removeLayer(currentMarker);
      currentMarker = null;
    }
  }, 5000);
}

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

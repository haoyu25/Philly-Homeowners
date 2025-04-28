import { updateTractCharacteristics } from './dashboard.js';

export let propertyMap;
let withoutExemptionClusterLayer;
let withoutExemptionData;
let highHighLayer;
let censusTractLayer;
let lastClickedMarker = null;

export function initializePropertyMap() {
  if (propertyMap) {
    propertyMap.remove();
  }

  propertyMap = L.map('map', { preferCanvas: true }).setView([39.9526, -75.1652], 16);

  const mapboxKey = 'pk.eyJ1IjoiY2xhdWRsb3ciLCJhIjoiY20weTY3MDZoMDNocTJrbXpqa3lqZWJlaSJ9.3N1iXpEvsJ0GwajGVwwkTg';
  const mapboxStyle = 'mapbox/light-v11';

  const baseTileLayer = L.tileLayer(`https://api.mapbox.com/styles/v1/${mapboxStyle}/tiles/512/{z}/{x}/{y}{r}?access_token=${mapboxKey}`, {
    maxZoom: 20,
    attribution: '&copy; <a href="https://mapbox.com/" target="_blank">Mapbox</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  });

  baseTileLayer.addTo(propertyMap);

  const propertyLayer = L.vectorGrid.protobuf('https://storage.googleapis.com/musa5090s25-team2-public/tiles/properties/{z}/{x}/{y}.pbf', {
    vectorTileLayerStyles: {
      'property_layer': (properties, zoom) => ({
        weight: 0.5,
        color: '#0033cc',
        fill: false,
        opacity: 0.6,
        lineCap: 'butt',
        lineJoin: 'miter',
      })
    },
    maxNativeZoom: 20,
    interactive: false,
  });

  function updateVectorLayerVisibility() {
    const currentZoom = propertyMap.getZoom();
    console.log(`Current zoom level: ${currentZoom}`);
    if (currentZoom >= 18) {
      if (!propertyMap.hasLayer(propertyLayer)) {
        console.log('Adding property layer');
        propertyMap.addLayer(propertyLayer);
      }
    } else {
      if (propertyMap.hasLayer(propertyLayer)) {
        console.log('Removing property layer');
        propertyMap.removeLayer(propertyLayer);
      }
    }
  }

  updateVectorLayerVisibility();
  propertyMap.on('zoomend', updateVectorLayerVisibility);

  // Add with_exemption layer
  fetch('dashboarddata/property_with_exemption.geojson')
  .then(response => response.json())
  .then(data => {
    const exemptionLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 2,
          fillColor: '#001f4d',
          color: '#001f4d',
          weight: 1,
          opacity: 0.4,
          fillOpacity: 0.4,
          interactive: false
        });
      },
      renderer: L.canvas()
    });

    // Function to show/hide the exemption layer based on zoom level
    function updateExemptionLayerVisibility() {
      if (propertyMap.getZoom() >= 18) {
        if (!propertyMap.hasLayer(exemptionLayer)) {
          propertyMap.addLayer(exemptionLayer);
        }
      } else {
        if (propertyMap.hasLayer(exemptionLayer)) {
          propertyMap.removeLayer(exemptionLayer);
        }
      }
    }

    // Initial check
    updateExemptionLayerVisibility();

    // Update on zoom end
    propertyMap.on('zoomend', updateExemptionLayerVisibility);
  })
  .catch(error => {
    console.error('Problem loading with_exemption data:', error);
  });

  // Add without_exemption data
  fetch('dashboarddata/property_without_exemption_tractdata_reduced.geojson')
    .then(response => response.json())
    .then(data => {
      withoutExemptionData = data;
      updateWithoutExemptionLayer(0.7);
    })
    .catch(error => {
      console.error('Problem loading without_exemption data:', error);
    });

    // Add census tract outlines
fetch('dashboarddata/Census_Tracts_2010.geojson')
.then(response => response.json())
.then(data => {
  censusTractLayer = L.geoJSON(data, {
    style: {
      color: '#555555',
      weight: 2,
      fillOpacity: 0,
    },
    interactive: false,
    renderer: L.canvas()
  });

  propertyMap.addLayer(censusTractLayer);
})
.catch(error => {
  console.error('Problem loading census tract data:', error);
});

// Add highhigh union polygons
fetch('dashboarddata/highhigh_union.json')
.then(response => response.json())
.then(data => {
  highHighLayer = L.geoJSON(data, {
    style: {
      color: '#FFFF00',
      weight: 1,
      fillColor: '#FFFF00',
      fillOpacity: 0.5,
    },
    interactive: false,
    renderer: L.canvas()
  });

  updateHighHighVisibility();
  propertyMap.on('zoomend', updateHighHighVisibility);
})
.catch(error => {
  console.error('Problem loading highhigh_union data:', error);
});

function updateHighHighVisibility() {
const currentZoom = propertyMap.getZoom();
console.log(`Current zoom level for highhigh: ${currentZoom}`);
if (currentZoom <= 15) {
  if (highHighLayer && !propertyMap.hasLayer(highHighLayer)) {
    propertyMap.addLayer(highHighLayer);
  }
} else {
  if (highHighLayer && propertyMap.hasLayer(highHighLayer)) {
    propertyMap.removeLayer(highHighLayer);
  }
}
}

}

export function updateWithoutExemptionLayer(threshold) {
  if (withoutExemptionClusterLayer) {
    propertyMap.removeLayer(withoutExemptionClusterLayer);
  }

  if (!withoutExemptionData) return;

  const filteredFeatures = withoutExemptionData.features.filter(feature => {
    return feature.properties._pred1 >= threshold;
  });

  console.log(`Processing ${filteredFeatures.length} features with threshold ${threshold}`);

  withoutExemptionClusterLayer = L.markerClusterGroup({
    disableClusteringAtZoom: 18,
    maxClusterRadius: 60,
    chunkedLoading: true,
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    spiderfyDistanceMultiplier: 2,
    singleMarkerMode: false,
  
    iconCreateFunction: function (cluster) {
      const count = cluster.getChildCount();
      const minSize = 24;
      const maxSize = 120;
      const minCount = 1;
      const maxCount = 2000;
      const size = minSize + (maxSize - minSize) * ((Math.min(count, maxCount) - minCount) / (maxCount - minCount));
      const colorScale = d3.scaleLinear()
        .domain([minCount, maxCount])
        .range(["#ffcccc", "#990000"]);
      const fillColor = colorScale(Math.min(count, maxCount));
      const opacity = 0.7;

      return L.divIcon({
        html: `<div style="
          background: ${fillColor};
          opacity: ${opacity};
          width: ${size}px;
          height: ${size}px;
          border-radius: 80%;
          border: 1.5px solid #fff6;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        "></div>`,
        className: 'marker-cluster',
        iconSize: L.point(size, size)
      });
    }
  });

  filteredFeatures.forEach(feature => {
    const [lng, lat] = feature.geometry.coordinates;
    const { sm_ddrs, rntl_lc, cmmrcl_, avg_mr_, _pred1 } = feature.properties;

    const popupContent = `
      <b>Predicted Probability:</b> ${_pred1.toFixed(2)}<br>
      <b>Same Mailing Address:</b> ${sm_ddrs === 1 ? "Yes" : "No"}<br>
      <b>Rental License:</b> ${rntl_lc === 1 ? "Yes" : "No"}<br>
      <b>Commercial License:</b> ${cmmrcl_ === 1 ? "Yes" : "No"}<br>
      <b>Average Market Value:</b> $${avg_mr_.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
    `;

  // Create a custom divIcon to mimic a circleMarker
  const defaultIcon = L.divIcon({
    html: `<div style="
      width: 10px;
      height: 10px;
      background: #cc0000;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.5);
      transition: all 0.2s;
    "></div>`,
    className: '',
    iconSize: [14, 14]
  });

  const hoverIcon = L.divIcon({
    html: `<div style="
      width: 16px;
      height: 16px;
      background: #ffcc00;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.8);
      transition: all 0.2s;
    "></div>`,
    className: '',
    iconSize: [20, 20]
  });

  const marker = L.marker([lat, lng], { icon: defaultIcon });

    marker.bindPopup(popupContent);

    marker.on('mouseover', function (e) {
      console.log('Mouseover on marker:', e.target);
      this.openPopup(); 
      this.setStyle({
        radius: 8,
        fillColor: '#ffcc00',
        color: '#ffcc00',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      });
    });
    
    marker.on('mouseout', function (e) {
      console.log('Mouseout from marker:', e.target);
      this.closePopup(); 
      this.setStyle({
        radius: 5,
        fillColor: '#cc0000',
        color: '#cc0000',
        weight: 10,
        opacity: 0,
        fillOpacity: 0.9
      });
    });
    
    marker.on('click', function (e) {
      console.log('Marker clicked:', e.target);
      updateTractCharacteristics(feature.properties);
      propertyMap.panTo(marker.getLatLng());
    
      if (lastClickedMarker) {
        lastClickedMarker.setStyle({
          radius: 5,
          fillColor: '#cc0000',
          color: '#cc0000',
          weight: 10,
          opacity: 0,
          fillOpacity: 0.9
        });
      }
    
      marker.setStyle({
        radius: 10,
        fillColor: '#ffff00',
        color: '#ffff00',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      });
    
      lastClickedMarker = marker;
    });

    withoutExemptionClusterLayer.addLayer(marker);
  });

  withoutExemptionClusterLayer.on('clusterclick', function(a) {
    console.log('Cluster clicked');
    propertyMap.fitBounds(a.layer.getBounds(), { 
      padding: [30, 30],
      maxZoom: 18
    });
  });

  propertyMap.addLayer(withoutExemptionClusterLayer);

}

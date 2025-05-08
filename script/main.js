import { initializePropertyMap } from './property-map.js';
import { renderDashboardPanel } from './dashboard.js';
import { initializeAddressSearch } from './address-search.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeAddressSearch();
  initializePropertyMap();
  showIntroPopup();
});

const leftPanel = document.getElementById('left-panel');

function showIntroPopup() {
  const popup = document.createElement('div');
  popup.classList.add('popup');

  const content = document.createElement('div');
  content.classList.add('popup-content');

  const app = document.getElementById('app'); 

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('close-btn');
  closeBtn.textContent = '×';
  closeBtn.onclick = () => {
    popup.remove();
    renderDashboardPanel(); // Directly show dashboard after welcome
  };

  const title = document.createElement('h2');
  title.textContent = 'Philadelphia Homestead Exemption Explorer';
  title.style.textAlign = 'center';
  title.style.marginBottom = '1.5rem';

  const description = document.createElement('div');
  description.innerHTML = `
  <h3>Welcome to the Philadelphia <br> Homestead Exemption Outreach Explorer!</h3> 

  <p style="margin-top: 2rem; margin-bottom: 2rem; font-size: 1rem;">This dashboard serves as an exploratory tool and  allows a user to explore properties currently not enrolled in a Homestead Exemption.  
  To understand the Homestead Exemption program</strong> in Philadelphia. 
  </p>

  <p style="margin-top: 2rem; margin-bottom: 2rem; font-size: 1rem;">
  To increase awareness about the potential unrealized property tax savings of this program, the City of Philadelphia is considering an outreach campaign to these homeowners.
  A machine learning XGBoost model was used to predict the probability that a property may be eligible for the Homestead Exemption program. 
  Use the slider to try different thresholds, explore where these properties are clustered, as well as their neighborhood profiles.
  View the estimated costs and benefits for targeted outreach and export the addresses of the selected census tract for outreach purposes.
  </p>

  <hr style="width:50%; text-align:center; margin: 2rem auto 1.5rem auto;">

  <div style="text-align: center; margin-bottom: 1.5rem;">
    <h4 style="margin-bottom: 0.75rem;">Legend</h4>
    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; font-size: 1rem;">
      <span>
        <span style="display: inline-block; width: 18px; height: 18px; background: #000000; border-radius: 50%; margin-right: 0.5rem; vertical-align: middle; font-size: 1rem;"></span>
        Properties already enrolled in Homestead Exemption
      </span>
      <span>
        <span style="display: inline-block; width: 18px; height: 18px; background: #d32f2f; border-radius: 50%; margin-right: 0.5rem; vertical-align: middle; font-size: 1rem;"></span>
        Properties not currently enrolled in Homestead Exemption
      </span>
      <span>
        <span style="display: inline-block; width: 22px; height: 14px; background: #ffeb3b; border-radius: 0.2rem; margin-right: 0.5rem; vertical-align: middle; font-size: 1rem; border: 1px solid #bdb000;"></span>
        Yellow areas - Hotspots based on 0.5 threshold
      </span>
    </div>
  </div>

  <p style="margin-top: 2rem; margin-bottom: 2rem; font-size: 1rem;">
  Please refer to our RMarkdown for the detailed report of our project.
  </p>

<div class="logo-row">
  <img src="dashboarddata/weitzmanlogo.png" style="width: 240px; object-fit: contain; border-radius: 0.2rem; margin-top: 1rem;" alt="Weitzman Logo">
  <img src="dashboarddata/phillystat360logo.png" style="width: 240px; object-fit: contain; border-radius: 0.2rem; margin-top: 1rem; margin-left: 0.5rem;" alt="Philly Stat 360 Logo">
</div>
  `;  

//</img>/<img src="dashboarddata/weitzmanlogo.png" style="width: 50%; object-fit: cover; border-radius: 0.5rem; margin-top: 1rem;" alt="Eligibility Info">

  const footer = document.createElement('p');
  footer.textContent = "Created by Haoyu Zhu, Rachel Midgett, Wenjun Zhu, and Claudia Low for University of Pennsylvania's MUSA 801";
  footer.style.marginTop = '2rem';
  footer.style.marginBottom = "10rem";
  footer.style.textAlign = 'center';
  footer.style.fontSize = '1';
  footer.style.fontWeight = 'bold';

  content.append(closeBtn, title, description, footer);
  popup.appendChild(content);
  app.appendChild(popup);

  setTimeout(() => {
    content.classList.add('popup-show');
  }, 100);
}

import { initializePropertyMap } from './property-map.js';
import { renderDashboardPanel } from './dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
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
  <h5>Welcome to the Homestead Exemption Explorer! </h5>  

  <p style="margin-top: 2rem; margin-bottom: 2rem;">This dashboard serves as an exploratory tool to understand the <strong>Homestead Exemption program</strong> in Philadelphia. Based on a machine learning model,
    properties likely eligible for the program but not currently enrolled in the program were predicted and identified.</p>
    <p style="margin-bottom: 2rem;">To increase awareness about the potential unrealized property tax savings of this program, the City of Philadelphia is considering an outreach campaign to these homeowners.
    Use this to understand Homestead Exemption, explore neighborhoods with the most outreach potential, and view the varying associated costs and benefits for the outreach.</p>

    <hr style="margin: 2rem 0;">

    <h3>About the Homestead Exemption Program</h3>
    <p style="margin-bottom: 1rem;">The Homestead Exemption reduces the taxable portion of a homeowner's property assessment by up to $100,000, saving up to $1,399 on real estate taxes annually. Property tax in Philadelphia is 1.3998% of the property value, as assessed by the Office of Property Assessment,for the 2025 taxx year. This is made up of 0.6159% (City of Philadelphia) and 0.7839% (School District). The taxes are due March 31st yearly. The bill signed aimed to lessen the financial burden of new property assessments on Philadelphia homeowners, whose property values increased by an average of 31% after the city delayed the annual calculations for three years due to the pandemic.
Eligibility for the Homestead Exemption is as follows:
•	you must own the property and use it as your primary residence
•	no age or income restrictions
•	Not used exclusively for business purposes or as rental units (a percentage is fine)

A homeowner is Ineligible if a homeowner is already enrolled in these alternative real estate tax relief/abatement programs:
•	Longtime Owner Occupants Program (LOOP), an	income-based program for homeowners who experience a substantial increase in their property assessment.
•	10-year residential tax abatement program, although one can only apply for Homestead Exemption after the abatement is over</p>

    <h3>How to Use this Dashboard</h3>
    <p style="margin-bottom: 1rem;">This dashboard allows a user to explore properties currently not enrolled in a Homestead Exemption. 
    A machine learning XGBoost model was used to predict the probability that a property may be eligible for the program. 
    Use the slider to explore the predicted probabilities and different thresholds, explore where these properties are clustered as well as their neighborhood profiles.
    Export the addresses per census tract as well as the estimated costs and benefits for targeted outreach. </p>
    
  `;
////<img src="dashboarddata/eligibility.png" style="width: 80%; object-fit: cover; border-radius: 0.5rem; margin-top: 1rem;" alt="Eligibility Info">

  const footer = document.createElement('p');
  footer.textContent = "Created by Haoyu Zhu, Rachel Midgett, Wenjun Zhu, and Claudia Low for University of Pennsylvania's MUSA 801";
  footer.style.marginTop = '2rem';
  footer.style.marginBotom = "10rem";
  footer.style.textAlign = 'center';
  footer.style.fontWeight = 'bold';

  content.append(closeBtn, title, description, footer);
  popup.appendChild(content);
  app.appendChild(popup);

  setTimeout(() => {
    content.classList.add('popup-show');
  }, 100);
}

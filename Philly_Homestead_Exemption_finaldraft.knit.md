---
title: "Philly_Homestead_Exemption_Final"
author: "Claudia Low, Haoyu Zhu, Rachel Midgett, Wenjun Zhu"
date: "2025-04-15"
output:
  rmdformats::material:
    code_download: true
    toc_float: true
    highlight: zenburn 
    font: "Lato"    
---



# Introduction

This report provides a detailed workflow of the project on Homestead Tax Exemption entitlement assisstance outreach, for the City of Philadelphia Office of Philly Stat 360 and Office of Information Technology. The aim of the project is design an algorithm-driven outreach campaign that can cost effectively identify homeowners who are likely to be eligible for the [Homestead Tax Exemption](https://www.phila.gov/services/payments-assistance-taxes/taxes/property-and-real-estate-taxes/get-real-estate-tax-relief/get-the-homestead-exemption/) but are not participating in the program. The project aims to allow our clients to understand where these properties are located, potential outreach strategies, and the associated costs and benefits.

These relevant properties who are identified as most likely eligible for the Homestead Exemption but not taking up the program,  are also thought to be more likely to be subject to “tangled titles,” or family-rental arrangements that require an affidavit to waive need for a rental license.

## Background on Property Tax in Philadelphia
Property tax in Philadelphia is 1.3998% of the property value, as assessed by the Office of Property Assessment,for the 2025 taxx year. This is made up of 0.6159% (City of Philadelphia) and 0.7839% (School District)
The taxes are due March 31st yearly.

## Background on Homestead Exemption
The Homestead Exemption reduces the taxable portion of a homeowner's property assessment by up to $100,000, saving up to $1,399 on real estate taxes annually. The bill signed aimed to lessen the financial burden of new property assessments on Philadelphia homeowners, whose property values increased by an average of 31% after the city delayed the annual calculations for three years due to the pandemic.
Eligibility for the Homestead Exemption is as follows:
•	you must own the property and use it as your primary residence
•	no age or income restrictions
•	Not used exclusively for business purposes or as rental units (a percentage is fine)

A homeowner is Ineligible if a homeowner is already enrolled in these alternative real estate tax relief/abatement programs:
•	Longtime Owner Occupants Program (LOOP), an	income-based program for homeowners who experience a substantial increase in their property assessment.
•	10-year residential tax abatement program, although one can only apply for Homestead Exemption after the abatement is over

Programs that can be used in conjunction with the homestead exemption include 
•	Owner-Occupied Real Estate Tax Payment Agreement (OOPA)
•	Senior Citizen Real Estate Tax Freeze
•	Low-Income Real Estate Tax Freeze
•	Real Estate Tax Installment Plan
• Tax Credits for Active-Duty Reserve and National Guard Members

## Tangled Titles
An issue of concern that may result in a long-term resident not being able to claim for homestead exemption is tangled titles, which occur when a long-term resident effectively functions as a homeowner but lacks legal ownership of the property. This often happens when a family member who owned the property passes away, and the necessary legal processes to formalize the ownership transfer were never completed, leaving the resident ineligible for the exemption. However, Philadelphia has a conditional Homestead Exemption of three years for such cases while the legal transfer of ownership is resolved.

## Significance of Outreach 
Currently, no focused or strategic efforts are being carried out by to identify and reach homeowners who is not enrolled in the Homestead Exemption. Through an accurate identification of eligible homeowners, a cost-effective and efficient targeted outreach will be possible, enabling these homeowners to be made aware of and receive support in keeping their home.

# Exploratory Data Analysis

## Dependent Variable - Homestead Exemption

The primary dataset used is the Property and Assessment History publicly available for download on OpenDataPhilly. 
Six relevant datasets are merged with this primary dataset with common identifying keys such as the parcel number in order to include useful predictor variabels in the model predicting for homeowners most likely eligible but not currently enrolled in the Homestead Exemption.

Every observation in the Property and Assessment History dataset is one property in Philadelphia, with a total of 584,049 properties and 79 features. As this dataset is updated daily, the one used for this project is updated as of 31 January 2025. 
There is a column 'homestead_exemption' within this dataset which indicates the taxable portion amount removed from the property assessment of the house. It should be noted that there are 14 properties that had a homestead exemption larger then $100,000, the maximum possible amount, which is suspected to be a clerical error and has been flagged to the PhillyStat360 team. The dependent variable for the model is derived from this feature by creating a binary variable on whether or not the property is currently enrolled in the homestead exemption program, indicated by a non-zero value. There are 246,853 properties with a homestead exemption.







### Homestead Rate by Census Tract

One major issue faces is the large number of NA values. Even for those features with a low number of NA values indicated in this table, further investigation reveals that there are many empty cells. 

<img src="Philly_Homestead_Exemption_finaldraft_files/figure-html/histogram homestead distribution-1.png" width="576" />
The distribution shows a roughly normal shape with most tracts clustered between 30-50%
There's a notable drop-off below 30% in the number of tracts
The histogram shows relatively few tracts with rates below 20%

Therefore, census tracts with homestead exemption rates below 30% could be considered to have low enrollment and might warrant targeted outreach or investigation into barriers to participation, assuming they are primarily residential areas and not institutional/special use tracts.

There's a notable drop-off below 30% in the number of tracts. Therefore, census tracts with homestead exemption rates below 30% could be considered to have low enrollment and might warrant targeted outreach or investigation into barriers to participation, assuming they are primarily residential areas.


<img src="Philly_Homestead_Exemption_finaldraft_files/figure-html/map homestead distribution-1.png" width="576" />


### Predictor Variables

<img src="Philly_Homestead_Exemption_finaldraft_files/figure-html/histogram owner_occu_rate-1.png" width="576" />

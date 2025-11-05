# pt8n_ado_test_pipeline

Example project of an AzureDevOps Pipeline with automated test cases. The purpose of this project is to demonstrate how the integration between the AzureDevOps pipelines and the PowerTestmation (PT8N) works. 

### Prerequisites
- The first thing that you need to do is to get the PT8N plugin. Here is a link: https://marketplace.visualstudio.com/items?itemName=hu-it.pt8n  
- The pipeline configuration, this project provides a .yaml template.
- In your automation project, depending on whether it is Cypress, Playwright, or PyTest, you will need to set the different tags that will relate your automated test cases to the PowerTestmation test cases. 

## Overview

This repository contains four main components:
- **Pipeline**: A YAML file with all the steps necessary to include the integration steps between pipelines and the PT8N plugin
- **Cypress**: An example Cypress test project with a test method referencing a PT8N test case
- **Playwright**: An example Playwright with a test project test method referencing a PT8N test case
- **PyTest**: An example PyTest test project with a test method referencing a PT8N test case

## Getting Started


### Running the Application



## Usage Examples


## Support

For issues and questions, please reach out to support@powert8n.com 
© 2025 Power Testmation. All rights reserved.

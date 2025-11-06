# pt8n_ado_test_pipeline

Example project of an AzureDevOps Pipeline with automated test cases. The purpose of this project is to demonstrate how the integration between the AzureDevOps pipelines and the PowerTestmation (PT8N) works. 

## Overview

This repository contains four main components:
- **Pipeline**: A YAML file with all the steps necessary to include the integration steps between pipelines and the PT8N plugin
- **Cypress**: An example Cypress test project with a test method referencing a PT8N test case
- **Playwright**: An example Playwright with a test project test method referencing a PT8N test case
- **PyTest**: An example PyTest test project with a test method referencing a PT8N test case

### Prerequisites

- The first thing that you need to do is to get the PT8N plugin. Here is a link: https://marketplace.visualstudio.com/items?itemName=hu-it.pt8n  
- The pipeline configuration, this project provides a .yaml template.
- In your automation project, depending on whether it is Cypress, Playwright, or PyTest, you will need to set the different tags that will relate your automated test cases to the PowerTestmation test cases. 


### Getting Started

1. Copy the YAML file into your pipeline.
2. Properly tag your test cases depending on the type of framework being used.
   2.1 First, create a test case in the PT8N plugin, capture the ID of the work item.
   2.2 Second, tag the test methods in your code repository with the ID capture in the step before.


### Running the Application

**Pipeline**: When you run the pipeline, the PT8N listener will be attentive and select the test cases tag. When the pipeline completes running, our app will automatically create a test run for the test case in the plugin with the proper outcome. And if the result is a failure, it will generate a Bug work item related to the test case run. 
**PT8N**: When you're in the plugin, you have the option to perform an "Automated run". This option appears when you expand the test case menu. This option will trigger the pipeline where the test case is located and it will also create a test run, and depending on the outcome, it will create a Bug. 


### Support

For issues and questions, please reach out to support@powert8n.com

© 2025 Power Testmation. All rights reserved. https://powert8n.com/

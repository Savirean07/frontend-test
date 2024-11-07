# Outbound Writing Assistant

This repository contains a Python script designed to automate the process of researching leads and generating personalized outreach messages for LinkedIn. The script leverages a multi-agentic team approach, integrating various APIs and the Autogen framework to streamline lead research, content generation, and email writing.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Code Overview](#code-overview)
  - [Imports](#imports)
  - [Load Environment Variables](#load-environment-variables)
  - [Functions](#functions)
    - [summarize(content, type)](#summarizecontent-type)
    - [scrape_linkedin(linkedin_url)](#scrape_linkedinlinkedin_url-str)
    - [research(linkedin_url)](#researchlinkedin_url-str)
    - [append_personal_details(email_content)](#append_personal_detailsemail_content)
    - [create_outreach_msg(research_material)](#create_outreach_msgresearch_material)
    - [load_lead_data_from_csv(csv_file)](#load_lead_data_from_csvcsv_file)
  - [Multi-Agentic Workflow](#multi-agentic-workflow)
- [Usage](#usage)
- [Conclusion](#conclusion)

## Prerequisites

Before running the script, ensure you have the following:

- Python 3.8 or higher
- Required Python libraries (specified in `requirements.txt`)
- Environment variables configured for API access

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Wintellisys/Lead_Generation_Agentic_Team.git
   cd Lead_Generation_Agentic_Team
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory with the following content:
   ```env
   RAPIDAPI=your_rapidapi_key
   ```

## Code Overview

### Imports

The script imports the necessary libraries and modules for web scraping, data handling, and API interactions:

```python
import requests
import json
import autogen
import http.client
import os
import csv
from dotenv import load_dotenv
from apify_client import ApifyClient
from langchain.prompts import PromptTemplate
from langchain.chains import load_summarize_chain
from langchain.chat_models.azure_openai import AzureChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
import prompts
```

### Load Environment Variables

Load environment variables from the `.env` file and set up API configurations:

```python
load_dotenv()
config_list = autogen.config_list_from_json(env_or_file="AOAI_CONFIG_LIST")
RAPID_API_KEY = os.getenv("RAPIDAPI")
```

### Functions

#### `summarize(content, type)`

Summarizes the provided content based on its type (`linkedin` or `website`). This function uses Azure OpenAI to generate summaries.

```python
def summarize(content, type):
    ...
```

#### `scrape_linkedin(linkedin_url: str)`

Scrapes LinkedIn profile data using RapidAPI. It fetches data from a local cache if available and updates the cache with new data if necessary.

```python
def scrape_linkedin(linkedin_url: str):
    ...
```

#### `research(linkedin_url: str)`

Conducts comprehensive research on a LinkedIn profile. It uses a multi-agentic approach to gather and analyze data, and produces a detailed report.

```python
def research(linkedin_url: str):
    ...
```

#### `append_personal_details(email_content)`

Appends personal details such as the lead’s name, email, LinkedIn URL, and phone number to the email content for better personalization.

```python
def append_personal_details(email_content):
    ...
```

#### `create_outreach_msg(research_material)`

Generates a personalized outreach message based on the research material. This function integrates insights from the multi-agentic team.

```python
def create_outreach_msg(research_material):
    ...
```

#### `load_lead_data_from_csv(csv_file)`

Loads lead data from a specified CSV file. This data is used for processing through the multi-agentic team.

```python
def load_lead_data_from_csv(csv_file):
    ...
```

### Multi-Agentic Workflow

The script employs a multi-agentic team to handle different aspects of the outreach process:

1. **Outbound Researcher:**
   - Gathers information from LinkedIn profiles and websites.

2. **Outbound Strategist:**
   - Analyzes the research material and drafts the structure of cold emails.

3. **Outbound Copywriter:**
   - Crafts and refines the content of the outreach emails.

4. **Reviewer:**
   - Reviews and critiques the drafted emails to ensure quality and effectiveness.

5. **Admin:**
   - Oversees the entire process and gives final approval.

## Usage

1. **Load Leads from CSV:**
   ```python
   leads = load_lead_data_from_csv('/path/to/your/csv/file.csv')
   ```

2. **Process Leads:**
   Iterate through each lead, perform research, and generate outreach messages:
   ```python
   for lead_data in leads:
       research_material = research(lead_data['linkedin_url'])
       email_content = create_outreach_msg(research_material)
       final_email = append_personal_details(email_content)
       # Save or send the final email as needed
   ```

## Conclusion

The Outbound Writing Assistant automates the research and outreach processes, enhancing efficiency and personalization in cold email campaigns. It is a powerful tool for sales and business development teams looking to scale their outreach efforts effectively.

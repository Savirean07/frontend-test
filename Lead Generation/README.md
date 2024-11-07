# Target Audience Keyword Generation Tool & LinkedIn Email and URL Scraper

## Overview

The **Target Audience Keyword Generation Tool** is a Python-based application designed to assist users in identifying target audiences for their products, services, or businesses. This tool utilizes a multi-agent system that combines various specialized agents to generate relevant keywords for effective LinkedIn lead generation. The tool can perform Google searches and store generated keywords in a structured format for easy access.

In addition, the **LinkedIn Email and URL Scraper** allows users to scrape emails from search results and extract LinkedIn profiles associated with those emails. It employs concurrent processing to enhance performance when handling large datasets.

## Features

- **Google Search Integration**: Utilize the Serper API to perform searches and discover audience-related keywords.
- **Email Extraction**: Extract emails from Google search results using ScrapeOps.
- **LinkedIn Profile Extraction**: Retrieve LinkedIn profiles (name, position, and URL) for each scraped email.
- **Multi-Agent Collaboration**: Collaborate among various agents to compile insights, analyze trends, and refine keywords based on user input.
- **Keyword Storage**: Store generated keywords in a `keywords.txt` file for easy retrieval and future reference.
- **Flexible Configuration**: Configure API endpoints and models easily via environment variables.
- **Concurrent Processing**: Speed up processing of multiple emails using `ThreadPoolExecutor` to handle tasks concurrently.
- **CSV Handling**: Manage results effectively by saving to CSV files, appending data if the file already exists, and preventing duplicate entries.
- **Automatic Cleanup**: Remove entries with incomplete data (e.g., no LinkedIn URLs) from the CSV files to ensure clean output.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [How to Use](#how-to-use)
5. [Detailed Functionality](#detailed-functionality)
   - [Google Search Function](#google-search-function)
   - [Storing Keywords](#storing-keywords)
   - [Agent Definitions](#agent-definitions)
   - [Group Chat Setup](#group-chat-setup)
   - [ScrapeOps API Search](#scrapeops-api-search)
   - [Email Extraction](#email-extraction)
   - [Query Generation](#query-generation)
   - [LinkedIn Profile Extraction](#linkedin-profile-extraction)
6. [Concurrency](#concurrency)
7. [CSV File Management](#csv-file-management)
8. [Example Usage](#example-usage)
9. [License](#license)
10. [Acknowledgements](#acknowledgements)

---

## Prerequisites

Before running the tool, ensure you have the following:

- **Python 3.8 or above**: The project is compatible with Python 3.8 and later versions.
- **API Keys**: Valid API keys for Azure OpenAI, Serper, and ScrapeOps services are required for functionality.
- **Required Libraries**: Install necessary dependencies such as `dotenv`, `requests`, and `autogen`.

---

## Installation

1. **Clone the Repository**:

   Clone the GitHub repository to your local machine:
   ```bash
   git clone https://github.com/Wintellisys/Lead_Generation_Agentic_Team.git
   ```

2. **Navigate to the Project Directory**:

   Change your directory to the project folder:
   ```bash
   cd Lead_Generation_Agentic_Team.
   ```

3. **Install Dependencies**:

   Install the required Python libraries using pip:
   ```bash
   pip install -r requirements.txt
   ```

---

## Configuration

1. **Set Up Environment Variables**:

   Create a `.env` file in the root directory of the project and add your API keys and model information:
   ```plaintext
   AZURE_OPENAI_MODEL=your_azure_openai_model
   AZURE_OPENAI_API_KEY=your_azure_openai_api_key
   AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
   OPENAI_API_VERSION=your_openai_api_version
   SERPER_API_KEY=your_serper_api_key
   SCRAPEOPS_API_KEY=your_scrapeops_api_key_here
   ```

   Ensure that the API keys and model details are correct for proper functionality.

---

## How to Use

1. **Run the Tool**:

   After configuring everything, run the keyword generation tool with a product/service description as an argument:
   ```bash
   python main.py "Your product/service/business description here"
   ```

   This will generate relevant keywords based on the input provided.

2. **Email and LinkedIn URL Scraper**:

   It will prepare an input file named `emails.csv` containing the emails to process. The file will be formatted like this:
   ```csv
   Email
   email1@example.com
   email2@example.com
   email3@example.com
   ```

3. **View Results**:

   - The generated keywords will be stored in a `keywords.txt` file, which can be reviewed or used for further searches.
   - The extracted LinkedIn information will be saved to `verified_emails.csv`, containing the following columns: Email, Name, Position, LinkedIn URL.

---

## Detailed Functionality

### 1. **Google Search Function**

The `search_google(query: str, num_results: int)` function performs a Google search using the Serper API to retrieve search results based on the provided query.

**Parameters**:
- `query`: The search query for finding target audience keywords.
- `num_results`: The number of search results to retrieve (default is set to 100).

This function is responsible for finding audience-related keywords, which can be further analyzed by the agent system.

### 2. **Storing Keywords**

The `store_keywords(keywords: List[str], file_path: str)` function is responsible for storing a list of generated keywords into a specified text file. This allows users to keep a record of the keywords generated during the execution of the tool.

### 3. **Agent Definitions**

Multiple agents are defined to collaboratively gather and refine keyword insights:

- **User Proxy Agent**: Coordinates interactions between specialized agents and assists users in refining their search criteria.
- **Web Scraper Agent**: Extracts keywords from a given website URL and provides results to the group chat.
- **Market Research Agent**: Analyzes industry trends and provides insights on audience keywords based on recent data.
- **Data-Driven Role Extractor**: Utilizes data sources to find significant audience keywords tailored to the user’s needs.
- **Refinement and Review Agent**: Enhances and reviews keywords generated by other agents, ensuring quality and relevance.
- **Keyword Storage Agent**: Manages the storage and organization of generated keywords in a systematic way.

### 4. **Group Chat Setup**

The `GroupChat` and `GroupChatManager` classes facilitate a collaborative environment where all agents work together to achieve the keyword generation task based on the user's input. This setup ensures that insights from different agents are effectively integrated.

### 5. **ScrapeOps API Search**

The `search_email(email: str)` function performs a search for the specified email using the ScrapeOps API. It retrieves relevant search results and passes them to the next processing stage.

### 6. **Email Extraction**

The `extract_emails_from_results(results: List[dict])` function extracts emails from the provided search results. This is crucial for building the list of emails that will be further analyzed to extract LinkedIn profiles.

### 7. **Query Generation**

The `generate_query(email: str)` function creates a search query based on the provided email, tailored to find the associated LinkedIn profile. This ensures that the scraper is efficient and focused on the right targets.

### 8. **LinkedIn Profile Extraction**

The `extract_linkedin_profile(search_results: List[dict])` function processes search results to extract LinkedIn profile details, including the user's name, position, and profile URL.

---

## Concurrency

To improve performance, the project employs `ThreadPoolExecutor` for concurrent processing of email searches. This allows multiple searches to occur simultaneously, significantly reducing the overall time required to complete the email scraping process.

---

## CSV File Management

The script handles reading and writing of CSV files, ensuring that:

- New data is appended to existing files, preserving previous results.
- Duplicate entries are avoided to maintain data integrity.
- Incomplete data (e.g., missing LinkedIn URLs) is automatically removed from output files to ensure that the results are clean and usable.

---

## Example Usage

To initiate the lead generation tool, run the following command:

```bash
python main.py "Find the target audience for my new marketing automation tool."
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

## Acknowledgements

- This project utilizes the [Serper API](https://serper.dev/) for web search functionality, enabling seamless integration for Google searches.
- Special thanks to the [ScrapeOps API](https://scrapeops.io/) for providing a powerful tool for email scraping, which enhances the efficiency of the project.
- Thanks to the developers of `requests`, `dotenv`, and `autogen` for their contributions to making API integration straightforward and

 effective.

---
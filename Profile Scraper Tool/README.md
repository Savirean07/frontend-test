# Profile Analyst

This Python project automates the process of lead generation by scraping LinkedIn profiles and gathering summarized information using multiple API services. The project leverages Langchain, Azure OpenAI, RapidAPI, Apify, and Prospeo to extract profile data and emails from LinkedIn, and then summarizes the data into a JSON file. This solution is ideal for outbound researchers looking to gather detailed insights on potential leads.

## Features

- **LinkedIn Profile Scraping:** Uses RapidAPI and Apify to scrape profile details and recent posts from LinkedIn.
- **Data Summarization:** Utilizes Azure OpenAI's LLMs with Langchain's summarization chain to generate detailed summaries from the scraped data.
- **Cache System:** Implements a caching system to store and reuse previously collected profile data, avoiding redundant API calls.
- **CSV Integration:** Reads LinkedIn URLs from a CSV file and processes each one sequentially.
- **JSON Output:** Saves summarized LinkedIn profile data and posts in JSON format for further use.
- **Environment Variables:** Supports environment variable configurations using `.env` files for storing API keys.

## Prerequisites

- Python 3.7+
- A GitHub account
- API keys for the following services:
  - RapidAPI
  - Prospeo
  - Apify
  - Azure OpenAI

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Wintellisys/Lead_Generation_Agentic_Team.git
   cd Lead_Generation_Agentic_Team
   ```

2. **Set up a virtual environment:**
   ```bash
   python3 -m venv env
   source env/bin/activate
   ```

3. **Install the required Python libraries:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**

   Create a `.env` file in the root directory of the project with the following content:

   ```bash
   PROSPEO_API_KEY=your_prospeo_api_key
   APIFY_API_KEY=your_apify_api_key
   RAPIDAPI=your_rapidapi_key
   ```

5. **Prepare a CSV file:**

   Create a CSV file named `verified_emails.csv` with at least 4 columns (the 4th column should contain LinkedIn profile URLs).

### Usage

To run the script, use the following command:

```bash
python script.py <directory_path> <summarize_flag>
```

- `<directory_path>`: The path to store JSON cache and summary files.
- `<summarize_flag>`: Use `True` to enable summarization using OpenAI or `False` to skip summarization.

### Example

```bash
python script.py /path/to/data True
```

This command will read LinkedIn URLs from the CSV file in the given directory, scrape the profile data, and summarize the information into a JSON file.

### Caching

The script uses a local cache stored in `json_cache.json`. This cache stores previously processed LinkedIn URLs and their associated data, ensuring that redundant API calls are avoided. New profiles are appended to the cache file incrementally as they are processed.

### Customization

- The `summarize` function leverages Langchain's `AzureChatOpenAI` to create detailed summaries of LinkedIn profiles and posts. The summarization prompt can be customized based on specific needs.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```
import http.client
import os
import json
import csv
import requests
from dotenv import load_dotenv
from apify_client import ApifyClient
import sys
import pathlib
from langchain.prompts import PromptTemplate
from langchain.chains import load_summarize_chain
from langchain.chat_models.azure_openai import AzureChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter

cwd = os.getcwd()

file_store_path = pathlib.Path(cwd) / sys.argv[1]
csv_file_path = file_store_path / "verified_emails.csv"

if not file_store_path.exists():
    file_store_path.mkdir(parents=True)

if not csv_file_path.exists():
    print("CSV file does not exist")
    exit()


# Load environment variables from .env file
load_dotenv()

prospeo_api_key = os.getenv("PROSPEO_API_KEY")
apify_api_key = os.getenv("APIFY_API_KEY")
rapid_api = os.getenv("RAPIDAPI")

# Path to the cache file
json_cache_path = file_store_path / 'json_cache.json'

# Function to load the local cache
def load_cache():
    try:
        with open(json_cache_path, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

# Function to save the local cache incrementally
def save_cache(cache, linkedin_url, response):
    cache[linkedin_url] = {
        "linkedin_url": linkedin_url,
        "response": response
    }
    with open(json_cache_path, 'w') as f:
        json.dump(cache, f, indent=4)

def summarize(content):
    # Initialize the AzureChatOpenAI model
    llm = AzureChatOpenAI(temperature=0, deployment_name="autogen_studio_deployment")
    
    # Split the text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        separators=["\n\n", "\n"], chunk_size=10000, chunk_overlap=500)
    docs = text_splitter.create_documents([content])

    # Select the appropriate prompt based on the type
    # if type == 'linkedin':
    #     map_prompt = prompts.linkedin_scraper_prompt
    # elif type == 'website':
    #     map_prompt = prompts.website_scraper_prompt
    # else:
    #     raise ValueError("Unsupported type provided for summarization")
    
    map_prompt = '''

    Act as an expert outbound researcher.
    Write a detailed summary of the following person based on the Linkedin data. I'm lookinfor g information such as:
    - Name of the companies that he/she worked with and roles
    - Past results from clients
    - Successfully transitioning from working in a job to starting their own business
    - College education
    - City where they are

    "{text}"

    SUMMARY:
    '''

    # Create a prompt template
    map_prompt_template = PromptTemplate(
        template=map_prompt, input_variables=["text"])

    # Load the summarize chain
    summary_chain = load_summarize_chain(
        llm=llm,
        chain_type='map_reduce',
        map_prompt=map_prompt_template,
        combine_prompt=map_prompt_template,
        verbose=True
    )

    # Run the summarize chain
    output = summary_chain.run(input_documents=docs)

    return output

# Scrape LinkedIn profile and posts using RapidAPI (rapid_tool) and append to a single JSON file
def rapid_tool(url, json_file_path="summary.json"):
    username = url.split('/')[4]
    conn = http.client.HTTPSConnection("linkedin-api8.p.rapidapi.com")

    headers = {
        'x-rapidapi-key': rapid_api,
        'x-rapidapi-host': "linkedin-api8.p.rapidapi.com"
    }

    # Request profile data
    conn.request("GET", f"/get-profile-data-by-url?url=https%3A%2F%2Fwww.linkedin.com%2Fin%2F{username}%2F", headers=headers)
    res = conn.getresponse()

    if res.status == 200:
        profile_data = res.read()
        profile_json = json.loads(profile_data.decode("utf-8"))

        # Extract the name from the profile data
        profile_name = profile_json.get('profile', {}).get('fullName', username)

        # Request LinkedIn posts data
        try:
            conn.request("GET", f'/get-profile-posts?username={username}', headers=headers)
            posts_res = conn.getresponse()
            posts_data = posts_res.read()
            posts_json = json.loads(posts_data.decode("utf-8"))
        except Exception as e:
            print(f"Error fetching posts data: {e}")
            posts_json = []

        # Combine profile and posts data for summarization
        combined_data = {
            "profile_data": profile_json,
            "posts_data": posts_json
        }

        # Convert combined data to string format for summarization
        combined_content = json.dumps(combined_data)
        if sys.argv[2] == "True":
            # Call the summarize function with the combined data
            summary = summarize(content=combined_content)

            # Prepare the new summary entry
            output_data = {
                "name": profile_name,
                "url": url,
                "summary": summary
            }

            # If the JSON file does not exist, create it with an empty list
            if not os.path.exists(json_file_path):
                with open(json_file_path, "w") as json_file:
                    json.dump([], json_file)

            # Load existing summaries and append the new entry
            with open(json_file_path, "r") as json_file:
                all_summaries = json.load(json_file)

            all_summaries.append(output_data)

            # Write back to the JSON file
            with open(json_file_path, "w") as json_file:
                json.dump(all_summaries, json_file, indent=4)

        return profile_name, combined_data, True
    else:
        print(f"Rapid tool failed with status code: {res.status}")
        return None, None, False

# Find email using Prospeo (prospeo_tool)
def prospeo_tool(linkedin_url):
    url = "https://api.prospeo.io/linkedin-email-finder"
    headers = {
        'Content-Type': 'application/json',
        'X-KEY': prospeo_api_key
    }
    data = {'url': linkedin_url}
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 200:
        return response.json(), True
    else:
        print(f"Prospeo tool failed with status code {response.status_code}: {response.text}")
        return None, False

# Scrape LinkedIn page content (apify_tool)
def apify_tool(url):
    client = ApifyClient(token=apify_api_key)
    run_input = {
        "startUrls": [{"url": url}],
        "useSitemaps": False,
        "crawlerType": "playwright:firefox",
        "maxCrawlPages": 1,
        "proxyConfiguration": {"useApifyProxy": True},
        "removeCookieWarnings": True,
        "htmlTransformer": "readableText",
        "maxResults": 9999999,
        "saveHtml": True,
        "saveMarkdown": True,
    }
    try:
        run = client.actor("aYG0l9s7dbB7j3gbS").call(run_input=run_input)
        text_data = ""
        for item in client.dataset(run["defaultDatasetId"]).iterate_items():
            text_data += item.get("text", "") + "\n"
        return text_data[:int(0.75 * 20000)], True
    except Exception as e:
        print(f"Apify tool failed: {str(e)}")
        return None, False

# Process LinkedIn URLs from a CSV file
def process_urls_from_file(file_path):
    cache = load_cache()
    
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        next(reader)  # Skip the header row
        for row in reader:
            # Ensure that the row has enough columns
            if len(row) < 4:
                print(f"Skipping row due to insufficient columns: {row}")
                continue
            
            linkedin_url = row[3].strip()
            print(f"Processing {linkedin_url}...")

            # Check if the data is already in the cache
            if linkedin_url in cache:
                print(f"Data for {linkedin_url} already exists in the cache. Skipping...")
                continue

            profile_name, profile_data = None, None
            
            # Try using rapid_tool (highest priority)
            profile_name, profile_data, success = rapid_tool(linkedin_url)
            if not success:
                print(f"RapidAPI failed for {linkedin_url}.")
                
            # Commented out other API attempts
            """
            # If rapid_tool fails, try prospeo_tool
            email_data, success = prospeo_tool(linkedin_url)
            if not success:
                print(f"Prospeo tool failed for {linkedin_url}.")

            # If prospeo_tool fails, try apify_tool
            page_content, success = apify_tool(linkedin_url)
            if not success:
                print(f"Apify tool failed for {linkedin_url}.")
            """

            # If any data was collected, save it incrementally to the cache
            response = {
                "profile_data": profile_data,
                # "email_data": email_data,  # Commented out
                # "page_content": page_content  # Commented out
            }
            save_cache(cache, linkedin_url, response)

if __name__ == "__main__":
    process_urls_from_file(csv_file_path)


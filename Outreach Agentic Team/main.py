import requests
import json
import autogen
import http.client
import os
import json
import csv
import requests
import prompts
from dotenv import load_dotenv
from apify_client import ApifyClient
from langchain.prompts import PromptTemplate
from langchain.chains import load_summarize_chain
from langchain.chat_models.azure_openai import AzureChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
import sys

# Load environment variables from .env file
load_dotenv()

config_list = autogen.config_list_from_json(env_or_file="AOAI_CONFIG_LIST")

# cli arguments
file_store_path = sys.argv[1]
csv_file_path = sys.argv[2]

profile_file_path = os.path.join(file_store_path, "profile_data.json")


if not os.path.exists(file_store_path):
    os.makedirs(file_store_path)

if not file_store_path:
    raise ValueError("File store path is required")
if not csv_file_path:
    raise ValueError("CSV file path is required")

# Retrieve API key from environment variables
RAPID_API_KEY = os.getenv("RAPIDAPI")

def summarize(content, type):
    # Initialize the AzureChatOpenAI model
    llm = AzureChatOpenAI(temperature=0, deployment_name="autogen_studio_deployment")
    
    # Split the text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        separators=["\n\n", "\n"], chunk_size=10000, chunk_overlap=500)
    docs = text_splitter.create_documents([content])

    # Select the appropriate prompt based on the type
    if type == 'linkedin':
        map_prompt = prompts.linkedin_scraper_prompt
    elif type == 'website':
        map_prompt = prompts.website_scraper_prompt
    else:
        raise ValueError("Unsupported type provided for summarization")

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

def scrape_linkedin(linkedin_url: str):
    json_cache = os.path.join(file_store_path, 'scraped_linkedin.json')
    username = linkedin_url.split('/')[4]  # Extract username from LinkedIn URL
    conn = http.client.HTTPSConnection("linkedin-api8.p.rapidapi.com")

    headers = {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': "linkedin-api8.p.rapidapi.com"
    }

    # Try to fetch data from local cache
    try:
        with open(json_cache, 'r') as f:
            cached_data = json.load(f)
            if isinstance(cached_data, dict):
                cached_data = [cached_data]  # Convert to list for uniform processing
            elif not isinstance(cached_data, list):
                print(f"Error: Cached data is neither a list nor a dictionary. Type: {type(cached_data)}")
                return None

            for entry in cached_data:
                if not isinstance(entry, dict):
                    print(f"Error: Entry is not a dictionary. Entry: {entry}")
                    continue
                if 'linkedin_url' not in entry or 'response' not in entry:
                    print(f"Error: Entry missing required keys. Entry: {entry}")
                    continue
                if entry['linkedin_url'] == linkedin_url:
                    print('Fetched data from Local Cache')
                    # Ensure entry['response'] is correctly formatted before summarizing
                    response_json = json.dumps(entry['response'])
                    return summarize(response_json, 'linkedin')  # Convert dict to JSON string
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f'No local cache found...({e})')
        cached_data = []

    # Request LinkedIn profile data from RapidAPI
    print('Fetching new json data... (updating local cache)')
    profile_json = {}
    posts_json = {}

    try:
        conn.request("GET", f"/get-profile-data-by-url?url=https%3A%2F%2Fwww.linkedin.com%2Fin%2F{username}%2F", headers=headers)
        res = conn.getresponse()
        profile_data = res.read()
        profile_json = json.loads(profile_data.decode("utf-8"))
        print(f"Profile Data: {profile_json}")
    except Exception as e:
        print(f"Error fetching profile data: {e}")

    # Request LinkedIn posts data
    try:
        conn.request("GET", f'/get-profile-posts?username={username}', headers=headers)
        res = conn.getresponse()
        posts_data = res.read()
        posts_json = json.loads(posts_data.decode("utf-8"))
        print(f"Posts Data: {posts_json}")
    except Exception as e:
        print(f"Error fetching posts data: {e}")

    # Combine profile and posts data
    combined_data = {
        'linkedin_url': linkedin_url,
        'response': {
            "profile_data": profile_json,
            "posts_data": posts_json
        }
    }

    print(f"Type of profile_json: {type(profile_json)}, Content: {profile_json}")
    print(f"Type of posts_json: {type(posts_json)}, Content: {posts_json}")

    # Save the combined data to local cache
    cached_data.append(combined_data)
    with open(json_cache, 'w') as f:
        json.dump(cached_data, f, indent=4)

    # Summarize and return the combined data
    response_json = json.dumps(combined_data['response'])
    return summarize(response_json, 'linkedin')

def research(linkedin_url: str):
    llm_config_research_li = {
        "functions": [
            {
                "name": "scrape_linkedin",
                "description": "look for relevant information about the lead in the json file",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "linkedin_url": {
                            "type": "string",
                            "description": "The LinkedIn URL to search in json file",
                        }
                    },
                    "required": ["https://www.linkedin.com/in/tonybarneslyddenpartners"],
                },
            },
        ],
        "config_list": config_list
    }

    outbound_researcher = autogen.AssistantAgent(
        name="Outbound_researcher",
        system_message="Research the LinkedIn Profile of a potential lead and generate a detailed report; Add TERMINATE to the end of the research report;",
        llm_config=llm_config_research_li,
    )

    user_proxy = autogen.UserProxyAgent(
        name="User_proxy",
        code_execution_config={"last_n_messages": 2, "work_dir": "coding", "use_docker": False,},
        max_consecutive_auto_reply=3,
        default_auto_reply='Please continue with the task',
        is_termination_msg=lambda x: x.get("content", "") and x.get(
            "content", "").rstrip().endswith("TERMINATE"),
        human_input_mode="NEVER",
        function_map={
            "scrape_linkedin": scrape_linkedin,
        }
    )

    user_proxy.initiate_chat(outbound_researcher, message=f"Research this lead's website and LinkedIn Profile {lead_data}")

    user_proxy.stop_reply_at_receive(outbound_researcher)
    user_proxy.send(
        "Give me the research report that just generated again, return ONLY the report with recipient's name: [name] and recipient's email: [email] from the lead data, and add TERMINATE at the end of the message", outbound_researcher)

    # Return the last message the expert received
    return user_proxy.last_message()["content"]
# Create the outreach creation function

# Your personal details
personal_details = {
    "Name": "Chris Wess",
    "Email": "cwess@wintellisys.com",
    "LinkedIn URL": "https://www.linkedin.com/in/chriswess",
    "Position": "CEO & Managing Principal",
    "Company URL": "Wintellisys.com",
    "Phone Number": "+1 9012759036"  # Add your phone number here
}

# New agent to append personal details
def append_personal_details(email_content):
    # Find placeholders in the email content and replace them with actual details
    email_content = email_content.replace("[Your Full Name]", personal_details["Name"])
    email_content = email_content.replace("[Your Name]", personal_details["Name"])
    email_content = email_content.replace("[Your Position]", personal_details["Position"])
    email_content = email_content.replace("[Your Job Title]", personal_details["Position"])
    email_content = email_content.replace("[Your Contact Information]", personal_details["Email"])
    email_content = email_content.replace("[Your LinkedIn URL]", personal_details["LinkedIn URL"])
    email_content = email_content.replace("[LinkedIn Profile]", personal_details["LinkedIn URL"])
    email_content = email_content.replace("[Your Company Name]", personal_details["Company URL"])
    email_content = email_content.replace("[Your Company]", personal_details["Company URL"])
    email_content = email_content.replace("[Your Phone Number]", personal_details["Phone Number"])
    
    return email_content
  
def load_company_details():
    # Load company details from a JSON file
    with open('company_details.json', 'r') as file:
        company_details = json.load(file)
    return company_details

# create_outreach_msg function
def create_outreach_msg(research_material):
    outbound_strategist = autogen.AssistantAgent(
        name="outbound_strategist",
        system_message="""
        You are a senior outbound strategist responsible for analyzing research material and crafting the most effective cold email structure with relevant personalization points. 
        Your role involves ensuring that each email is tailored to the recipient's background and achievements, aligning the content with their needs and the services offered by wintellisys.com/wealth-wingman/. 
        Ensure that all emails are formatted correctly for Outlook, with no markdown elements, and include the following signature at the end of every email:
        
        Best Regards,
        Chris Wess  
        CEO & Managing Principal  
        cwess@wintellisys.com  
        https://www.linkedin.com/in/chriswess  
        Wintellisys.com  
        +1 9012759036/+1 9013414114
        """,
        llm_config={"config_list": config_list},
    )


    outbound_copywriter = autogen.AssistantAgent(
        name="outbound_copywriter",
        system_message="You are a professional AI copywriter who is writing cold emails for leads. You will write a short cold email based on the structure provided by the outbound strategist, and feedback from the reviewer and Ensure that all emails are formatted correctly for Outlook, with no markdown elements. After 2 rounds of content iteration, add TERMINATE to the end of the message.",
        llm_config={"config_list": config_list},
    )

    reviewer = autogen.AssistantAgent(
        name="reviewer",
        system_message="You are a world-class cold email critic. You will review & critique the cold email and provide feedback to the writer and Ensure that all emails are formatted correctly for Outlook, with no markdown elements. After 2 rounds of content iteration, add TERMINATE to the end of the message.",
        llm_config={"config_list": config_list},
    )

    user_proxy = autogen.UserProxyAgent(
        name="admin",
        system_message="A human admin. Interact with the outbound strategist to discuss the structure. Actual writing needs to be approved by this admin.",
        code_execution_config=False,
        is_termination_msg=lambda x: x.get("content", "") and x.get(
            "content", "").rstrip().endswith("TERMINATE"),
        human_input_mode="TERMINATE",
    )

    groupchat = autogen.GroupChat(
        agents=[user_proxy, outbound_strategist, outbound_copywriter, reviewer],
        messages=[],
        max_round=6
    )
    manager = autogen.GroupChatManager(groupchat=groupchat)


    # Register the tool signature with the assistant agent.
    outbound_strategist.register_for_llm(name="load_company_details", description="load company details from the json file")(load_company_details)

    # Register the tool function with the user proxy agent.
    user_proxy.register_for_execution(name="load_company_details")(load_company_details)

    user_proxy.initiate_chat(
        manager, message=f"Write a personalized cold email to lead, here are the materials: {research_material}"
    )

    user_proxy.stop_reply_at_receive(manager)
    user_proxy.send(
        "Give me the cold email that was just generated again, return ONLY the cold email with recipient's name and recipient's email, and add TERMINATE at the end of the message.", manager
    )

    # Get the generated email content
    email_content = user_proxy.last_message()["content"]

    # Append your personal details
    email_with_signature = append_personal_details(email_content)

    return email_with_signature



llm_config_outbound_writing_assistant = {
    "functions": [
        {
            "name": "research",
            "description": "research about a given lead, return the research material in report format",
            "parameters": {
                "type": "object",
                "properties": {
                    "lead_data": {
                        "type": "object",
                        "description": "The information about a lead",
                    }
                },
                "required": ["lead_data"],
            },
        },
        {
            "name": "create_outreach_msg",
            "description": "Write an outreach message based on the given research material & lead information",
            "parameters": {
                "type": "object",
                "properties": {
                    "research_material": {
                        "type": "string",
                        "description": "research material of a given topic, including reference links when available",
                    },
                },
                "required": ["research_material"],
            },
        },
    ],
    "config_list": config_list
}


outbound_writing_assistant = autogen.AssistantAgent(
    name="writing_assistant",
    system_message="You are an outbound assistant. You can use the research function to collect information about a lead, and then use the create_outreach_msg function to write a personalized outreach message. Reply TERMINATE when your task is done.",
    llm_config=llm_config_outbound_writing_assistant,
)

user_proxy = autogen.UserProxyAgent(
    name="User_proxy",
    code_execution_config=False,
    human_input_mode="TERMINATE",
    function_map={
        "create_outreach_msg": create_outreach_msg,
        "research": research,
    }
)

# Load lead data from CSV file
def load_lead_data_from_csv(csv_file):
    with open(csv_file, mode='r', encoding='utf-8-sig') as file:
        csv_reader = csv.DictReader(file)
        leads = [row for row in csv_reader]
    return leads


# Load leads from CSV
leads = load_lead_data_from_csv(csv_file_path)

# Iterate through each lead in the CSV and process it using the multi-agentic team
for lead_data in leads:
    user_proxy.initiate_chat(
        outbound_writing_assistant, 
        message=f"create an effective outreach message for the LinkedIn profile: {lead_data}",
        parameters={"lead_data": lead_data}  # Pass only the LinkedIn URL
    )



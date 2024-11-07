import csv
import json
import os
import sys
from dotenv import load_dotenv
from typing import List, Dict, Any
from langchain_core.tools import BaseTool
from langchain_core.tools.base import BaseToolkit
from pydantic import ConfigDict, Field
from langchain_community.tools.office365.create_draft_message import O365CreateDraftMessage
from langchain_community.tools.office365.events_search import O365SearchEvents
from langchain_community.tools.office365.messages_search import O365SearchEmails
from langchain_community.tools.office365.send_event import O365SendEvent
from langchain_community.tools.office365.send_message import O365SendMessage
from langchain_community.tools.office365.utils import authenticate
from O365 import Account
import autogen

# Load environment variables
load_dotenv()

class O365Toolkit(BaseToolkit):
    account: Account = Field(default_factory=authenticate)
    model_config = ConfigDict(arbitrary_types_allowed=True)

    def get_tools(self) -> List[BaseTool]:
        return [
            O365SearchEvents(),
            O365CreateDraftMessage(),
            O365SearchEmails(),
            O365SendEvent(),
            O365SendMessage(),
        ]

# Ensure all models are rebuilt
O365Toolkit.model_rebuild()
O365SearchEvents.model_rebuild()
O365CreateDraftMessage.model_rebuild()
O365SearchEmails.model_rebuild()
O365SendEvent.model_rebuild()
O365SendMessage.model_rebuild()

# Create an instance of O365Toolkit
toolkit = O365Toolkit()

# Access the tools
print(toolkit.get_tools())

tools = []
function_map = {}

def generate_llm_config(tool):
    function_schema = {
        "name": tool.name.lower().replace(" ", "_"),
        "description": tool.description,
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    }
    if tool.args is not None:
        function_schema["parameters"]["properties"] = tool.args
    return function_schema

# Prepare the tools and register function mappings
for tool in toolkit.get_tools():
    tool_schema = generate_llm_config(tool)
    print(tool_schema)
    tools.append(tool_schema)
    function_map[tool.name] = tool._run

config_list = [{
    "model": os.getenv("AZURE_OPENAI_MODEL"),
    "api_key": os.getenv("AZURE_OPENAI_API_KEY"),
    "base_url": os.getenv("AZURE_OPENAI_ENDPOINT"),
    "api_version": os.getenv("OPENAI_API_VERSION"),
    "api_type": os.getenv("API_TYPE")
}]

llm_config = {
    "functions": tools,
    "config_list": config_list,
    "timeout": 120,
}

chatbot = autogen.AssistantAgent(
    name="chatbot",
    system_message="only use the functions you have been provided with. Reply TERMINATE when the task is done.",
    llm_config=llm_config,
)

user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    is_termination_msg=lambda x: x.get("content", "") and x.get("content", "").rstrip().endswith("TERMINATE"),
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    code_execution_config={
        "work_dir": "coding",
        "use_docker": False,
    },
)

user_proxy.register_function(function_map=function_map)


def format_email_body(body: str, name: str, subject: str) -> str:
    # Slice the body to remove content after "Best regards"
    main_body = body
    
    # Replace line breaks with HTML paragraph tags
    formatted_body = main_body.replace('\n', '</p>\n<p>')
    
    # Construct the full HTML body with proper structure
    html_body = (
        f"<html>\n"
        f"<body>\n"
        f"    <p>{formatted_body}</p>\n"
        f"</body>\n"
        f"</html>"
    )
    return html_body

        
name = sys.argv[1]
recipients = sys.argv[2]
subject = sys.argv[3]
body = sys.argv[4]

# Format the body for HTML
formatted_body = format_email_body(body, name, subject)

# Create the message using extracted and formatted data
message_content = f"Could you send email to {recipients} with subject '{subject}' and body '{formatted_body}'?"

# Start the chat with the chatbot
user_proxy.initiate_chat(
    chatbot,
    message=message_content,
    llm_config=llm_config,
    clear_history=False
)

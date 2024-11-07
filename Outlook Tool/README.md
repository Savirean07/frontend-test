# Office 365 Email Automation with Chatbot

This project is designed to automate interactions with Office 365 services, focusing on creating and sending emails through the O365 API. It integrates with **Langchain**, a framework for building applications powered by large language models (LLMs), and a custom chatbot to automate email drafting and sending based on user input.

## Features

- **Office 365 Integration**: Create draft messages, search for events, send emails, and manage Office 365 activities with the provided toolkit.
- **Langchain Integration**: Build a flexible and extendable chain of language models, enabling seamless automation of email communications.
- **Chatbot-Driven Automation**: Utilizes an AI-powered chatbot (Azure OpenAI) to automate email communications based on user input.
- **Custom Email Formatting**: Automatically formats email bodies in HTML for a cleaner appearance.

## What is Langchain?

[Langchain](https://langchain.com/) is an open-source framework designed to simplify the process of building applications that use large language models (LLMs). It provides a suite of tools to connect LLMs to various data sources, external APIs, and structured logic such as chains of actions and agent-based behavior. By integrating Langchain, developers can create highly dynamic, interactive systems like chatbots, intelligent agents, or research assistants that can reason and operate over a series of tasks.

### Why Langchain?

- **Modular Design**: Langchain is built with modular components that make it easy to integrate with different LLMs and external services.
- **Agent Framework**: Langchain’s agent framework allows models to interact with external tools, such as Office 365 services in this project.
- **Custom Chains**: Easily design chains of logic, where each action or task is based on a previous output.
- **Enhanced LLM Capabilities**: Langchain enhances the ability of LLMs by allowing them to access external resources and API calls in real-time.

In this project, Langchain is used to:
1. Integrate various tools and functions such as the Office 365 API services.
2. Enable chatbot interaction with the user, facilitating task completion and function execution.
3. Dynamically generate function schemas that map to tasks like searching events, sending messages, and creating drafts.

---

## Setup

### Prerequisites

- Python 3.8+
- [Office365 REST API](https://pypi.org/project/O365/)
- [Langchain](https://langchain.com/)
- [Autogen](https://github.com)
- [Azure OpenAI](https://azure.microsoft.com/en-us/services/cognitive-services/openai-service/)

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/your-repository.git
    cd your-repository
    ```

2. **Install required dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

3. **Set up environment variables**:

    Create a `.env` file in the root of the project and include the following credentials:

    ```plaintext
    AZURE_OPENAI_MODEL=your_model
    AZURE_OPENAI_API_KEY=your_api_key
    AZURE_OPENAI_ENDPOINT=your_openai_endpoint
    OPENAI_API_VERSION=your_openai_version
    API_TYPE=your_api_type
    AZURE_OPENAI_CLIENT_ID=your_client_id
    AZURE_OPENAI_CLIENT_SECRET=your_client_secret
    AZURE_OPENAI_TENANT_ID=your_tenant_id
    ```

4. **Authenticate Office 365**:

   You need to create an app in Azure to interact with Office 365 services (Outlook) and obtain the **client ID** and **client secret**.

### Creating an Azure App for Office 365 (Outlook)

To interact with Outlook via APIs, you need to register an application in Azure AD to obtain the **client ID** and **client secret**. Follow the steps below:

#### 1. **Create an Azure Account**
   - If you don't already have an Azure account, visit [Azure Portal](https://portal.azure.com/) and sign in or create an account.

#### 2. **Navigate to Azure Active Directory**
   - Once you're signed in to the Azure portal, search for **Azure Active Directory** in the search bar.
   - Go to **App registrations** on the left-hand side.

#### 3. **Register a New Application**
   - Click on **New registration**.
   - In the **Register an application** form:
     - **Name**: Enter a name for the app (e.g., "Outlook Automation App").
     - **Supported account types**: Select the types of accounts that can access your app:
       - **Accounts in this organizational directory only** or
       - **Accounts in any organizational directory**.
     - **Redirect URI**: Leave this blank for now (only required for web apps).
   - Click **Register**.

#### 4. **Get the Client ID**
   - After registering the app, you’ll be directed to the **Overview** page.
   - Copy the **Application (client) ID**. You’ll use this as your **client ID** in the `.env` file.

#### 5. **Create a Client Secret**
   - In the left sidebar, click on **Certificates & secrets**.
   - Under **Client secrets**, click **New client secret**.
   - Add a description and select the expiration time.
   - Click **Add**.
   - **Copy the value** of the client secret. You won’t be able to see it again after leaving the page. Add this value to your `.env` file as the **client secret**.

#### 6. **Grant API Permissions**
   - In the left sidebar, click **API permissions**.
   - Click **Add a permission** and choose **Microsoft Graph** (this API allows access to Office 365 services).
   - Under **Delegated permissions**, select the permissions you need:
     - `Mail.ReadWrite`
     - `Mail.Send`
     - `Calendars.ReadWrite`
   - Click **Add permissions**.
   - Once added, click **Grant admin consent** to allow your app access to the necessary APIs.

#### 7. **Use Client ID and Secret in Python**

   With the **client ID** and **client secret** now available, use them in your Python script for authentication:

   ```python
   from O365 import Account
   import os

   client_id = os.getenv('AZURE_OPENAI_CLIENT_ID')
   client_secret = os.getenv('AZURE_OPENAI_CLIENT_SECRET')
   credentials = (client_id, client_secret)

   # Authenticate your app
   account = Account(credentials)
   if account.authenticate(scopes=['basic', 'message_all']):
       print('Authenticated successfully')
   ```

   This code will authenticate your application with Office 365 and allow access to services such as email and calendar.

### File Structure

```
.
├── main.py                # Main Python file (provided in the description)
├── README.md              # Project README file
├── requirements.txt       # Python dependencies
└── .env                   # Environment variables file
```

### Usage

1. **Run the script**:

    You can initiate the process by running the script and providing the necessary inputs for the email:

    ```bash
    python main.py <name> <recipient> <subject> <body>
    ```

   Replace `<name>`, `<recipient>`, `<subject>`, and `<body>` with the actual values for the email you're sending.

### Example

If you're sending an email to "Jane Doe":

```bash
python main.py "Jane Doe" "jane.doe@example.com" "Project Update" "Hi Jane, here’s the update for the project. Best regards."
```

### Customization

- **Email Formatting**: The `format_email_body` function automatically converts line breaks into HTML paragraph tags. You can further customize the format as needed.
- **Chatbot Configuration**: The chatbot is configured through the `llm_config` object. You can adjust the chatbot’s behavior by modifying this configuration.

### How It Works

1. **Office 365 Toolkit**: This script utilizes the `O365Toolkit` class to access various tools like event searching, draft creation, and sending messages.
2. **Langchain Integration**: Langchain’s `BaseToolkit` is used to manage and register the Office 365 tools. These tools are then dynamically mapped into functions for the chatbot to use.
3. **Custom Chatbot**: The chatbot processes the email request and utilizes the provided tools to automate the email sending process.
4. **Dynamic Function Mapping**: A `function_map` is dynamically generated and used to map each function within the toolkit to its corresponding operation.
5. **HTML Email Formatting**: The email body is processed and formatted into an HTML structure, which can be directly sent via Office 365.

## Contributing

Feel free to contribute to this project by submitting pull requests or reporting issues.

## License

This project is licensed under the MIT License.

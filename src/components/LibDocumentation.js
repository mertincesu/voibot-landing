import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Code, Database, MessageSquare, Send, Target, Layers } from 'lucide-react';

const LibDocumentation = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: "Installation", icon: <Upload className="w-6 h-6" /> },
    { title: "Initialization", icon: <Database className="w-6 h-6" /> },
    { title: "Configuration", icon: <Code className="w-6 h-6" /> },
    { title: "Intents", icon: <Target className="w-6 h-6" /> },
    { title: "Reply Types", icon: <Send className="w-6 h-6" /> },
    { title: "Segment Assignments", icon: <Layers className="w-6 h-6" /> },
    { title: "Usage", icon: <MessageSquare className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-gray-800">Voi</span>
            <span className="text-indigo-600">Bot</span>
          </div>
          <button onClick={() => navigate('/')} className="text-indigo-600 hover:text-indigo-800 transition duration-300">
            Back to Home
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-12 text-center">VoiBot Documentation</h1>

        <div className="flex flex-col lg:flex-row -mx-4">
          <div className="w-full lg:w-1/4 px-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-4 text-left">Contents</h2>
              <ul className="text-left">
                {steps.map((step, index) => (
                  <li
                    key={index}
                    className={`flex items-center py-2 px-4 rounded-md cursor-pointer ${
                      activeStep === index ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    {step.icon}
                    <span className="ml-2">{step.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full lg:w-3/4 px-4">
            <div className="bg-white rounded-lg shadow-md p-8">
              {activeStep === 0 && (
                <div className="text-left">
                  <h2 className="text-2xl font-semibold mb-4 text-left">Installation</h2>
                  <p className="mb-4 text-left">To begin using VoiBot, install the library via pip:</p>
                  <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto text-left">
                    <code>pip install voibot</code>
                  </pre>
                  <h3 className="text-xl font-semibold mb-2 text-left">Prerequisites</h3>
                  <ul className="list-disc list-inside mb-4 text-left">
                    <li>OpenAI API Key: Required for language model-powered responses.</li>
                    <li>PDF Documents: Necessary for Retrieval-Augmented Generation (RAG) functionality.</li>
                  </ul>
                </div>
              )}

              {activeStep === 1 && (
                <div className="text-left">
                  <h2 className="text-2xl font-semibold mb-4 text-left">Initialization</h2>
                  <p className="mb-4 text-left">To initialize the VoiAssistant, import the class and set up the required parameters:</p>
                  <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto text-left">
                    <code>{`# Import VoiAssistant from voibot.chatbot                    
from voibot.chatbot import VoiAssistant

# Set up assistant parameters
openai_key = "sk-your-api-key"
pdf_url = "https://example.com/document.pdf"
role = "You are an AI assistant for Voi AI."
intents = {
    "Company-related": "Questions about the company",
    "Other Topic": "Topics not relevant to the role of this assistant",
    ...
}
replies = {
    "Company-related": "RAG",
    "Other Topic": "Unfortunately, I am unable to answer to that question.",
    ...
}
segment_assignments = {
    "Company-related": "unified",
    "Other Topic": "unified",
    ...
}
dont_know_response = "Unfortunately, I don't have that information right now"

# Initialize assistant
assistant = VoiAssistant(
    openai_key=openai_key,
    pdf_url=pdf_url,
    role=role,
    intents=intents,
    replies=replies,
    segment_assignments=segment_assignments,
    dont_know_response = dont_know_response
)

assistant.initialize_assistant()`}</code>
                  </pre>
                  <p className="mb-4 text-left">Ensure that you call <code>initialize_assistant()</code> before using the assistant to prepare the document for query processing.</p>
                </div>
              )}

              {activeStep === 2 && (
                <div className="text-left">
                  <h2 className="text-2xl font-semibold mb-4 text-left">Configuration</h2>
                  <p className="mb-4 text-left">VoiBot offers flexible configuration through various parameters:</p>
                  <ul className="list-disc list-inside mb-4 text-left">
                    <li><strong>Intents</strong>: Define possible user intents to classify input.</li>
                    <li><strong>Replies</strong>: Map intents to pre-defined replies or special markers such as "RAG" or "role_based_llm_reply".</li>
                    <li><strong>Segment Assignments</strong>: Define document segments related to each intent for refined retrieval.</li>
                  </ul>
                  <p className="mb-4 text-left">Example configuration:</p>
                  <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto text-left">
                    <code>{`intents = {
    "Company-related": "Questions about the company",
    "Assistant-related": "Questions about the assistant's capabilities",
    "Greeting": "Casual greetings like 'Hello' or 'How are you?'",
    ...
}

replies = {
    "Company-related": "RAG",
    "Assistant-related": "role_based_llm_reply",
    "Greeting": "role_based_llm_reply",
    ...
}

segment_assignments = {
    "Company-related": "unified",
    "Assistant-related": "unified",
    "Greeting": "unified",
    ...
}`}</code>
                  </pre>
                </div>
              )}

{activeStep === 3 && (
                <div className="text-left">
                  <h2 className="text-2xl font-semibold mb-4 text-left">Intents</h2>
                  <p className="mb-4 text-left">
                    Intents are a fundamental component of VoiBot's natural language understanding capabilities. 
                    They enable the system to accurately categorize and respond to user queries by mapping them 
                    to predefined categories of user intent.
                  </p>

                  <h3 className="text-xl font-semibold mb-2 text-left">Purpose of Intents</h3>
                  <p className="mb-4 text-left">Intents serve multiple crucial functions:</p>
                  <ul className="list-disc list-inside mb-4 text-left">
                    <li>Classify user inputs into actionable categories</li>
                    <li>Guide the assistant in selecting the appropriate response mechanism</li>
                    <li>Enhance interaction quality by ensuring relevant and context-aware responses</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-2 text-left">Defining Intents</h3>
                  <p className="mb-4 text-left">Each intent consists of two key components:</p>
                  <ol className="list-decimal list-inside mb-4 text-left">
                    <li><strong>Intent Name:</strong> A concise identifier for the query type (e.g., "Company-related")</li>
                    <li><strong>Intent Description:</strong> A brief explanation or example query illustrating the intent's purpose</li>
                  </ol>

                  <h3 className="text-xl font-semibold mb-2 text-left">Essential Intents</h3>
                  <p className="mb-4 text-left">
                    To ensure comprehensive coverage of user interactions, include these fundamental intents:
                  </p>
                  <ul className="list-disc list-inside mb-4 text-left">
                    <li><strong>Not Understandable Word/Phrase:</strong> For handling unintelligible inputs</li>
                    <li><strong>Greeting:</strong> To recognize and respond to casual greetings</li>
                    <li><strong>Other Topic:</strong> For managing off-topic or unrelated queries</li>
                    <li><strong>Company-related:</strong> To address inquiries about the company or product</li>
                    <li><strong>Assistant-related:</strong> For questions about the assistant's capabilities</li>
                    <li><strong>Previous Chat-related Inquiry:</strong> To handle follow-up questions or clarifications</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-2 text-left">Example Intent Configuration</h3>
                  <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto text-left">
                    <code>{`intents = {
    "Company-related": "Questions about the company (e.g., 'What is Voi AI?')",
    "Assistant-related": "Questions about capabilities (e.g., 'What can you do?')",
    "Greeting": "Casual greetings like 'Hello' or 'How are you?'",
    "Other Topic": "Non-related topics (e.g., 'What's the weather today?')",
    "Not Understandable Word/Phrase": "Gibberish or unintelligible input",
    "Previous Chat-related Inquiry": "Asking for clarification on previous responses"
}`}</code>
                  </pre>

                  <h3 className="text-xl font-semibold mb-2 text-left">Custom Intents</h3>
                  <p className="mb-4 text-left">
                    Beyond essential intents, custom intents can be defined to address domain-specific or 
                    advanced user queries. These should be tailored to the specific use case or industry 
                    in which VoiBot is deployed, such as technical support, customer service, or specific 
                    product inquiries.
                  </p>
                </div>
              )}

{activeStep === 4 && (
                <div className="text-left">
                  <h2 className="text-2xl font-semibold mb-4 text-left">Reply Types</h2>
                  <p className="mb-4 text-left">
                    VoiBot supports three distinct response types, each tailored to efficiently handle different scenarios. 
                    These response types are configured in the <code>replies</code> dictionary, mapping user intents to 
                    specific response mechanisms.
                  </p>

                  <h3 className="text-xl font-semibold mb-2 text-left">1. Automatic Reply</h3>
                  <p className="mb-4 text-left">
                    Automatic replies are predefined, static responses for specific intents. They provide instant, 
                    fixed responses without invoking the language model or document retrieval system.
                  </p>
                  <ul className="list-disc list-inside mb-4 text-left">
                    <li><strong>Use Case:</strong> Ideal for intents that don't require dynamic responses, such as when a user asks about unrelated topics or when handling simple fixed responses.</li>
                  </ul>
                  <p className="mb-2 text-left"><strong>Configuration Example:</strong></p>
                  <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto text-left">
                    <code>{`"Other Topic": "I'm sorry, but I can't help with that topic."`}</code>
                  </pre>
                  <p className="mb-4 text-left">
                    <strong>Explanation:</strong> This response is used when the user asks something unrelated, 
                    and the system provides a static, pre-configured reply.
                  </p>

                  <h3 className="text-xl font-semibold mb-2 text-left">2. Role-Based LLM Reply</h3>
                  <p className="mb-4 text-left">
                    Role-based LLM (Language Learning Model) replies utilize the assistant's language model to generate 
                    dynamic, contextually relevant responses based on the defined role of the assistant.
                  </p>
                  <ul className="list-disc list-inside mb-4 text-left">
                    <li><strong>Use Case:</strong> Best suited for conversational responses that require adaptability, where the assistant needs to sound human-like and engage naturally with users.</li>
                  </ul>
                  <p className="mb-2 text-left"><strong>Configuration Example:</strong></p>
                  <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto text-left">
                    <code>{`"Greeting": "role_based_llm_reply"`}</code>
                  </pre>
                  <p className="mb-4 text-left">
                    <strong>Explanation:</strong> When the user greets the assistant with something like "Hello" or 
                    "How are you?", the assistant dynamically generates a response such as "Hello! How can I assist 
                    you with Voi AI today?" based on the role of the assistant (Role that is defined in Initialization).
                  </p>

                  <h3 className="text-xl font-semibold mb-2 text-left">3. Retrieval-Augmented Generation (RAG)</h3>
                  <p className="mb-4 text-left">
                    Retrieval-Augmented Generation (RAG) combines document retrieval with language generation to produce 
                    accurate, information-rich responses. The assistant retrieves relevant information from a knowledge 
                    base (like a PDF document) and generates a detailed response.
                  </p>
                  <ul className="list-disc list-inside mb-4 text-left">
                    <li><strong>Use Case:</strong> Perfect for technical queries or questions requiring factual information from documentation.</li>
                  </ul>
                  <p className="mb-2 text-left"><strong>Configuration Example:</strong></p>
                  <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto text-left">
                    <code>{`"Company-related": "RAG"`}</code>
                  </pre>
                  <p className="mb-4 text-left">
                    <strong>Explanation:</strong> For questions about the company or product, such as "What is Voi AI?", 
                    the assistant retrieves relevant information from the document and provides a detailed response.
                  </p>
                  <p className="mb-2 text-left"><strong>Don't Know Answer:</strong></p>
                  <p className="mb-4 text-left">
                    If the assistant cannot find a suitable answer from the knowledge base, it can be configured to 
                    return a fallback response:
                  </p>
                  <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto text-left">
                    <code>{`dont_know_response = "I'm not sure if I have that information right now..."`}</code>
                  </pre>

                  <p className="mb-4 text-left">
                    Note: This should be configured as one of the parameters of VoiAssistant and not as a Reply (See Initialization). By configuring and leveraging these response types, VoiBot can efficiently handle a diverse range 
                    of queries, from casual greetings to complex, fact-based inquiries requiring document retrieval.
                  </p>
                </div>
              )}

{activeStep === 5 && (
                <div className="text-left">
                  <h2 className="text-2xl font-semibold mb-4 text-left">Segment Assignments</h2>
                  <p className="mb-4 text-left">
                    In VoiBot, the <strong>segment assignments</strong> feature is used to define which portion of the document 
                    (or knowledge base) relates to each specific intent. This feature is especially useful for advanced 
                    configurations where different intents might require responses from specific sections of a document.
                  </p>

                  <h3 className="text-xl font-semibold mb-2 text-left">Current Configuration</h3>
                  <p className="mb-4 text-left">
                    While the segmented vector database feature is under development, all intents should be associated 
                    with the <strong>unified</strong> segment, meaning they pull from the entire document. This ensures 
                    that the assistant has access to the complete knowledge base when generating responses.
                  </p>

                  <h3 className="text-xl font-semibold mb-2 text-left">Example Configuration</h3>
                  <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto text-left">
                    <code>{`segment_assignments = {
    "Company-related": "unified",
    "Assistant-related": "unified",
    "Greeting": "unified",
    "Other Topic": "unified",
    "Not Understandable Word/Phrase": "unified",
    "Previous chat-related inquiry": "unified",
    "Clarification": "unified",
    "Follow-up Inquiry": "unified",
    "User Feedback (Positive)": "unified",
    "User Feedback (Negative)": "unified",
}`}</code>
                  </pre>
                  <p className="mb-4 text-left">
                    In this example, every intent is assigned to the "unified" segment, which means the assistant will 
                    retrieve relevant information from the entire document for any intent.
                  </p>

                  <h3 className="text-xl font-semibold mb-2 text-left">Future Development</h3>
                  <p className="mb-4 text-left">
                    The future development of VoiBot will include a <strong>segmented vector database</strong> feature. 
                    This enhancement will allow users to associate custom PDF contents with custom intents, providing 
                    more granular control over the assistant's document-based responses.
                  </p>
                  <p className="mb-4 text-left">
                    Once this feature is complete, users will be able to assign specific document segments to each intent, 
                    enabling more tailored responses based on the relevant parts of a document for each query.
                  </p>
                  <p className="mb-4 text-left">
                    For now, continue using the "unified" approach to ensure the assistant has the best chance of 
                    retrieving the right information from the entire document.
                  </p>
                </div>
              )}

{activeStep === 6 && (
                <div className="text-left">
                  <h2 className="text-2xl font-semibold mb-4 text-left">Usage</h2>
                  <p className="mb-4 text-left">
                    Once initialized and configured, you can utilize the <code>VoiAssistant</code> to generate 
                    responses to queries in an interactive loop. This allows for continuous interaction with the assistant.
                  </p>

                  <h3 className="text-xl font-semibold mb-2 text-left">Interactive Loop</h3>
                  <p className="mb-4 text-left">
                    Implement the following code to create an interactive session with the assistant:
                  </p>
                  <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto text-left">
                    <code>{`while True:
    # Ask a query
    query = input("You: ")
    
    # Get assistant's response
    response = assistant.get_response(query)
    
    # Print the assistant's response
    print(f"Assistant: {response}")
    
    # Exit condition
    if query.lower() == "exit":
        print("Conversation ended.")
        break`}</code>
                  </pre>
                  <p className="mb-4 text-left">
                    This loop facilitates continuous interaction with the assistant. To end the conversation, 
                    simply type "exit".
                  </p>

                  <h3 className="text-xl font-semibold mb-2 text-left">Additional Functions</h3>
                  <p className="mb-4 text-left">
                    VoiBot provides additional functions to retrieve the most recent query or response:
                  </p>
                  <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto text-left">
                    <code>{`# Retrieve the most recent response
recent_response = assistant.get_most_recent_response()

# Retrieve the most recent query
recent_query = assistant.get_most_recent_query()`}</code>
                  </pre>
                  <p className="mb-4 text-left">
                    These functions allow you to reference the latest conversation state, which can be useful 
                    for contextual follow-up queries or debugging purposes.
                  </p>

                  <h3 className="text-xl font-semibold mb-2 text-left">Error Handling</h3>
                  <p className="mb-4 text-left">
                    Implement error handling to manage potential issues during initialization:
                  </p>
                  <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto text-left">
                    <code>{`try:
    assistant.initialize_assistant()
except Exception as e:
    print(f"Initialization error: {e}")`}</code>
                  </pre>
                  <p className="mb-4 text-left">
                    This error handling ensures that any issues (e.g., document loading problems or API key errors) 
                    are handled gracefully without crashing the application.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LibDocumentation;
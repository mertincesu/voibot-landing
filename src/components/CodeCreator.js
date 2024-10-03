import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Handle
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PlusCircle, MessageSquare, Database, Zap, Code, X, Check, Link } from 'lucide-react';

const IntentNode = ({ data, isConnectable }) => (
  <div className="p-3 rounded-lg bg-blue-100 border-2 border-blue-500">
    <Handle type="source" position="right" isConnectable={isConnectable} />
    <input
      className="font-bold bg-transparent border-b border-blue-500 mb-2 w-full"
      value={data.label}
      onChange={data.onLabelChange}
      placeholder="Intent Name"
    />
    <textarea
      className="text-sm bg-transparent w-full"
      value={data.definition}
      onChange={data.onDefinitionChange}
      placeholder="Intent Definition"
      rows="2"
    />
    <button onClick={data.onDelete} className="absolute top-0 right-0 p-1">
      <X size={16} />
    </button>
  </div>
);

const AutoReplyNode = ({ data, isConnectable }) => (
  <div className="p-3 rounded-lg bg-green-100 border-2 border-green-500">
    <Handle type="target" position="left" isConnectable={isConnectable} />
    <h3 className="font-bold mb-2">Auto Reply</h3>
    <textarea
      className="text-sm bg-transparent w-full"
      value={data.content}
      onChange={data.onContentChange}
      placeholder="Auto Reply Content"
      rows="2"
    />
    <button onClick={data.onDelete} className="absolute top-0 right-0 p-1">
      <X size={16} />
    </button>
  </div>
);

const LLMReplyNode = ({ data, isConnectable }) => (
  <div className="p-3 rounded-lg bg-yellow-100 border-2 border-yellow-500">
    <Handle type="target" position="left" isConnectable={isConnectable} />
    <h3 className="font-bold">LLM Reply</h3>
    <button onClick={data.onDelete} className="absolute top-0 right-0 p-1">
      <X size={16} />
    </button>
  </div>
);

const RAGReplyNode = ({ data, isConnectable }) => (
  <div className="p-3 rounded-lg bg-purple-100 border-2 border-purple-500">
    <Handle type="target" position="left" isConnectable={isConnectable} />
    <Handle type="source" position="right" isConnectable={isConnectable} />
    <h3 className="font-bold">RAG Reply</h3>
    <button onClick={data.onDelete} className="absolute top-0 right-0 p-1">
      <X size={16} />
    </button>
  </div>
);

const DatabaseSegmentNode = ({ data, isConnectable }) => (
  <div className="p-3 rounded-lg bg-indigo-100 border-2 border-indigo-500">
    <Handle type="target" position="left" isConnectable={isConnectable} />
    <Handle type="source" position="right" isConnectable={isConnectable} />
    <input
      className="font-bold bg-transparent border-b border-indigo-500 mb-2 w-full"
      value={data.label}
      onChange={data.onLabelChange}
      placeholder="Segment Name"
    />
    <button onClick={data.onDelete} className="absolute top-0 right-0 p-1">
      <X size={16} />
    </button>
  </div>
);

const URLNode = ({ data, isConnectable }) => (
  <div className="p-3 rounded-lg bg-red-100 border-2 border-red-500">
    <Handle type="target" position="left" isConnectable={isConnectable} />
    <input
      className="text-sm bg-transparent w-full"
      value={data.url}
      onChange={data.onURLChange}
      placeholder="Enter URL"
    />
    <button onClick={data.onDelete} className="absolute top-0 right-0 p-1">
      <X size={16} />
    </button>
  </div>
);

const nodeTypes = {
  intent: IntentNode,
  autoReply: AutoReplyNode,
  llmReply: LLMReplyNode,
  ragReply: RAGReplyNode,
  databaseSegment: DatabaseSegmentNode,
  url: URLNode,
};

const LibDocumentation = () => {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const nextId = useRef(1);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (
        (sourceNode.type === 'intent' && ['autoReply', 'llmReply', 'ragReply'].includes(targetNode.type)) ||
        (sourceNode.type === 'ragReply' && targetNode.type === 'databaseSegment') ||
        (sourceNode.type === 'databaseSegment' && targetNode.type === 'url')
      ) {
        if (
          (sourceNode.type === 'ragReply' && edges.some(e => e.source === params.source)) ||
          (targetNode.type === 'ragReply' && edges.some(e => e.target === params.target))
        ) {
          console.log("RAG node already has a connection on this side");
          return;
        }
        
        setEdges((eds) => addEdge(params, eds));
      } else {
        console.log("Invalid connection");
      }
    },
    [nodes, edges]
  );

  const addNode = (type) => {
    const newNode = {
      id: `${type}-${nextId.current}`,
      type,
      position: { x: 100, y: 100 + (nextId.current * 100) },
      data: {
        label: type === 'intent' ? 'New Intent' : type === 'databaseSegment' ? 'New Segment' : '',
        definition: '',
        content: '',
        url: '',
        onLabelChange: (evt) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === newNode.id
                ? { ...node, data: { ...node.data, label: evt.target.value } }
                : node
            )
          );
        },
        onDefinitionChange: (evt) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === newNode.id
                ? { ...node, data: { ...node.data, definition: evt.target.value } }
                : node
            )
          );
        },
        onContentChange: (evt) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === newNode.id
                ? { ...node, data: { ...node.data, content: evt.target.value } }
                : node
            )
          );
        },
        onURLChange: (evt) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === newNode.id
                ? { ...node, data: { ...node.data, url: evt.target.value } }
                : node
            )
          );
        },
        onDelete: () => {
          setNodes((nds) => nds.filter((node) => node.id !== newNode.id));
          setEdges((eds) => eds.filter((edge) => edge.source !== newNode.id && edge.target !== newNode.id));
        },
      },
    };
    setNodes((nds) => nds.concat(newNode));
    nextId.current++;
  };

  const generateCode = () => {
    const intents = nodes.filter(node => node.type === 'intent');
    const segments = nodes.filter(node => node.type === 'databaseSegment');
  
    const getConnectedNode = (nodeId, edgeType) => {
      const edge = edges.find(e => e[edgeType] === nodeId);
      return edge ? nodes.find(n => n.id === (edgeType === 'source' ? edge.target : edge.source)) : null;
    };
  
    const getConnectedURLs = (segmentId) => {
      return edges
        .filter(e => e.source === segmentId)
        .map(e => nodes.find(n => n.id === e.target))
        .filter(n => n && n.type === 'url')
        .map(n => n.data.url)
        .filter((url, index, self) => self.indexOf(url) === index); // Remove duplicates
    };
  
    let code = `from voibot.chatbot import VoiAssistant
  
# Set up the parameters for the assistant
openai_key = "your_openai_key_here"
role = "You are an AI virtual assistant for Voi AI. You are tasked with answering questions about Voi AI or VoiBot"
  
pdf_urls = {
  ${segments.map(segment => {
    const urls = getConnectedURLs(segment.id);
    return `    "${segment.data.label}": [${urls.map(url => `"${url}"`).join(', ')}],`;
  }).join('\n')}
}
  
intents = {
  ${intents.map(intent => `    "${intent.data.label}": "${intent.data.definition}",`).join('\n')}
}
  
replies = {
  ${intents.map(intent => {
    const replyNode = getConnectedNode(intent.id, 'source');
    if (replyNode) {
      switch (replyNode.type) {
        case 'autoReply':
          return `    "${intent.data.label}": "${replyNode.data.content}",`;
        case 'llmReply':
          return `    "${intent.data.label}": "role_based_llm_reply",`;
        case 'ragReply':
          return `    "${intent.data.label}": "RAG",`;
      }
    }
    return `    "${intent.data.label}": "default_response",`;
  }).join('\n')}
}
  
segment_assignments = {
  ${intents.map(intent => {
    const replyNode = getConnectedNode(intent.id, 'source');
    if (replyNode && replyNode.type === 'ragReply') {
      const segmentNode = getConnectedNode(replyNode.id, 'source');
      return `    "${intent.data.label}": "${segmentNode ? segmentNode.data.label : 'unified'}",`;
    }
    return `    "${intent.data.label}": "no_segment",`;
  }).join('\n')}
}
  
dont_know_response = "I'm not sure if I have that information right now..."
  
# Initialize the assistant
assistant = VoiAssistant(
    openai_key=openai_key,
    pdf_urls=pdf_urls,
    role=role,
    intents=intents,
    replies=replies,
    segment_assignments=segment_assignments,
    dont_know_response=dont_know_response
)
  
# Initialize the assistant (this will load the PDFs and prepare the indices)
assistant.initialize_assistant()

while True:
    query = input("You: ")
    if query.lower() == "exit":
        print("Conversation ended.")
        break
    response = assistant.get_response(query)
    print(f"Assistant: {response}")`;

    setGeneratedCode(code);
    setShowCode(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

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

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Build Your VoiBot Assistant</h1>

        {!showCode ? (
          <>
            <div className="flex space-x-4 mb-4">
              <button onClick={() => addNode('intent')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                <PlusCircle size={20} className="inline mr-2" /> Add Intent
              </button>
              <button onClick={() => addNode('autoReply')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                <MessageSquare size={20} className="inline mr-2" /> Add Auto Reply
              </button>
              <button onClick={() => addNode('llmReply')} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                <Zap size={20} className="inline mr-2" /> Add LLM Reply
              </button>
              <button onClick={() => addNode('ragReply')} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                <Database size={20} className="inline mr-2" /> Add RAG Reply
              </button>
              <button onClick={() => addNode('databaseSegment')} className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
                <Database size={20} className="inline mr-2" /> Add Database Segment
              </button>
              <button onClick={() => addNode('url')} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                <Link size={20} className="inline mr-2" /> Add URL
              </button>
            </div>

            <div style={{ height: '600px', width: '100%' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                connectionLineStyle={{ stroke: "#ddd", strokeWidth: 2 }}
                connectionLineType="bezier"
                snapToGrid={true}
                snapGrid={[16, 16]}
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </>
        ) : (
          <div className="bg-gray-800 p-4 rounded-lg relative">
            <pre className="text-white overflow-auto p-4 text-left" style={{ maxHeight: '600px' }}>
              <code>{generatedCode}</code>
            </pre>
            <button 
              onClick={copyToClipboard}
              className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center"
            >
              {isCopied ? (
                <>
                  <Check size={16} className="mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Code size={16} className="mr-1" />
                  Copy Code
                </>
              )}
            </button>
          </div>
        )}

        <button 
          onClick={() => {
            if (!showCode) {
              generateCode();
            } else {
              setShowCode(false);
            }
          }} 
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 mt-8"
        >
          {showCode ? (
            <>
              <Code size={20} className="inline mr-2" /> Back to Build
            </>
          ) : (
            <>
              <Code size={20} className="inline mr-2" /> Generate VoiBot Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LibDocumentation;
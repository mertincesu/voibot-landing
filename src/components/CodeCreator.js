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
  <div className="p-2 rounded-lg bg-blue-100 border-2 border-blue-500 w-40">
    <Handle type="source" position="right" isConnectable={isConnectable} />
    <input
      className="font-bold bg-transparent border-b border-blue-500 mb-1 w-full text-sm"
      value={data.label}
      onChange={data.onLabelChange}
      placeholder="Intent Name"
    />
    <textarea
      className="text-xs bg-transparent w-full"
      value={data.definition}
      onChange={data.onDefinitionChange}
      placeholder="Intent Definition"
      rows="2"
    />
    <button onClick={data.onDelete} className="absolute top-0 right-0 p-1">
      <X size={12} />
    </button>
  </div>
);

const AutoReplyNode = ({ data, isConnectable }) => (
  <div className="p-2 rounded-lg bg-green-100 border-2 border-green-500 w-40">
    <Handle type="target" position="left" isConnectable={isConnectable} />
    <h3 className="font-bold text-sm mb-1">Auto Reply</h3>
    <textarea
      className="text-xs bg-transparent w-full"
      value={data.content}
      onChange={data.onContentChange}
      placeholder="Auto Reply Content"
      rows="2"
    />
    <button onClick={data.onDelete} className="absolute top-0 right-0 p-1">
      <X size={12} />
    </button>
  </div>
);

const LLMReplyNode = ({ data, isConnectable }) => (
  <div className="p-2 rounded-lg bg-yellow-100 border-2 border-yellow-500 w-40">
    <Handle type="target" position="left" isConnectable={isConnectable} />
    <h3 className="font-bold text-sm">LLM Reply</h3>
    <button onClick={data.onDelete} className="absolute top-0 right-0 p-1">
      <X size={12} />
    </button>
  </div>
);

const RAGReplyNode = ({ data, isConnectable }) => (
  <div className="p-2 rounded-lg bg-purple-100 border-2 border-purple-500 w-40">
    <Handle type="target" position="left" isConnectable={isConnectable} />
    <Handle type="source" position="right" isConnectable={isConnectable} />
    <h3 className="font-bold text-sm">RAG Reply</h3>
    <button onClick={data.onDelete} className="absolute top-0 right-0 p-1">
      <X size={12} />
    </button>
  </div>
);

const DatabaseSegmentNode = ({ data, isConnectable }) => (
  <div className="p-2 rounded-lg bg-indigo-100 border-2 border-indigo-500 w-40">
    <Handle type="target" position="left" isConnectable={isConnectable} />
    <Handle type="source" position="right" isConnectable={isConnectable} />
    <input
      className="font-bold bg-transparent border-b border-indigo-500 mb-1 w-full text-sm"
      value={data.label}
      onChange={data.onLabelChange}
      placeholder="Segment Name"
    />
    <button onClick={data.onDelete} className="absolute top-0 right-0 p-1">
      <X size={12} />
    </button>
  </div>
);

const URLNode = ({ data, isConnectable }) => (
  <div className="p-2 rounded-lg bg-red-100 border-2 border-red-500 w-40">
    <Handle type="target" position="left" isConnectable={isConnectable} />
    <input
      className="text-xs bg-transparent w-full"
      value={data.url}
      onChange={data.onURLChange}
      placeholder="Enter URL"
    />
    <button onClick={data.onDelete} className="absolute top-0 right-0 p-1">
      <X size={12} />
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
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

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
    if (!reactFlowInstance) return;

    const position = reactFlowInstance.project({
      x: reactFlowWrapper.current.offsetWidth / 2,
      y: reactFlowWrapper.current.offsetHeight / 2
    });

    const newNode = {
      id: `${type}-${nextId.current}`,
      type,
      position,
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">
              <span className="text-gray-800">Voi</span>
              <span className="text-indigo-600">Bot</span>
            </div>
            <button onClick={() => navigate('/')} className="text-indigo-600 hover:text-indigo-800 transition duration-300">
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-grow container mx-auto px-6 py-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Build Your VoiBot Assistant</h1>

        {!showCode ? (
          <div className="flex-grow flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => addNode('intent')} className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600">
                <PlusCircle size={16} className="inline mr-1" /> Intent
              </button>
              <button onClick={() => addNode('autoReply')} className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600">
                <MessageSquare size={16} className="inline mr-1" /> Auto Reply
              </button>
              <button onClick={() => addNode('llmReply')} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600">
                <Zap size={16} className="inline mr-1" /> LLM Reply
              </button>
              <button onClick={() => addNode('ragReply')} className="bg-purple-500 text-white px-2 py-1 rounded text-sm hover:bg-purple-600">
                <Database size={16} className="inline mr-1" /> RAG Reply
              </button>
              <button onClick={() => addNode('databaseSegment')} className="bg-indigo-500 text-white px-2 py-1 rounded text-sm hover:bg-indigo-600">
                <Database size={16} className="inline mr-1" /> Database Segment
              </button>
              <button onClick={() => addNode('url')} className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600">
                <Link size={16} className="inline mr-1" /> URL
              </button>
            </div>

            <div className="flex-grow" style={{ height: 'calc(100vh - 240px)' }} ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                onInit={setReactFlowInstance}
                connectionLineStyle={{ stroke: "#ddd", strokeWidth: 2 }}
                connectionLineType="bezier"
                snapToGrid={true}
                snapGrid={[32, 32]}
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </div>
        ) : (
          <div className="flex-grow bg-gray-800 rounded-lg relative overflow-hidden">
            <pre className="text-white overflow-auto h-full p-4 text-left" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              <code>{generatedCode}</code>
            </pre>
            <button 
              onClick={copyToClipboard}
              className="absolute top-2 right-6 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md flex items-center text-sm"
            >
              {isCopied ? (
                <>
                  <Check size={14} className="mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Code size={14} className="mr-1" />
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
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 mt-4 self-end"
        >
          {showCode ? (
            <>
              <Code size={18} className="inline mr-2" /> Back to Build
            </>
          ) : (
            <>
              <Code size={18} className="inline mr-2" /> Generate VoiBot Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LibDocumentation;
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageTransition from '@/components/PageTransition';
import { Input } from "@/components/ui/input";
import { SendHorizonal, Bot, User, Menu, X } from "lucide-react";
import ChatSidebar from './ChatSidebar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export default function Counselor() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI counselor. How are you feeling today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const lastActiveChatId = localStorage.getItem('lastActiveChatId');
    if (lastActiveChatId) {
      loadChat(lastActiveChatId);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadChat = async (id: string) => {
    setChatId(id);
    setMessages([]);
    localStorage.setItem('lastActiveChatId', id);
    await fetchChatHistory(id);
  };

  const startNewChat = () => {
    setChatId(null);
    setMessages([
      { role: 'assistant', content: 'Hello! I\'m your AI counselor. How are you feeling today?' }
    ]);
    localStorage.removeItem('lastActiveChatId');
  };

  const fetchChatHistory = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/get-chat-history?chatId=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.messages?.length) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user' as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message, chatId, messages: messages.slice(-5) })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.messages) {
        setMessages(data.messages);
      } else if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant' as const, content: data.response }]);
      }

      if (data.chatId) {
        setChatId(data.chatId);
        localStorage.setItem('lastActiveChatId', data.chatId);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="h-screen flex overflow-hidden pt-16">
        <div>
          <ChatSidebar onSelectChat={loadChat} onNewChat={startNewChat} currentChatId={chatId} />
        </div>

        {/* Main Chat - Full width now */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Button variant="ghost" className="md:hidden text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </Button>

          <div
            className="flex-1 bg-cover bg-center"
            style={{ backgroundImage: 'url("/src/components/images/counselor.png")' }}
          >
            <div className="container mx-auto px-4 py-4 h-full flex flex-col">
              <Card className="backdrop-blur-md bg-black/20 border-white/10 flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <Bot className="h-6 w-6" />
                    AI Counselor
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col relative">
                  {/* Simple scrollable area with proper height */}
                  <div className="absolute inset-0 overflow-y-auto pr-4 pb-16">
                    <div className="space-y-4 min-h-full">
                      {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`p-2 rounded-full ${msg.role === 'user' ? 'bg-primary' : 'bg-white/10'}`}>
                            {msg.role === 'user' ? <User className="h-5 w-5 text-primary-foreground" /> : <Bot className="h-5 w-5 text-white" />}
                          </div>
                          <div className={`rounded-lg p-4 max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-white'}`}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Fixed position input at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 mt-4 flex gap-2 bg-black/20 backdrop-blur-md p-2 rounded-lg">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                      onKeyDown={(e) => { if (e.key === 'Enter' && message.trim()) sendMessage(); }}
                    />
                    <Button className="gap-2" onClick={sendMessage} disabled={loading}>
                      <SendHorizonal className="h-4 w-4" />
                      {loading ? "Thinking..." : "Send"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
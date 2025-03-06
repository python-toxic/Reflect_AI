import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, MessageSquare, Trash2 } from "lucide-react";

interface ChatItem {
  id: string;
  title: string;
  createdAt: string;
}

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  currentChatId: string | null;
}

export default function ChatSidebar({ onSelectChat, onNewChat, currentChatId }: ChatSidebarProps) {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserChats();
  }, []);

  const fetchUserChats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/get-user-chats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.chats) {
        setChats(data.chats);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/delete-chat/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Remove the deleted chat from the list
        setChats(chats.filter(chat => chat.id !== chatId));
        
        // If the currently selected chat was deleted, start a new chat
        if (currentChatId === chatId) {
          onNewChat();
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <div className="w-64 bg-green-950 h-full flex flex-col">
      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 bg-white/10 hover:bg-white/20 text-white border-0"
          onClick={onNewChat}
        >
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-white/70">Your Conversations</h2>
          <div className="space-y-1">
            {loading ? (
              <p className="text-white/50 text-sm px-2">Loading...</p>
            ) : chats.length === 0 ? (
              <p className="text-white/50 text-sm px-2">No previous chats</p>
            ) : (
              chats.map((chat) => (
                <div 
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`flex items-center justify-between group px-3 py-2 rounded-md ${
                    currentChatId === chat.id ? 'bg-white/20' : 'hover:bg-white/10'
                  } cursor-pointer transition-colors`}
                >
                  <div className="flex items-center gap-2 text-white overflow-hidden">
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-sm">{chat.title}</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-white/70 hover:text-white/100"
                    onClick={(e) => deleteChat(chat.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
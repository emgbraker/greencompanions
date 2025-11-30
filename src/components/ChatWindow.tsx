import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface ChatWindowProps {
  matchUser: {
    match_user_id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  onClose: () => void;
  onMessageSent?: () => void;
}

export const ChatWindow = ({ matchUser, onClose, onMessageSent }: ChatWindowProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    markMessagesAsRead();

    // Set up realtime subscription
    const channel = supabase
      .channel(`messages:${user?.id}:${matchUser.match_user_id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${matchUser.match_user_id},receiver_id=eq.${user?.id}`,
        },
        (payload) => {
          console.log('New message received:', payload);
          const newMsg = payload.new as Message;
          setMessages(prev => [...prev, newMsg]);
          markMessagesAsRead();
          if (onMessageSent) onMessageSent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchUser.match_user_id, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${matchUser.match_user_id}),and(sender_id.eq.${matchUser.match_user_id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Er ging iets mis bij het laden van berichten");
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!user) return;

    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', matchUser.match_user_id)
        .eq('receiver_id', user.id)
        .eq('read', false);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || sending) return;

    try {
      setSending(true);
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: matchUser.match_user_id,
          content: newMessage.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      setNewMessage("");
      if (onMessageSent) onMessageSent();
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Bericht kon niet worden verstuurd");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Vandaag";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Gisteren";
    } else {
      return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  };

  const shouldShowDateSeparator = (index: number) => {
    if (index === 0) return true;
    const currentDate = new Date(messages[index].created_at).toDateString();
    const previousDate = new Date(messages[index - 1].created_at).toDateString();
    return currentDate !== previousDate;
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={matchUser.avatar_url || undefined} />
          <AvatarFallback className="bg-gradient-primary text-white">
            {matchUser.first_name[0]}{matchUser.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">
            {matchUser.first_name} {matchUser.last_name[0]}.
          </h3>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20"
      >
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <Skeleton className="h-16 w-64 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p>Nog geen berichten</p>
              <p className="text-sm mt-1">Stuur een bericht om het gesprek te starten! 👋</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.sender_id === user?.id;
            const showDateSeparator = shouldShowDateSeparator(index);

            return (
              <div key={message.id}>
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-4">
                    <span className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-full border border-border">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                )}
                <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isOwnMessage
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border border-border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}
                    >
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Typ een bericht..."
            className="flex-1"
            disabled={sending}
            maxLength={1000}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || sending}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
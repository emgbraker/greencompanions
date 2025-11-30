import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { ChatWindow } from "@/components/ChatWindow";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Match {
  match_user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
}

const MessagesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMatches();
  }, [user, navigate]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      
      // Get mutual matches with unread counts
      const { data: mutualMatches, error: matchesError } = await supabase
        .from('matches')
        .select(`
          user_id,
          matched_user_id,
          profiles!matches_matched_user_id_fkey(id, first_name, last_name, avatar_url)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'pending');

      if (matchesError) throw matchesError;

      // Check which are mutual
      const matchesWithMutual = await Promise.all(
        (mutualMatches || []).map(async (match) => {
          const matchedUserId = match.matched_user_id;
          
          // Check if there's a reverse match
          const { data: reverseMatch } = await supabase
            .from('matches')
            .select('id')
            .eq('user_id', matchedUserId)
            .eq('matched_user_id', user?.id)
            .eq('status', 'pending')
            .single();

          if (!reverseMatch) return null;

          // Get unread count
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', matchedUserId)
            .eq('receiver_id', user?.id)
            .eq('read', false);

          // Get last message
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('content, created_at')
            .or(`sender_id.eq.${matchedUserId},receiver_id.eq.${matchedUserId}`)
            .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const profile = match.profiles as any;

          return {
            match_user_id: matchedUserId,
            first_name: profile.first_name,
            last_name: profile.last_name,
            avatar_url: profile.avatar_url,
            last_message: lastMsg?.content || null,
            last_message_time: lastMsg?.created_at || null,
            unread_count: count || 0
          };
        })
      );

      const validMatches = matchesWithMutual.filter((m): m is Match => m !== null);
      
      // Sort by last message time
      validMatches.sort((a, b) => {
        if (!a.last_message_time) return 1;
        if (!b.last_message_time) return -1;
        return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
      });

      setMatches(validMatches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast.error("Er ging iets mis bij het laden van matches");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Zojuist";
    if (diffMins < 60) return `${diffMins}m geleden`;
    if (diffHours < 24) return `${diffHours}u geleden`;
    if (diffDays < 7) return `${diffDays}d geleden`;
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-hero">
        <div className="h-[calc(100vh-4rem)] flex">
          {/* Sidebar - Matches List */}
          <div className="w-full md:w-96 bg-background border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                Berichten
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="space-y-2 p-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : matches.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Nog geen matches</h3>
                  <p className="text-muted-foreground text-sm">
                    Wanneer je een wederzijdse match hebt, kun je hier beginnen met chatten
                  </p>
                </div>
              ) : (
                matches.map((match) => (
                  <div
                    key={match.match_user_id}
                    onClick={() => setSelectedMatch(match)}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border ${
                      selectedMatch?.match_user_id === match.match_user_id ? 'bg-muted' : ''
                    }`}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={match.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {match.first_name[0]}{match.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {match.first_name} {match.last_name[0]}.
                        </h3>
                        {match.last_message_time && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {formatTime(match.last_message_time)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {match.last_message || "Geen berichten nog"}
                        </p>
                        {match.unread_count > 0 && (
                          <Badge variant="default" className="ml-2 min-w-[20px] h-5 rounded-full px-2">
                            {match.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 hidden md:flex">
            {selectedMatch ? (
              <ChatWindow
                matchUser={selectedMatch}
                onClose={() => setSelectedMatch(null)}
                onMessageSent={fetchMatches}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <MessageSquare className="w-24 h-24 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-semibold text-muted-foreground mb-2">
                    Selecteer een gesprek
                  </h3>
                  <p className="text-muted-foreground">
                    Kies een match om te beginnen met chatten
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile chat window as overlay */}
      {selectedMatch && (
        <div className="md:hidden fixed inset-0 z-50 bg-background">
          <ChatWindow
            matchUser={selectedMatch}
            onClose={() => setSelectedMatch(null)}
            onMessageSent={fetchMatches}
          />
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
-- Create messages table for private messaging between matched users
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_messages_sender_receiver ON public.messages(sender_id, receiver_id, created_at DESC);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id, read);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if two users have a mutual match
CREATE OR REPLACE FUNCTION public.has_mutual_match(_user1_id uuid, _user2_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.matches m1
    INNER JOIN public.matches m2 
      ON m1.user_id = m2.matched_user_id 
      AND m1.matched_user_id = m2.user_id
    WHERE m1.user_id = _user1_id 
      AND m1.matched_user_id = _user2_id
      AND m1.status = 'pending'
      AND m2.status = 'pending'
  )
$$;

GRANT EXECUTE ON FUNCTION public.has_mutual_match(uuid, uuid) TO authenticated;

-- RLS Policies for messages
CREATE POLICY "Users can view messages they sent or received"
  ON public.messages
  FOR SELECT
  USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

CREATE POLICY "Users can send messages to matched users only"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id 
    AND public.has_mutual_match(auth.uid(), receiver_id)
  );

CREATE POLICY "Users can update their received messages (mark as read)"
  ON public.messages
  FOR UPDATE
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Set replica identity to full for realtime updates
ALTER TABLE public.messages REPLICA IDENTITY FULL;
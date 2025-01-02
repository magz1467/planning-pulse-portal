import { Card } from "@/components/ui/card";
import { CommentForm } from "@/components/comments/CommentForm";
import { Comment } from "@/types/planning";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ApplicationCommentsProps {
  applicationId?: number;
}

export const ApplicationComments = ({ applicationId }: ApplicationCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      if (!applicationId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('Comments')
          .select('*, user:user_id(email)')
          .eq('application_id', applicationId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setComments(data as unknown as Comment[] || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();

    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [applicationId, toast]);

  const handleCommentSubmit = async (content: string) => {
    if (!user || !applicationId) return;

    try {
      const { error } = await supabase
        .from('Comments')
        .insert([
          {
            comment: content,
            user_id: user.id,
            application_id: applicationId
          }
        ]);

      if (error) throw error;

      // Refresh comments
      const { data, error: fetchError } = await supabase
        .from('Comments')
        .select('*, user:user_id(email)')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setComments(data as unknown as Comment[] || []);
      
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4 border-2 border-primary/20 shadow-lg animate-fade-in hover:border-primary/40 transition-colors duration-300">
      <div className="bg-primary/5 -m-4 mb-4 p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg text-primary">Have Your Say</h3>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Share your thoughts on this planning application. Your feedback will be visible to other users.
        </p>
      </div>

      {!user ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-4">Sign in to leave a comment</p>
          <Link to="/auth">
            <Button>
              Sign in to comment
            </Button>
          </Link>
        </div>
      ) : (
        <CommentForm onSubmit={handleCommentSubmit} />
      )}

      <div className="space-y-4 mt-6">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-sm">
                  {(comment.user as any)?.email || 'Anonymous'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm">{comment.comment}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
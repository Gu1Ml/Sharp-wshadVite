import React, { useState } from "react";
import { Heart, MessageCircle, Share2, MoreVertical, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";

export default function PostCard({ post, usuario, currentUser }) {
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(currentUser?.id) || false
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const handleLike = async () => {
    if (!currentUser) return;

    const newLikes = isLiked
      ? post.likes.filter(id => id !== currentUser.id)
      : [...(post.likes || []), currentUser.id];

    setIsLiked(!isLiked);
    setLikesCount(newLikes.length);

    try {
      await base44.entities.Post.update(post.id, { likes: newLikes });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      setIsLiked(isLiked);
      setLikesCount(likesCount);
    }
  };

  const typeColors = {
    texto: "bg-slate-700 text-slate-300",
    codigo: "bg-purple-900/30 text-purple-300 border border-purple-500/30",
    projeto: "bg-blue-900/30 text-blue-300 border border-blue-500/30",
    pergunta: "bg-amber-900/30 text-amber-300 border border-amber-500/30"
  };

  const typeLabels = {
    texto: "Post",
    codigo: "Código",
    projeto: "Projeto",
    pergunta: "Pergunta"
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
            {usuario?.nome?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white">{usuario?.nome || 'Usuário'}</p>
              {post.tipo && (
                <Badge className={typeColors[post.tipo] || typeColors.texto}>
                  {typeLabels[post.tipo] || 'Post'}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-400">
              @{usuario?.username || 'usuario'} • {formatDistanceToNow(new Date(post.created_date), { addSuffix: true, locale: ptBR })}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-slate-400">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Conteúdo */}
      <div className="mb-4">
        <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{post.conteudo}</p>
      </div>

      {/* Imagem */}
      {post.imagem && (
        <div className="mb-4 rounded-xl overflow-hidden border border-slate-800">
          <img 
            src={post.imagem} 
            alt="Post" 
            className="w-full object-cover max-h-96"
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span key={index} className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Ações */}
      <div className="flex items-center gap-1 pt-4 border-t border-slate-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`gap-2 ${isLiked ? 'text-red-400 hover:text-red-300' : 'text-slate-400 hover:text-slate-300'}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-slate-300">
          <MessageCircle className="w-4 h-4" />
          <span>0</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-slate-300">
          <Share2 className="w-4 h-4" />
        </Button>
        <div className="ml-auto text-xs text-slate-500">
          {post.visualizacoes || 0} visualizações
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { PostService } from "@/api/postService";
import { AuthService } from "@/api/authService";
import { UsuarioService } from "@/api/usuarioService";
import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Share2, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import PostCard from "../components/feed/PostCard";
import CreatePostCard from "../components/feed/CreatePostCard";
import TrendingTopics from "../components/feed/TrendingTopics";

export default function Feed() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await AuthService.buscarUsuarioLogado();
        setUser(currentUser);
      } catch (error) {
        console.log("Usuário não autenticado");
      }
    };
    loadUser();
  }, []);
  
  // Mock descontinuado (usando serviço novo)
  // const { data: posts, isLoading } = useQuery({
  //   queryKey: ['posts'],
  //   queryFn: () => PostService.buscarTodos(),
  //   initialData: [],
  // });

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => PostService.buscarTodos(),
  });  

  const { data: usuarios } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => UsuarioService.buscarTodos(),
    initialData: [],
  });

  const getUserById = (id) => {
    return usuarios.find(u => u.id === id);
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Feed</h1>
          </div>
          <p className="text-slate-400">Acompanhe as novidades da comunidade dev</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <CreatePostCard user={user} />

            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))
            ) : posts.length === 0 ? (
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-12 text-center">
                <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum post ainda</h3>
                <p className="text-slate-400 mb-6">Seja o primeiro a compartilhar algo com a comunidade!</p>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" onClick={() => {/* lógica para abrir o modal de criação de post */}}>
                  Criar Primeiro Post
                </Button>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  usuario={getUserById(post.usuarioId)}
                  currentUser={user}
                />
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-6">
            <TrendingTopics />
            
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">Desenvolvedores em Destaque</h3>
              <div className="space-y-4">
                {usuarios.slice(0, 5).map((usuario) => (
                  <div key={usuario.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {usuario.nome?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{usuario.nome}</p>
                      <p className="text-xs text-slate-400 truncate">@{usuario.username}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs border-slate-700" style={{ color: '#FFFFFF' }}>
                      Seguir
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
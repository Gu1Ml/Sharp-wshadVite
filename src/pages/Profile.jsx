import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, 
  Link2, 
  Github, 
  Linkedin, 
  Calendar,
  Settings,
  Star,
  Code2,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "../components/feed/PostCard";
import PortfolioGrid from "../components/profile/PortfolioGrid";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.log("Usuário não autenticado");
      }
    };
    loadUser();
  }, []);

  const { data: usuario } = useQuery({
    queryKey: ['usuario', user?.id],
    queryFn: () => base44.entities.Usuario.filter({ email: user?.email }),
    enabled: !!user,
    select: (data) => data[0]
  });

  const { data: posts } = useQuery({
    queryKey: ['user-posts', usuario?.id],
    queryFn: () => base44.entities.Post.filter({ usuarioId: usuario?.id }, '-created_date'),
    enabled: !!usuario,
    initialData: []
  });

  const { data: portfolios } = useQuery({
    queryKey: ['user-portfolios', usuario?.id],
    queryFn: () => base44.entities.Portfolio.filter({ usuarioId: usuario?.id }, '-created_date'),
    enabled: !!usuario,
    initialData: []
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Você precisa estar logado</p>
          <Button onClick={() => base44.auth.redirectToLogin()}>Fazer Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600" />
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative -mt-20 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-slate-950">
                {usuario?.nome?.[0]?.toUpperCase() || user.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      {usuario?.nome || user.full_name || 'Usuário'}
                    </h1>
                    <p className="text-slate-400">@{usuario?.username || 'usuario'}</p>
                  </div>
                  <Button
                    onClick={() => navigate(createPageUrl("Settings"))}
                    variant="outline"
                    className="border-slate-700 text-white"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bio */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-3">Sobre</h3>
              <p className="text-slate-300 text-sm mb-4">
                {usuario?.bio || "Adicione uma bio para contar mais sobre você"}
              </p>
              
              {usuario?.cargo && (
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <Code2 className="w-4 h-4" />
                  {usuario.cargo}
                </div>
              )}
              
              {usuario?.localizacao && (
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  {usuario.localizacao}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                <Calendar className="w-4 h-4" />
                Entrou em {new Date(user.created_date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{usuario?.seguidores?.length || 0}</div>
                  <div className="text-xs text-slate-400">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{usuario?.seguindo?.length || 0}</div>
                  <div className="text-xs text-slate-400">Seguindo</div>
                </div>
                <div className="text-center" >
                  <div className="text-xl font-bold text-white">{posts.length}</div>
                  <div className="text-xs text-slate-400">Posts</div>
                </div>
              </div>
            </div>

            {/* Links */}
            {(usuario?.githubUsername || usuario?.linkedinUrl || usuario?.portfolioUrl) && (
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-3">Links</h3>
                <div className="space-y-2">
                  {usuario?.githubUsername && (
                    <a href={`https://github.com/${usuario.githubUsername}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                      <Github className="w-4 h-4" />
                      github.com/{usuario.githubUsername}
                    </a>
                  )}
                  {usuario?.linkedinUrl && (
                    <a href={usuario.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  {usuario?.portfolioUrl && (
                    <a href={usuario.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                      <Link2 className="w-4 h-4" />
                      Portfólio
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Tecnologias */}
            {usuario?.tecnologias && usuario.tecnologias.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-3">Tecnologias</h3>
                <div className="flex flex-wrap gap-2">
                  {usuario.tecnologias.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-800 text-slate-300">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2" style={{ color: '#FFFFFF' }}>
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full bg-slate-900/50 border border-slate-800">
                <TabsTrigger value="posts" className="flex-1">Posts ({posts.length})</TabsTrigger>
                <TabsTrigger value="portfolio" className="flex-1">Portfólio ({portfolios.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="mt-6 space-y-6" >
                {posts.length === 0 ? (
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-12 text-center">
                    <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhum post ainda</h3>
                    <p className="text-slate-400">Compartilhe seus conhecimentos com a comunidade</p>
                  </div>
                ) : (
                  posts.map(post => (
                    <PostCard key={post.id} post={post} usuario={usuario} currentUser={user} />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="portfolio" className="mt-6">
                <PortfolioGrid portfolios={portfolios} usuario={usuario} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
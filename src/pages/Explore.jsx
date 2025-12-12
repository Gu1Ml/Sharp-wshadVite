import React, { useState } from "react";
import { PostService } from "@/api/postService";
import { UsuarioService } from "@/api/usuarioService";
import { useQuery } from "@tanstack/react-query";
import { Search, UserPlus, MapPin, Code2, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => UsuarioService.buscarTodos(),
    initialData: [],
  });

  const filteredUsuarios = usuarios.filter(user => 
    user.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.cargo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.tecnologias?.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Explorar</h1>
          </div>
          <p className="text-slate-400">Descubra desenvolvedores incríveis</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, cargo ou tecnologias..."
              className="pl-12 bg-slate-900/50 border-slate-800 text-white h-14 text-lg"
            />
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="w-20 h-20 rounded-full mb-4" />
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))
          ) : filteredUsuarios.length === 0 ? (
            <div className="col-span-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-12 text-center">
              <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum resultado encontrado</h3>
              <p className="text-slate-400">Tente buscar por outros termos</p>
            </div>
          ) : (
            filteredUsuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {usuario.nome?.[0]?.toUpperCase() || 'U'}
                  </div>

                  {/* Informações */}
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {usuario.nome || 'Usuário'}
                  </h3>
                  <p className="text-sm text-slate-400 mb-2">@{usuario.username || 'usuario'}</p>

                  {usuario.cargo && (
                    <div className="flex items-center gap-1 text-sm text-slate-400 mb-3">
                      <Code2 className="w-3 h-3" />
                      {usuario.cargo}
                    </div>
                  )}

                  {usuario.localizacao && (
                    <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
                      <MapPin className="w-3 h-3" />
                      {usuario.localizacao}
                    </div>
                  )}

                  {/* Bio */}
                  {usuario.bio && (
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {usuario.bio}
                    </p>
                  )}

                  {/* Tecnologias */}
                  {usuario.tecnologias && usuario.tecnologias.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {usuario.tecnologias.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-slate-800 text-slate-300">
                          {tech}
                        </Badge>
                      ))}
                      {usuario.tecnologias.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-slate-800 text-slate-300">
                          +{usuario.tecnologias.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Estatísticas */}
                  <div className="flex gap-4 mb-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-white">{usuario.seguidores?.length || 0}</div>
                      <div className="text-xs text-slate-400">Seguidores</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-white">{usuario.seguindo?.length || 0}</div>
                      <div className="text-xs text-slate-400">Seguindo</div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-700 text-slate-300"
                    >
                      Ver Perfil
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600" style={{ color: '#FFFFFF' }}>
                      <UserPlus className="w-4 h-4 mr-1" />
                      Seguir
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
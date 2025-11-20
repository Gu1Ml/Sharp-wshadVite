import React from "react";
import { ExternalLink, Github, Star, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PortfolioGrid({ portfolios, usuario }) {
  if (portfolios.length === 0) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-12 text-center">
        <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Nenhum projeto ainda</h3>
        <p className="text-slate-400 mb-6">Adicione seus projetos para mostrar seu trabalho</p>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          Adicionar Projeto
        </Button>
      </div>
    );
  }

  const statusColors = {
    em_desenvolvimento: "bg-yellow-900/30 text-yellow-300 border border-yellow-500/30",
    concluido: "bg-green-900/30 text-green-300 border border-green-500/30",
    arquivado: "bg-slate-700 text-slate-300"
  };

  const statusLabels = {
    em_desenvolvimento: "Em Desenvolvimento",
    concluido: "Concluído",
    arquivado: "Arquivado"
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {portfolios.map((projeto) => (
        <div
          key={projeto.id}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group"
        >
          {/* Image */}
          {projeto.imagem ? (
            <div className="aspect-video overflow-hidden bg-slate-800">
              <img
                src={projeto.imagem}
                alt={projeto.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
              <Code2 className="w-16 h-16 text-slate-600" />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                {projeto.titulo}
              </h3>
              {projeto.destaque && (
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              )}
            </div>

            <p className="text-sm text-slate-400 mb-4 line-clamp-2">
              {projeto.descricao}
            </p>

            {/* Status */}
            <div className="mb-4">
              <Badge className={statusColors[projeto.status]}>
                {statusLabels[projeto.status]}
              </Badge>
            </div>

            {/* Tecnologias */}
            {projeto.tecnologias && projeto.tecnologias.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {projeto.tecnologias.slice(0, 4).map((tech, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
                {projeto.tecnologias.length > 4 && (
                  <span className="text-xs px-2 py-1 text-slate-500">
                    +{projeto.tecnologias.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Links */}
            <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
              {projeto.linkGitHub && (
                <a
                  href={projeto.linkGitHub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}
              {projeto.linkDemo && (
                <a
                  href={projeto.linkDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors ml-auto"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Demo</span>
                </a>
              )}
              {projeto.stars > 0 && (
                <div className="flex items-center gap-1 text-sm text-slate-400 ml-auto">
                  <Star className="w-4 h-4" />
                  {projeto.stars}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
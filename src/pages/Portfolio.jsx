import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Code2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortfolioGrid from "../components/profile/PortfolioGrid";
import CreateProjectDialog from "../components/portfolio/CreateProjectDialog";

export default function Portfolio() {
  const [user, setUser] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

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

  const { data: portfolios = [] } = useQuery({
    queryKey: ['portfolios', usuario?.id, filterStatus],
    queryFn: () => {
      if (filterStatus === "all") {
        return base44.entities.Portfolio.filter({ usuarioId: usuario?.id }, '-created_date');
      }
      return base44.entities.Portfolio.filter({ 
        usuarioId: usuario?.id, 
        status: filterStatus 
      }, '-created_date');
    },
    enabled: !!usuario,
    initialData: []
  });

  const destaques = portfolios.filter(p => p.destaque);
  const outros = portfolios.filter(p => !p.destaque);

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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Code2 className="w-6 h-6 text-purple-400" />
                <h1 className="text-3xl font-bold text-white">Meu Portfólio</h1>
              </div>
              <p className="text-slate-400">Mostre seus projetos para o mundo</p>
            </div>
            <Button
              onClick={() => setCreateDialogOpen(true)} style={{ color: '#FFFFFF' }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </div>

          {/* Filtros */}
          <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full">
            <TabsList className="bg-slate-900/50 border border-slate-800" style={{ color: '#FFFFFF' }}>
              <TabsTrigger value="all" className="transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:text-black hover:shadow-lg hover:shadow-primary/30 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30">Todos ({portfolios.length})</TabsTrigger>
              <TabsTrigger value="concluido" className="transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:text-black hover:shadow-lg hover:shadow-primary/30 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30">Concluídos</TabsTrigger>
              <TabsTrigger value="em_desenvolvimento" className="transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:text-black hover:shadow-lg hover:shadow-primary/30 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30">Em Desenvolvimento</TabsTrigger>
              <TabsTrigger value="arquivado" className="transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:text-black hover:shadow-lg hover:shadow-primary/30 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30">Arquivados</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Em Destaque */}
        {destaques.length > 0 && filterStatus === "all" && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              ⭐ Projetos em Destaque
            </h2>
            <PortfolioGrid portfolios={destaques} usuario={usuario} />
          </div>
        )}

        {/* Todos os Projetos */}
        {outros.length > 0 && (
          <div>
            {destaques.length > 0 && filterStatus === "all" && (
              <h2 className="text-xl font-semibold text-white mb-4">Outros Projetos</h2>
            )}
            <PortfolioGrid portfolios={filterStatus === "all" ? outros : portfolios} usuario={usuario} />
          </div>
        )}

        {portfolios.length === 0 && (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-12 text-center">
            <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum projeto ainda</h3>
            <p className="text-slate-400 mb-6">Comece adicionando seus primeiros projetos</p>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600" style={{ color: '#FFFFFF' }}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Criar Primeiro Projeto
            </Button>
          </div>
        )}

        <CreateProjectDialog 
          open={createDialogOpen} 
          onOpenChange={setCreateDialogOpen}
          usuarioId={usuario?.id}
        />
      </div>
    </div>
  );
}
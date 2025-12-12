import React, { useState, useEffect } from "react";
import { AuthService } from "@/api/authService";
import { UsuarioService } from "@/api/usuarioService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, User, Link2, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Settings() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

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

  const { data: usuario } = useQuery({
    queryKey: ['usuario', user?.id],
    queryFn: async () => {
      const list = await UsuarioService.buscarTodos();
      return list.filter(u => u.email === user?.email);
    },
    enabled: !!user,
    select: (data) => data[0]
  });

  const [formData, setFormData] = useState({
    nome: "",
    username: "",
    bio: "",
    cargo: "",
    localizacao: "",
    githubUsername: "",
    linkedinUrl: "",
    portfolioUrl: "",
    tecnologias: ""
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome || "",
        username: usuario.username || "",
        bio: usuario.bio || "",
        cargo: usuario.cargo || "",
        localizacao: usuario.localizacao || "",
        githubUsername: usuario.githubUsername || "",
        linkedinUrl: usuario.linkedinUrl || "",
        portfolioUrl: usuario.portfolioUrl || "",
        tecnologias: usuario.tecnologias?.join(', ') || ""
      });
    }
  }, [usuario]);

  const updateMutation = useMutation({
    mutationFn: (data) => {
      return UsuarioService.atualizarPerfil({ ...data, id: usuario?.id, email: user.email });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuario'] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar perfil");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      ...formData,
      tecnologias: formData.tecnologias.split(',').map(t => t.trim()).filter(t => t)
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Você precisa estar logado</p>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" onClick={() => AuthService.redirectToLogin()}>Fazer Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-slate-400">Gerencie suas informações de perfil</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full bg-slate-900/50 border border-slate-800 mb-6" style={{ color: '#FFFFFF' }}>
              <TabsTrigger value="profile" className="flex-1 transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:text-black hover:shadow-lg hover:shadow-primary/30 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="links" className="flex-1 transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:text-black hover:shadow-lg hover:shadow-primary/30 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30">
                <Link2 className="w-4 h-4 mr-2" />
                Links
              </TabsTrigger>
              <TabsTrigger value="tech" className="flex-1 transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:text-black hover:shadow-lg hover:shadow-primary/30 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30">
                <Code2 className="w-4 h-4 mr-2" />
                Tecnologias
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Informações Básicas</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Nome Completo</Label>
                    <Input
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Seu nome completo"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Username</Label>
                    <Input
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="seu_username"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Bio</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Conte um pouco sobre você..."
                      className="bg-slate-800 border-slate-700 text-white min-h-24 resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Cargo/Título</Label>
                    <Input
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      placeholder="Ex: Desenvolvedor Full Stack"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Localização</Label>
                    <Input
                      value={formData.localizacao}
                      onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                      placeholder="Ex: São Paulo, Brasil"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="links" className="space-y-6">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Links e Redes Sociais</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">GitHub Username</Label>
                    <Input
                      value={formData.githubUsername}
                      onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                      placeholder="seu_usuario"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">LinkedIn</Label>
                    <Input
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Portfólio Pessoal</Label>
                    <Input
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      placeholder="https://seusite.com"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tech" className="space-y-6">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Habilidades Técnicas</h3>
                
                <div>
                  <Label className="text-slate-300">Tecnologias (separadas por vírgula)</Label>
                  <Textarea
                    value={formData.tecnologias}
                    onChange={(e) => setFormData({ ...formData, tecnologias: e.target.value })}
                    placeholder="React, Node.js, TypeScript, MongoDB, Docker..."
                    className="bg-slate-800 border-slate-700 text-white min-h-32 resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Digite as tecnologias que você domina, separadas por vírgula
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              className="border-slate-700 text-slate-300"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" style={{ color: '#FFFFFF' }}
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
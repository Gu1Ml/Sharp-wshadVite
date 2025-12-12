import React, { useState } from "react";
import { PortfolioService } from "@/api/portfolioService";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function CreateProjectDialog({ open, onOpenChange, usuarioId }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    linkGitHub: "",
    linkDemo: "",
    tecnologias: "",
    status: "em_desenvolvimento",
    destaque: false
  });

  const createMutation = useMutation({
    mutationFn: (data) => PortfolioService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      onOpenChange(false);
      setFormData({
        titulo: "",
        descricao: "",
        linkGitHub: "",
        linkDemo: "",
        tecnologias: "",
        status: "em_desenvolvimento",
        destaque: false
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !usuarioId) return;

    createMutation.mutate({
      ...formData,
      usuarioId,
      tecnologias: formData.tecnologias.split(',').map(t => t.trim()).filter(t => t),
      stars: 0
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Adicionar Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label className="text-slate-300">Título do Projeto *</Label>
            <Input
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Sistema de E-commerce"
              className="bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div>
            <Label className="text-slate-300">Descrição *</Label>
            <Textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva o que seu projeto faz..."
              className="bg-slate-800 border-slate-700 text-white min-h-24 resize-none"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Link do GitHub</Label>
              <Input
                value={formData.linkGitHub}
                onChange={(e) => setFormData({ ...formData, linkGitHub: e.target.value })}
                placeholder="https://github.com/..."
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-300">Link da Demo</Label>
              <Input
                value={formData.linkDemo}
                onChange={(e) => setFormData({ ...formData, linkDemo: e.target.value })}
                placeholder="https://..."
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-slate-300">Tecnologias (separadas por vírgula)</Label>
            <Input
              value={formData.tecnologias}
              onChange={(e) => setFormData({ ...formData, tecnologias: e.target.value })}
              placeholder="React, Node.js, MongoDB"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-300">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="em_desenvolvimento">Em Desenvolvimento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div>
              <Label className="text-slate-300">Projeto em Destaque</Label>
              <p className="text-xs text-slate-500">Aparecerá no topo do seu portfólio</p>
            </div>
            <Switch
              checked={formData.destaque}
              onCheckedChange={(checked) => setFormData({ ...formData, destaque: checked })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {createMutation.isPending ? "Salvando..." : "Salvar Projeto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState } from "react";
import { Image, Code2, Lightbulb, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostService } from "@/api/postService";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreatePostCard({ user, forceOpen = false, onClose }) {
  const [open, setOpen] = useState(false);
  const [conteudo, setConteudo] = useState("");
  const [tipo, setTipo] = useState("texto");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

    // Estado do Dialog:
  const dialogOpen = forceOpen ? true : open;

  const handleDialogChange = (isOpen) => {
    if (!forceOpen) setOpen(isOpen);

    // Se for modal na página NewPost e fechar → chamar onClose
    if (!isOpen && onClose) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!conteudo.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await base44.entities.Post.create({
        usuarioId: user.id,
        conteudo,
        tipo,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        likes: [],
        visualizacoes: 0
      });
      
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setConteudo("");
      setTags("");
      setTipo("texto");
      setOpen(false);
    } catch (error) {
      console.error("Erro ao criar post:", error);
    }
    setIsSubmitting(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-slate-700 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
              {user.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 bg-slate-800/50 rounded-xl px-4 py-3 text-slate-400 cursor-text transition-all duration-200 hover:scale-[1.03] hover:text-white hover:shadow-lg hover:shadow-primary/30">
              Compartilhe algo com a comunidade...
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
            <Button variant="ghost" size="sm" className="gap-2 text-slate-400 transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:text-black hover:shadow-lg hover:shadow-primary/30">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Imagem</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-slate-400 transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:text-black hover:shadow-lg hover:shadow-primary/30">
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline">Código</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-slate-400 transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:text-black hover:shadow-lg hover:shadow-primary/30">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Pergunta</span>
            </Button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Criar Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-slate-300">Tipo de Post</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700" style={{ color: '#FFFFFF' }}>
                <SelectItem value="texto">📝 Post Normal</SelectItem>
                <SelectItem value="codigo">💻 Compartilhar Código</SelectItem>
                <SelectItem value="projeto">🚀 Mostrar Projeto</SelectItem>
                <SelectItem value="pergunta">❓ Fazer Pergunta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300">Conteúdo</Label>
            <Textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="O que você está pensando?"
              className="bg-slate-800 border-slate-700 text-white min-h-32 resize-none"
            />
          </div>

          <div>
            <Label className="text-slate-300">Tags (separadas por vírgula)</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, javascript, webdev"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-700">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!conteudo.trim() || isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isSubmitting ? "Publicando..." : "Publicar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
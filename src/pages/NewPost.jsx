import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog"; 
import CreatePostCard from "../components/feed/CreatePostCard";

export default function NewPost() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  // Quando o modal fechar, retornar ao feed
    const handleClose = () => {
    setOpen(false);
    navigate("/feed");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
        <h1 className="text-3xl font-bold text-white">Criar Post</h1>
        <CreatePostCard 
          user={{ id: 1, full_name: "Usuário" }} 
          forceOpen={true} 
          onClose={handleClose} 
        />

      </DialogContent>
    </Dialog>
  );
}

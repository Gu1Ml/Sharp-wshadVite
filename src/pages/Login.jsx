import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [emailOuApelido, setEmailOuApelido] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOuApelido || !senha) {
      alert("Preencha email/apelido e senha");
      return;
    }
    setLoading(true);
    try {
      const response = await login(emailOuApelido, senha);
      const sucesso = response?.Sucesso ?? response?.sucesso ?? false;
      if (sucesso) {
        navigate("/");
      } else {
        alert(response?.Mensagem || response?.mensagem || "Credenciais inválidas");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Erro no login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-slate-900 rounded-lg border border-slate-800 ">
        <h2 className="text-xl font-bold text-white mb-4">Entrar</h2>
        <div className="text-white mb-4">
          <Label>Email ou Apelido</Label>
          <Input value={emailOuApelido} onChange={(e) => setEmailOuApelido(e.target.value)} />
        </div>
        <div className="text-white mb-4">
          <Label>Senha</Label>
          <Input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>
        <div className="flex gap-2 justify-end text-white">
          <Button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}

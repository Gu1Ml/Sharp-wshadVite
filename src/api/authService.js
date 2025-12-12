// src/api/authService.js
import * as api from "./api";

function unwrap(ret) {
  if (!ret) return null;
  if (ret.Erro) {
    const e = new Error(ret.Erro);
    e.payload = ret;
    throw e;
  }
  return ret.Dados ?? ret;
}

export const AuthService = {
  async buscarUsuarioLogado() {
    const ret = await api.get("/Autenticacao/BuscarUsuarioLogado");
    return unwrap(ret);
  },

  async registrar(payload) {
    const ret = await api.post("/Autenticacao/Registrar", payload);
    return unwrap(ret);
  },

  async logar(queryParams) {
    const qs = new URLSearchParams(queryParams).toString();
    const ret = await api.get(`/Autenticacao/Logar?${qs}`);
    return unwrap(ret);
  },

  async deslogar() {
    const ret = await api.get("/Autenticacao/Deslogar");
    return unwrap(ret);
  },

  // GitHub endpoints se necessários:
  async githubLogin() {
    return api.get("/AutenticacaoGitHub/LogarComGitHub");
  },

  async githubCallback() {
    return api.get("/AutenticacaoGitHub/RetornoLoginGitHub");
  }
  ,
  redirectToLogin() {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5085";
    window.location.href = `${API_URL}/Autenticacao/Logar`;
  }
};

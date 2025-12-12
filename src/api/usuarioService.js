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

export const UsuarioService = {
  async buscarTodos() {
    const ret = await api.get("/Usuario/BuscarTodos");
    return unwrap(ret);
  },

  async buscarPorApelido(apelido) {
    const ret = await api.get(`/Usuario/BuscarPorApelido?apelido=${encodeURIComponent(apelido)}`);
    return unwrap(ret);
  },

  // se seu backend tiver update perfil
  async atualizarPerfil(dados) {
    const ret = await api.post("/Usuario/Atualizar", dados); // adapte se for PUT
    return unwrap(ret);
  }
};

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

export const PortfolioService = {
  async listarPorUsuario(usuarioId) {
    // se backend tiver filtro por usuario
    const ret = await api.get(`/Portfolio/BuscarPorUsuario?usuarioId=${encodeURIComponent(usuarioId)}`);
    return unwrap(ret);
  },

  async criar(data) {
    const ret = await api.post("/Portfolio/Criar", data);
    return unwrap(ret);
  },

  async atualizar(id, data) {
    const ret = await api.put(`/Portfolio/${id}`, data);
    return unwrap(ret);
  },

  async excluir(id) {
    const ret = await api.del(`/Portfolio/${id}`);
    return unwrap(ret);
  }
};

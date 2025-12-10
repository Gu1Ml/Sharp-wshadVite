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

export const ComentarioService = {
  async listar() {
    const ret = await api.get("/Comentario/BuscarTodos"); // ajuste se necessário
    return unwrap(ret);
  },

  async criar(data) {
    const ret = await api.post("/Comentario/Criar", data);
    return unwrap(ret);
  },

  async excluir(id) {
    const ret = await api.del(`/Comentario/${id}`);
    return unwrap(ret);
  }
};

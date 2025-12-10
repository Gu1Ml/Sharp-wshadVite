import * as api from "./api";

/**
 * Extraímos Dados e checamos Erro.
 */

function unwrap(ret) {
  // ret pode ser null (se 204) ou { Dados, Erro }
  if (!ret) return null;
  if (ret.Erro) {
    const e = new Error(ret.Erro);
    e.payload = ret;
    throw e;
  }
  return ret.Dados ?? ret;
}

export const PostService = {
  async buscarTodos() {
    const ret = await api.get("/Post/BuscarTodos");
    // Post/BuscarTodos provavelmente retorna { Dados: [...] }
    return unwrap(ret);
  },

  async buscarPorId(id) {
    const ret = await api.get(`/Post/BuscarPorId?id=${encodeURIComponent(id)}`);
    return unwrap(ret);
  },

  async postar({ titulo, texto }) {
    // note que seu PostController Postar recebe (string titulo, string texto)
    const ret = await api.post("/Post/Postar", { titulo, texto });
    // seu controller retorna Ok(idRetornoAPI) — pode retornar diretamente id
    // se o backend estiver retornando RetornoAPI<int?>, unwrap
    try {
      return unwrap(ret);
    } catch (e) {
      // se não for o formato RetornoAPI, talvez ret seja o id direto
      if (typeof ret === "number" || typeof ret === "string") return ret;
      throw e;
    }
  },

  async atualizar(id, data) {
    const ret = await api.put(`/Post/${id}`, data);
    return unwrap(ret);
  },

  async excluir(id) {
    const ret = await api.del(`/Post/${id}`);
    return unwrap(ret);
  }
};

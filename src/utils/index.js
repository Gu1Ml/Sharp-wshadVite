/**
 * Utility helpers used across the app.
 * Small, dependency-free helpers for query strings, paging, formatting, debounce, etc.
 */

/**
 * Constroi uma string de consulta a partir de um objeto de parâmetros.
 * - Os arrays são concatenados várias vezes (chave=val1&chave=val2)
 * - objetos são convertidos para JSON
 */
export function buildQueryString(params = {}) {
	const usp = new URLSearchParams();
	Object.entries(params).forEach(([k, v]) => {
		if (v == null) return;
		if (Array.isArray(v)) {
			v.forEach((val) => usp.append(k, String(val)));
		} else if (typeof v === 'object') {
			usp.append(k, JSON.stringify(v));
		} else {
			usp.append(k, String(v));
		}
	});
	const s = usp.toString();
	return s ? `?${s}` : '';
}

/**
 * Analisa uma string de consulta e a transforma em um objeto. Chaves repetidas se tornam arrays.
 */
export function parseQueryString(queryString = '') {
	if (!queryString && typeof window !== 'undefined') {
		queryString = window.location.search || '';
	}
	if (queryString.startsWith('?')) queryString = queryString.slice(1);
	const usp = new URLSearchParams(queryString);
	const out = {};
	for (const [k, v] of usp.entries()) {
		if (Object.prototype.hasOwnProperty.call(out, k)) {
			if (!Array.isArray(out[k])) out[k] = [out[k]];
			out[k].push(v);
		} else {
			out[k] = v;
		}
	}
	return out;
}

/**
 * Cria uma URL de página combinando um caminho base e parâmetros comuns de paginação.
 * Exemplo: createPageUrl('/feed', 2, 20, { q: 'react' }) => '/feed?page=2&pageSize=20&q=react'
 */
export function createPageUrl(base = '/', page, pageSize, extra = {}) {
  // normaliza base para começar com '/'
  if (!base.startsWith('/')) base = '/' + base;

  // Só adiciona params se algum for passado
  const params = {};
  if (page !== undefined) params.page = page;
  if (pageSize !== undefined) params.pageSize = pageSize;
  Object.assign(params, extra);

  const qs = buildQueryString(params);
  const [path] = base.split('?');
  return path + qs;
}

/**
 * Formatar uma data (aceita Date ou string/número). Retorna string vazia para data inválida.
 */
export function formatDate(input, options = {}) {
	if (!input) return '';
	const d = input instanceof Date ? input : new Date(input);
	if (Number.isNaN(d.getTime())) return '';
	return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', ...options });
}

/**
 * Truncar um texto longo adicionando reticências.
 */
export function truncateText(text = '', max = 100) {
	if (text == null) return '';
	const s = String(text);
	return s.length <= max ? s : s.slice(0, max).trimEnd() + '…';
}

/**
 * Limita o número entre o mínimo e o máximo.
 */
export function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

/**
 * Helper simples para debounce.
 */
export function debounce(fn, wait = 200) {
	let t;
	return function debounced(...args) {
		const ctx = this;
		clearTimeout(t);
		t = setTimeout(() => fn.apply(ctx, args), wait);
	};
}

/**
 * Retorna a URL do avatar para um objeto de usuário ou um simples marcador de posição.
 */
export function getAvatarUrl(user = {}, size = 64) {
	if (user && user.avatarUrl) return user.avatarUrl;
	const name = (user && (user.name || user.username)) ? encodeURIComponent(user.name || user.username) : 'User';
	return `https://ui-avatars.com/api/?name=${name}&size=${size}&background=cccccc&color=555555`;
}

export default {
	buildQueryString,
	parseQueryString,
	createPageUrl,
	formatDate,
	truncateText,
	clamp,
	debounce,
	getAvatarUrl,
};


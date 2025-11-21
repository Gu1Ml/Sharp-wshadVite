/**
 * Utility helpers used across the app.
 * Small, dependency-free helpers for query strings, paging, formatting, debounce, etc.
 */

/**
 * Build a query string from a params object.
 * - arrays are appended multiple times (key=val1&key=val2)
 * - objects are JSON-stringified
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
 * Parse a query string into an object. Repeated keys become arrays.
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
 * Create a page URL by combining a base path and common pagination params.
 * Example: createPageUrl('/feed', 2, 20, { q: 'react' }) => '/feed?page=2&pageSize=20&q=react'
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
 * Format a date (accepts Date or string/number). Returns empty string for invalid date.
 */
export function formatDate(input, options = {}) {
	if (!input) return '';
	const d = input instanceof Date ? input : new Date(input);
	if (Number.isNaN(d.getTime())) return '';
	return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', ...options });
}

/**
 * Truncate a long text adding an ellipsis.
 */
export function truncateText(text = '', max = 100) {
	if (text == null) return '';
	const s = String(text);
	return s.length <= max ? s : s.slice(0, max).trimEnd() + '…';
}

/**
 * Clamp number between min and max.
 */
export function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

/**
 * Simple debounce helper.
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
 * Return avatar URL for a user object or a simple placeholder.
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


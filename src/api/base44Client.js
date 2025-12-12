/*
 Implementação simulada do SDK Base44 para desenvolvimento local.

 Uso:
 import { base44 } from '../api/base44Client';
 await base44.auth.me();
 await base44.entities.Post.list();

 This file provides in-memory arrays para Usuario, Post, Portfolio e Comentario
 and basic CRUD/filter/list operations. It's intentionally simple and dependency-free.
*/

const nowISO = () => new Date().toISOString();
const genId = (prefix = 'id') => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;

// --- Dados simulados (Mocks) ---
const mockUsers = [
	{
		id: 'usuario_1',
		email: 'motogui28@gmail.com',
		username: 'Guilherme',
		name: 'Guilherme Machado',
		bio: 'Frontend developer and designer',
		avatarUrl: '',
		created_date: nowISO(),
		updated_date: nowISO(),
	},
	{
		id: 'usuario_2',
		email: 'lais@gmail.com',
		username: 'Lais',
		name: 'Lais Gonçalves',
		bio: 'Fullstack engineer',
		avatarUrl: '',
		created_date: nowISO(),
		updated_date: nowISO(),
	},
	{
		id: 'usuario_3',
		email: 'Maikao@gmail.com',
		username: 'Michael',
		name: 'Michael Silva',
		bio: 'Product Manager',
		avatarUrl: '',
		created_date: nowISO(),
		updated_date: nowISO(),
	},
];

const mockPortfolios = [
	{
		id: 'portfolio_1',
		usuarioId: mockUsers[0].id,
		title: 'Landing page for Brand X',
		description: 'A marketing landing for Brand X built with React + Vite',
		status: 'published',
		created_date: nowISO(),
		updated_date: nowISO(),
	},
];

const mockPosts = [
	{
		id: 'post_1',
		usuarioId: mockUsers[0].id,
		conteudo: 'Olá! Este post é um exemplo.',
		media: [],
		created_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
		updated_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
	},
	{
		id: 'post_2',
		usuarioId: mockUsers[1].id,
		conteudo: 'Construindo coisas legais com TypeScript e Vite!',
		media: [],
		created_date: new Date().toISOString(),
		updated_date: new Date().toISOString(),
	},
];

const mockComentarios = [
	{
		id: 'comment_1',
		postId: mockPosts[0].id,
		usuarioId: mockUsers[1].id,
		conteudo: 'Bacana! Gostei do layout.',
		created_date: nowISO(),
	},
];

// ID do usuário conectado atualmente (para auth.me/updateMe)
let currentUserId = mockUsers[0].id;

// Auxiliar: objeto de correspondência superficial (consulta) com o alvo
const matches = (target = {}, query = {}) => {
	return Object.entries(query).every(([k, v]) => {
		if (v == null) return true;
		if (Array.isArray(v)) return v.includes(target[k]);
		if (typeof v === 'object') return JSON.stringify(target[k]) === JSON.stringify(v);
		return String(target[k]) === String(v);
	});
};

// Pequeno atraso artificial para simular operações assíncronas (pode ser ativado/desativado)
const simulate = async (result, ms = 0) => {
	if (ms > 0) await new Promise((r) => setTimeout(r, ms));
	return result;
};

export const base44 = {
	auth: {
		me: async () => simulate(mockUsers.find((u) => u.id === currentUserId) || null, 50),
		logout: async () => {
			// Para o mock, apenas limpamos currentUserId
			currentUserId = null;
			// retorna uma promessa resolvida para imitar o SDK
			return simulate(true, 20);
		},
		redirectToLogin: () => {
			// Em desenvolvimento, você pode substituir isso para realmente navegar
			// Por enquanto, apenas registramos para que os componentes possam estar cientes
			// eslint-disable-next-line no-console
			console.log('[base44 mock] redirectToLogin chamado');
		},
		isAuthenticated: async () => simulate(Boolean(currentUserId), 10),
		updateMe: async (data = {}) => {
			const idx = mockUsers.findIndex((u) => u.id === currentUserId);
			if (idx === -1) return null;
			Object.assign(mockUsers[idx], data, { updated_date: nowISO() });
			return simulate(mockUsers[idx], 30);
		},
	},

	entities: {
		Usuario: {
			list: async () => simulate([...mockUsers], 10),
			filter: async (query = {}) => simulate(mockUsers.filter((u) => matches(u, query)), 10),
			create: async (data = {}) => {
				const newUser = {
					id: genId('user'),
					created_date: nowISO(),
					updated_date: nowISO(),
					...data,
				};
				mockUsers.push(newUser);
				return simulate(newUser, 30);
			},
			update: async (id, data = {}) => {
				const idx = mockUsers.findIndex((u) => u.id === id);
				if (idx === -1) return simulate(null, 10);
				Object.assign(mockUsers[idx], data, { updated_date: nowISO() });
				return simulate(mockUsers[idx], 30);
			},
			delete: async (id) => {
				const idx = mockUsers.findIndex((u) => u.id === id);
				if (idx === -1) return simulate(false, 10);
				mockUsers.splice(idx, 1);
				// if deleted current user, clear session
				if (currentUserId === id) currentUserId = null;
				return simulate(true, 20);
			},
		},

		Post: {
			list: async ({ sort } = {}) => {
				const posts = [...mockPosts];
				if (sort === '-created_date') {
					posts.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
				}
				return simulate(posts, 20);
			},
			filter: async (query = {}) => simulate(mockPosts.filter((p) => matches(p, query)), 20),
			create: async (data = {}) => {
				const newPost = {
					id: genId('post'),
					created_date: nowISO(),
					updated_date: nowISO(),
					media: [],
					...data,
				};
				// add to front so newest appears first
				mockPosts.unshift(newPost);
				return simulate(newPost, 30);
			},
			update: async (id, data = {}) => {
				const idx = mockPosts.findIndex((p) => p.id === id);
				if (idx === -1) return simulate(null, 10);
				Object.assign(mockPosts[idx], data, { updated_date: nowISO() });
				return simulate(mockPosts[idx], 20);
			},
			delete: async (id) => {
				const idx = mockPosts.findIndex((p) => p.id === id);
				if (idx === -1) return simulate(false, 10);
				mockPosts.splice(idx, 1);
				return simulate(true, 20);
			},
		},

		Portfolio: {
			list: async ({ sort } = {}) => simulate([...mockPortfolios], 15),
			filter: async (query = {}) => simulate(mockPortfolios.filter((p) => matches(p, query)), 15),
			create: async (data = {}) => {
				const newPortfolio = {
					id: genId('portfolio'),
					created_date: nowISO(),
					updated_date: nowISO(),
					...data,
				};
				mockPortfolios.push(newPortfolio);
				return simulate(newPortfolio, 25);
			},
			update: async (id, data = {}) => {
				const idx = mockPortfolios.findIndex((p) => p.id === id);
				if (idx === -1) return simulate(null, 10);
				Object.assign(mockPortfolios[idx], data, { updated_date: nowISO() });
				return simulate(mockPortfolios[idx], 20);
			},
			delete: async (id) => {
				const idx = mockPortfolios.findIndex((p) => p.id === id);
				if (idx === -1) return simulate(false, 10);
				mockPortfolios.splice(idx, 1);
				return simulate(true, 20);
			},
		},

		Comentario: {
			list: async () => simulate([...mockComentarios], 10),
			filter: async (query = {}) => simulate(mockComentarios.filter((c) => matches(c, query)), 10),
			create: async (data = {}) => {
				const newComment = {
					id: genId('comment'),
					created_date: nowISO(),
					...data,
				};
				mockComentarios.push(newComment);
				return simulate(newComment, 15);
			},
			delete: async (id) => {
				const idx = mockComentarios.findIndex((c) => c.id === id);
				if (idx === -1) return simulate(false, 10);
				mockComentarios.splice(idx, 1);
				return simulate(true, 10);
			},
		},
	},

	integrations: {
		Core: {
			UploadFile: async ({ file } = {}) => {
				// For the mock, just return a fake url
				if (!file) return simulate({ error: 'no file provided' }, 20);
				const fileName = typeof file === 'string' ? file : file.name || genId('file');
				return simulate({ file_url: `https://mock.cdn.local/${encodeURIComponent(fileName)}` }, 50);
			},
		},
	},
};

export default base44;

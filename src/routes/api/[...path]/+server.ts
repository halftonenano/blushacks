import { vectorInsert, vectorQuery } from '$lib/server/cloudflare/vectorize.js';
import { generateEmbedding } from '$lib/server/openai.js';
import { Elysia, t } from 'elysia';

const app = new Elysia({ prefix: '/api' })
	.get(
		'/vector/query',
		async ({ query: { query } }) => {
			const vector = await generateEmbedding(query);
			return await vectorQuery(query);
		},
		{ query: t.Object({ query: t.String() }) }
	)
	.post(
		'/vector/submit',
		async ({ body }) => {
			console.log('you should be seeing this');
			try {
				const res = await vectorInsert(body.symptoms, body);
				return res;
			} catch (err) {
				console.error(err.error);
			}
		},
		{ body: t.Object({ symptoms: t.String(), whatWorked: t.String() }) }
	);

export const GET = ({ request }) => app.handle(request);
export const POST = ({ request }) => app.handle(request);

export type App = typeof app;

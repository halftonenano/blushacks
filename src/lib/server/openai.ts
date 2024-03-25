import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

export const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export async function generateEmbedding(input: string) {
	const res = await openai.embeddings.create({
		input,
		model: 'text-embedding-3-large',
		dimensions: 1024
	});

	return res.data[0].embedding;
}

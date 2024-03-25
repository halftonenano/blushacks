import {
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_API_TOKEN,
	VECTORIZE_INDEX_NAME
} from '$env/static/private';
import { nanoid } from 'nanoid/non-secure';
import { cloudflare } from '.';
import { generateEmbedding } from '../openai';

export async function getIndexes() {
	return await cloudflare.vectorize.indexes.list(CLOUDFLARE_ACCOUNT_ID);
}

export async function vectorQuery(query: string) {
	return await cloudflare.vectorize.indexes.query(CLOUDFLARE_ACCOUNT_ID, VECTORIZE_INDEX_NAME, {
		vector: await generateEmbedding(query),
		returnMetadata: true
	});
}

export async function vectorInsert(text: string, metadata: any) {
	const data = {
		id: nanoid(),
		values: await generateEmbedding(text),
		metadata
	};

	const res = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/vectorize/indexes/${VECTORIZE_INDEX_NAME}/insert`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
				'Content-Type': 'application/x-ndjson'
			},
			body: JSON.stringify(data)
		}
	);

	console.log(res);

	return res;
}

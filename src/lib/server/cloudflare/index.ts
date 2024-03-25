import { CLOUDFLARE_API_TOKEN } from '$env/static/private';
import Cloudflare from 'cloudflare';

export const cloudflare = new Cloudflare({
	apiToken: CLOUDFLARE_API_TOKEN
});

export async function getIndexes() {
	return await cloudflare.vectorize.indexes.list('8763d9280e32bf5a911c767c434e2980');
}

import { cloudflare, getIndexes } from '$lib/server/cloudflare/index';

export async function load() {
  return {data: await getIndexes()}
}

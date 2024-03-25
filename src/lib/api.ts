import { treaty } from '@elysiajs/eden';
import type { App } from '../routes/api/[...path]/+server';
import { PUBLIC_URL } from '$env/static/public';

export const client = treaty<App>(PUBLIC_URL);

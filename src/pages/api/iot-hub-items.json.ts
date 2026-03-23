import type { APIRoute } from 'astro';
import { fetchCardItems } from '~/data/iot-hub/api';
import { TEMPLATE_TYPES } from '~/data/iot-hub/constants';
import type { TemplateType } from '~/data/iot-hub/types';

/**
 * Pre-renders a single JSON with all types.
 * Each type is a key; the client reads only the one it needs.
 *
 * With ~50 items per type this is ~40KB gzipped. If data grows to 1000+
 * items per type, split into per-type endpoints with `prerender = false`.
 */
export const GET: APIRoute = async () => {
	const result = {} as Record<TemplateType, Awaited<ReturnType<typeof fetchCardItems>>>;
	for (const type of TEMPLATE_TYPES) {
		result[type] = await fetchCardItems(type);
	}

	return new Response(JSON.stringify(result), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};

import type { APIRoute, GetStaticPaths } from 'astro';
import { fetchMinimalCards } from '~/data/iot-hub/api';
import { TEMPLATE_TYPES } from '~/data/iot-hub/constants';
import type { TemplateType } from '~/data/iot-hub/types';

export const getStaticPaths: GetStaticPaths = () => {
	return TEMPLATE_TYPES.map((type) => ({ params: { type } }));
};

export const GET: APIRoute = async ({ params }) => {
	const type = params.type as TemplateType;
	const items = await fetchMinimalCards(type);

	return new Response(JSON.stringify(items), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};

/**
 * Standalone script to fetch all IoT Hub data from the API and save to a local JSON file.
 * This allows builds to run without API access.
 *
 * Usage:
 *   pnpm iot-hub:fetch
 *   pnpm iot-hub:fetch --api http://localhost:8090
 */

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ApiItem, ApiListResponse, IotHubFullItem, TemplateType } from '../src/data/iot-hub/types.ts';
import { TEMPLATE_TYPES, typeSlugToEnum, enumToTypeSlug } from '../src/data/iot-hub/constants.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../src/data/iot-hub/iot-hub-data.json');

const DEFAULT_API = 'http://10.7.2.165:8090';
const MAX_SIZE = 2000;
const BATCH_SIZE = 20;

// --- CLI args ---

function getApiBase(): string {
	const idx = process.argv.indexOf('--api');
	if (idx !== -1 && process.argv[idx + 1]) {
		return process.argv[idx + 1].replace(/\/$/, '');
	}
	return DEFAULT_API;
}

const API_BASE = getApiBase();

// --- Transform (mirrors api.ts logic) ---

function resolveUrl(path: string | null | undefined): string | undefined {
	if (!path) return undefined;
	if (path.startsWith('http://') || path.startsWith('https://')) return path;
	return `${API_BASE}${path}`;
}

function transformItem(raw: ApiItem): IotHubFullItem {
	return {
		id: raw.id,
		name: raw.name,
		type: enumToTypeSlug[raw.type as keyof typeof enumToTypeSlug],
		description: raw.description || undefined,
		categories: raw.categories ?? [],
		useCases: raw.useCases ?? [],
		tags: raw.tags ?? [],
		imageUrl: resolveUrl(raw.image),
		icon: raw.icon ?? undefined,
		color: raw.color ?? undefined,
		peOnly: raw.peOnly,
		creatorDisplayName: raw.creatorDisplayName,
		creatorAvatarUrl: resolveUrl(raw.creatorAvatarUrl),
		totalInstallCount: raw.totalInstallCount,
		version: raw.version,
		publishedTime: raw.publishedTime,
		readme: '',
		changelog: raw.changelog ?? undefined,
		creatorId: raw.creatorId,
		creatorDescription: raw.creatorDescription ?? undefined,
		creatorWebsite: raw.creatorWebsite ?? undefined,
		dataDescriptor: raw.dataDescriptor ?? undefined,
	};
}

// --- Fetch helpers ---

async function fetchItems(type: TemplateType): Promise<IotHubFullItem[]> {
	const apiType = typeSlugToEnum[type];
	const url = `${API_BASE}/api/versions/published?pageSize=${MAX_SIZE}&page=0&sortProperty=totalInstallCount&sortOrder=DESC&type=${apiType}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`API error ${res.status} for ${apiType}: ${url}`);
	const json: ApiListResponse = await res.json();
	return (json.data ?? []).map(transformItem);
}

async function fetchReadme(itemId: string): Promise<string> {
	try {
		const res = await fetch(`${API_BASE}/api/versions/${itemId}/readme`);
		if (!res.ok) return '';
		return await res.text();
	} catch {
		return '';
	}
}

async function fetchReadmesInBatches(items: IotHubFullItem[]): Promise<void> {
	for (let i = 0; i < items.length; i += BATCH_SIZE) {
		const batch = items.slice(i, i + BATCH_SIZE);
		const readmes = await Promise.all(batch.map((item) => fetchReadme(item.id)));
		batch.forEach((item, idx) => {
			item.readme = readmes[idx];
		});
	}
}

// --- Main ---

async function main() {
	console.log(`IoT Hub Fetch — API: ${API_BASE}`);
	console.log(`Output: ${OUTPUT_PATH}\n`);

	const result: Record<string, unknown> = {
		fetchedAt: new Date().toISOString(),
	};

	for (const type of TEMPLATE_TYPES) {
		process.stdout.write(`Fetching ${type}...`);
		const items = await fetchItems(type);
		process.stdout.write(` ${items.length} items`);

		process.stdout.write(', readmes...');
		await fetchReadmesInBatches(items);
		console.log(' done');

		result[type] = items;
	}

	writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, '\t'));
	console.log(`\nSaved to ${OUTPUT_PATH}`);
}

main().catch((err) => {
	console.error('Failed to fetch IoT Hub data:', err);
	process.exit(1);
});

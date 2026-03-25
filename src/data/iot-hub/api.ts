import type { ApiItem, ApiListResponse, IotHubItem, IotHubFullItem, TemplateType } from './types';
import { TEMPLATE_TYPES, typeSlugToEnum, enumToTypeSlug, PAGE_SIZE } from './constants';
import { mockItems } from './mock-data';
import { ItemType } from './types';

export const HYBRID_MODE = false;

const MAX_SIZE = 2000;
const DEFAULT_API_BASE = 'http://10.7.2.165:8090';
const API_BASE = import.meta.env.API_BASE_URL || DEFAULT_API_BASE;

const cache = new Map<string, Promise<IotHubFullItem[]>>();

function useMock(): boolean {
	return import.meta.env.IOT_HUB_MOCK === 'true';
}

// --- Transform API response to internal types ---

/** Resolve relative API paths to absolute URLs */
function resolveUrl(path: string | null | undefined): string | undefined {
	if (!path) return undefined;
	if (path.startsWith('http://') || path.startsWith('https://')) return path;
	return `${API_BASE}${path}`;
}

function transformItem(raw: ApiItem): IotHubFullItem {
	return {
		id: raw.id,
		name: raw.name,
		type: enumToTypeSlug[raw.type as ItemType],
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
		// Full item fields
		readme: '', // fetched separately via fetchReadme()
		changelog: raw.changelog ?? undefined,
		creatorId: raw.creatorId,
		creatorDescription: raw.creatorDescription ?? undefined,
		creatorWebsite: raw.creatorWebsite ?? undefined,
		dataDescriptor: raw.dataDescriptor ?? undefined,
	};
}

// --- Core fetch (with cache) ---

export async function fetchAll(type: TemplateType): Promise<IotHubFullItem[]> {
	if (useMock()) {
		return mockItems[type] ?? [];
	}

	const key = `all:${type}`;
	if (cache.has(key)) {
		return cache.get(key)!;
	}

	const promise = (async () => {
		const apiType = typeSlugToEnum[type];
		const res = await fetch(
			`${API_BASE}/api/versions/published?pageSize=${MAX_SIZE}&page=0&sortProperty=totalInstallCount&sortOrder=DESC&type=${apiType}`,
		);
		if (!res.ok) throw new Error(`IoT Hub API error: ${res.status} for type ${apiType}`);
		const json: ApiListResponse = await res.json();
		return (json.data ?? []).map(transformItem);
	})();

	cache.set(key, promise);
	return promise;
}

// --- Readme (fetched separately, only for detail pages) ---

export async function fetchReadme(itemId: string): Promise<string> {
	if (useMock()) return '';
	try {
		const res = await fetch(`${API_BASE}/api/versions/${itemId}/readme`);
		if (!res.ok) return '';
		return await res.text();
	} catch {
		return '';
	}
}

// --- Paginated access (slices from cache, zero extra API calls) ---

export async function fetchPage(
	type: TemplateType,
	page: number,
	size: number = PAGE_SIZE,
): Promise<{ items: IotHubItem[]; totalPages: number; totalElements: number; hasNext: boolean }> {
	const all = await fetchAll(type);
	const totalElements = all.length;
	const totalPages = Math.max(1, Math.ceil(totalElements / size));
	const start = page * size;
	const items = all.slice(start, start + size);
	return {
		items,
		totalPages,
		totalElements,
		hasNext: page < totalPages - 1,
	};
}

// --- Single item by ID ---

export async function fetchById(
	type: TemplateType,
	id: string,
): Promise<IotHubFullItem | null> {
	const all = await fetchAll(type);
	return all.find((item) => item.id === id) ?? null;
}

// --- Popular items for landing page ---

/** Type-safe Object.fromEntries for known key sets */
function fromEntries<K extends string, V>(entries: readonly (readonly [K, V])[]): Record<K, V> {
	return Object.fromEntries(entries) as Record<K, V>;
}

export async function fetchPopular(
	count: number = 10,
): Promise<Record<TemplateType, IotHubItem[]>> {
	const entries = await Promise.all(
		TEMPLATE_TYPES.map(async (type) => {
			const all = await fetchAll(type);
			const sorted = [...all].sort((a, b) => b.totalInstallCount - a.totalInstallCount);
			return [type, sorted.slice(0, count)] as const;
		}),
	);
	return fromEntries(entries);
}

// --- All items for getStaticPaths() ---

export async function fetchAllTypes(): Promise<Record<TemplateType, IotHubFullItem[]>> {
	const entries = await Promise.all(
		TEMPLATE_TYPES.map(async (type) => {
			const all = await fetchAll(type);
			return [type, all] as const;
		}),
	);
	return fromEntries(entries);
}

// --- Card-level data for client-side JSON (strips readme, changelog, etc.) ---

export function toCardItem(item: IotHubFullItem): IotHubItem {
	return {
		id: item.id,
		name: item.name,
		type: item.type,
		description: item.description,
		categories: item.categories,
		useCases: item.useCases,
		tags: item.tags,
		imageUrl: item.imageUrl,
		icon: item.icon,
		color: item.color,
		peOnly: item.peOnly,
		creatorDisplayName: item.creatorDisplayName,
		creatorAvatarUrl: item.creatorAvatarUrl,
		totalInstallCount: item.totalInstallCount,
		version: item.version,
		publishedTime: item.publishedTime,
		dataDescriptor: item.dataDescriptor,
	};
}

export async function fetchCardItems(type: TemplateType): Promise<IotHubItem[]> {
	const all = await fetchAll(type);
	return all.map(toCardItem);
}

/** Minimal card data for client-side filter JSON — only fields the filter script needs */
interface MinimalCardItem {
	i: string; // id
	n: string; // name
	d?: string; // description
	c: string[]; // categories
	u: string[]; // useCases
	p?: 1; // peOnly (omit if false)
	img?: string; // imageUrl
	ic?: string; // icon
	cl?: string; // color
	cr: string; // creatorDisplayName
	t: number; // totalInstallCount
	s?: string; // subtype (cfType / ruleChainType / widgetType)
	nd?: { n: string }[]; // nodes (name only)
	nc?: number; // nodeCount
}

export function toMinimalCard(item: IotHubFullItem): MinimalCardItem {
	const dd = item.dataDescriptor;
	const subtype = (dd?.cfType ?? dd?.ruleChainType ?? dd?.widgetType) as string | undefined;
	const nodes = dd?.nodes as { name: string }[] | undefined;
	const nodeCount = dd?.nodeCount as number | undefined;

	const m: MinimalCardItem = {
		i: item.id,
		n: item.name,
		c: item.categories,
		u: item.useCases,
		cr: item.creatorDisplayName,
		t: item.totalInstallCount,
	};
	if (item.description) m.d = item.description;
	if (item.peOnly) m.p = 1;
	if (item.imageUrl) m.img = item.imageUrl;
	if (item.icon) m.ic = item.icon;
	if (item.color) m.cl = item.color;
	if (subtype) m.s = subtype;
	if (nodes?.length) m.nd = nodes.map((n) => ({ n: n.name }));
	if (nodeCount && nodeCount > 0) m.nc = nodeCount;
	return m;
}

export async function fetchMinimalCards(type: TemplateType): Promise<MinimalCardItem[]> {
	const all = await fetchAll(type);
	return all.map(toMinimalCard);
}

// --- Dynamic filter extraction (categories/useCases from actual data) ---

export async function extractFilters(
	type: TemplateType,
): Promise<{ categories: string[]; useCases: string[]; subtypes: string[] }> {
	const all = await fetchAll(type);
	const categorySet = new Set<string>();
	const useCaseSet = new Set<string>();
	const subtypeSet = new Set<string>();
	for (const item of all) {
		for (const c of item.categories) categorySet.add(c);
		for (const u of item.useCases) useCaseSet.add(u);
		const st = (item.dataDescriptor?.cfType ?? item.dataDescriptor?.ruleChainType ?? item.dataDescriptor?.widgetType) as string | undefined;
		if (st) subtypeSet.add(st);
	}
	return {
		categories: [...categorySet].sort(),
		useCases: [...useCaseSet].sort(),
		subtypes: [...subtypeSet].sort(),
	};
}

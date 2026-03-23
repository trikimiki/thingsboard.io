/**
 * Client-side filtering logic for IoT Hub listing pages.
 * Data is lazy-loaded from a static JSON endpoint on first filter activation,
 * keeping the initial HTML payload small even with thousands of items.
 */

/** Minimal card from /api/iot-hub/{type}.json */
interface MinimalCard {
	i: string; // id
	n: string; // name
	d?: string; // description
	c: string[]; // categories
	u: string[]; // useCases
	p?: 1; // peOnly
	img?: string; // imageUrl
	ic?: string; // icon
	cl?: string; // color
	cr: string; // creatorDisplayName
	t: number; // totalInstallCount
	s?: string; // subtype
	nd?: { n: string }[]; // nodes
	nc?: number; // nodeCount
}

/** Expanded card used internally */
interface CardItem {
	id: string;
	name: string;
	description?: string;
	categories: string[];
	useCases: string[];
	peOnly: boolean;
	imageUrl?: string;
	icon?: string;
	color?: string;
	creatorDisplayName: string;
	totalInstallCount: number;
	subtype?: string;
	nodes?: { name: string }[];
	nodeCount?: number;
}

function expandCard(m: MinimalCard): CardItem {
	return {
		id: m.i,
		name: m.n,
		description: m.d,
		categories: m.c,
		useCases: m.u,
		peOnly: !!m.p,
		imageUrl: m.img,
		icon: m.ic,
		color: m.cl,
		creatorDisplayName: m.cr,
		totalInstallCount: m.t,
		subtype: m.s,
		nodes: m.nd?.map((n) => ({ name: n.n })),
		nodeCount: m.nc,
	};
}

interface FilterConfig {
	type: string;
	pageSize: number;
	categoryLabels: Record<string, string>;
	useCaseLabels: Record<string, string>;
}

export function initIotHubFilter(config: FilterConfig): void {
	const { type, pageSize, categoryLabels, useCaseLabels } = config;

	const grid = document.getElementById('ih-card-grid');
	const countEl = document.getElementById('ih-count');
	const noResults = document.getElementById('ih-no-results');
	const ssrPagination = document.getElementById('ih-pagination-wrap');
	const clientPagination = document.getElementById('ih-client-pagination');
	const clearBtn = document.getElementById('ih-filters-clear');
	const searchInput = document.getElementById('ih-search') as HTMLInputElement | null;

	if (!grid || !countEl || !noResults || !ssrPagination || !clientPagination || !clearBtn || !searchInput) return;

	const ssrGridHTML = grid.innerHTML;
	const ssrCountText = countEl.textContent;

	let currentPage = 0;
	let allItems: CardItem[] | null = null;
	let loadingPromise: Promise<CardItem[]> | null = null;

	/** Fetch card data lazily — only on first filter activation */
	function loadItems(): Promise<CardItem[]> {
		if (allItems) return Promise.resolve(allItems);
		if (loadingPromise) return loadingPromise;

		loadingPromise = fetch(`/api/iot-hub/${type}/`)
			.then((res) => {
				if (!res.ok) throw new Error(`Failed to load filter data: ${res.status}`);
				return res.json() as Promise<MinimalCard[]>;
			})
			.then((data) => {
				allItems = data.map(expandCard);
				loadingPromise = null;
				return allItems;
			})
			.catch((err) => {
				loadingPromise = null;
				console.error(err);
				return [] as CardItem[];
			});

		return loadingPromise;
	}

	function getChecked(name: string): string[] {
		return Array.from(
			document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`),
		).map((el) => el.value);
	}

	function isAnyFilterActive(): boolean {
		const peOnly = document.getElementById('ih-pe-only') as HTMLInputElement | null;
		return (
			getChecked('category').length > 0 ||
			getChecked('useCase').length > 0 ||
			getChecked('subtype').length > 0 ||
			(peOnly?.checked ?? false) ||
			searchInput!.value.trim().length > 0
		);
	}

	function getItemSubtype(item: CardItem): string | undefined {
		return item.subtype;
	}

	function filterItems(items: CardItem[]): CardItem[] {
		const cats = getChecked('category');
		const ucs = getChecked('useCase');
		const sts = getChecked('subtype');
		const peOnly = (document.getElementById('ih-pe-only') as HTMLInputElement | null)?.checked ?? false;
		const q = searchInput!.value.trim().toLowerCase();

		return items.filter((item) => {
			if (cats.length && !item.categories.some((c) => cats.includes(c))) return false;
			if (ucs.length && !item.useCases.some((u) => ucs.includes(u))) return false;
			if (sts.length) {
				const st = getItemSubtype(item);
				if (!st || !sts.includes(st)) return false;
			}
			if (peOnly && !item.peOnly) return false;
			if (q && !item.name.toLowerCase().includes(q) && !(item.description ?? '').toLowerCase().includes(q))
				return false;
			return true;
		});
	}

	function truncateChipsInContainer(root: HTMLElement): void {
		root.querySelectorAll<HTMLElement>('[data-chips]').forEach((container) => {
			const overflow = container.querySelector<HTMLElement>('[data-chip-overflow]');
			if (!overflow) return;
			const chips = Array.from(container.children).filter(
				(c) => c !== overflow,
			) as HTMLElement[];
			chips.forEach((c) => (c.style.display = ''));
			overflow.hidden = true;
			const maxWidth = container.clientWidth;
			const gap = 4;
			const overflowWidth = 32;
			let usedWidth = 0;
			let hiddenCount = 0;
			for (let i = 0; i < chips.length; i++) {
				const chipWidth = chips[i].offsetWidth;
				const remaining = chips.length - i - 1;
				const reserve = remaining > 0 ? overflowWidth + gap : 0;
				if (usedWidth + chipWidth + (i > 0 ? gap : 0) + reserve <= maxWidth) {
					usedWidth += chipWidth + (i > 0 ? gap : 0);
				} else {
					hiddenCount = chips.length - i;
					for (let j = i; j < chips.length; j++) chips[j].style.display = 'none';
					break;
				}
			}
			if (hiddenCount > 0) {
				overflow.textContent = '+' + hiddenCount;
				overflow.hidden = false;
			}
		});
	}

	function formatCount(n: number): string {
		return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
	}

	function escapeHtml(s: string): string {
		const d = document.createElement('div');
		d.textContent = s;
		return d.innerHTML;
	}

	function getItemLabel(value: string): string {
		return categoryLabels[value] || useCaseLabels[value] || value.split('_').map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
	}

	function renderCard(item: CardItem): string {
		const isCompact = type === 'calculated-fields' || type === 'rule-chains';
		const href = '/iot-hub/' + type + '/' + encodeURIComponent(item.id) + '/';
		const catChips = item.categories.map((c) => '<span class="ih-chip">' + escapeHtml(getItemLabel(c)) + '</span>').join('');
		const ucChips = item.useCases.map((u) => '<span class="ih-chip">' + escapeHtml(getItemLabel(u)) + '</span>').join('');
		const peChip = item.peOnly ? '<span class="ih-chip ih-chip--pe">PE</span>' : '';
		const desc = item.description ? escapeHtml(item.description.slice(0, 140) + (item.description.length > 140 ? '\u2026' : '')) : '';

		// Meta row
		const meta = '<div class="ih-card-meta">' +
			'<span class="ih-card-creator"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' + escapeHtml(item.creatorDisplayName) + '</span>' +
			'<span class="ih-card-installs"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' + formatCount(item.totalInstallCount) + '</span></div>';

		if (isCompact) {
			const color = item.color ? ' style="background:' + escapeHtml(item.color) + '"' : '';
			const iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
			const subtitle = item.subtype;
			const subtitleHtml = subtitle ? '<span class="ih-card-subtitle">' + escapeHtml(getItemLabel(subtitle)) + '</span>' : '';

			let nodePills = '';
			if (type === 'rule-chains' && item.nodes?.length) {
				const nodes = item.nodes;
				const nodeCount = item.nodeCount || nodes.length;
				nodePills = '<div class="ih-node-pills">' +
					nodes.slice(0, 3).map((n) => '<span class="ih-node-pill">' + escapeHtml(n.name) + '</span>').join('') +
					(nodeCount > 3 ? '<span class="ih-node-pill ih-node-more">+' + (nodeCount - 3) + '</span>' : '') +
					'</div>';
			}

			return '<a href="' + href + '" class="ih-card ih-card--compact"><div class="ih-card-body">' +
				'<div class="ih-compact-header"><div class="ih-compact-icon"' + color + '>' + iconSvg + '</div>' +
				'<div class="ih-compact-title-group"><h3 class="ih-card-title">' + escapeHtml(item.name) + '</h3>' + subtitleHtml + '</div>' + peChip + '</div>' +
				(desc ? '<p class="ih-card-desc">' + desc + '</p>' : '') +
				nodePills +
				'<div class="ih-card-chips" data-chips>' + catChips + ucChips + '<span class="ih-chip ih-chip-overflow" data-chip-overflow hidden></span></div>' +
				meta + '</div></a>';
		}

		// Image card (dashboards / widgets)
		const fallbackSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="ih-fallback-icon"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
		const imgHtml = item.imageUrl
			? '<img src="' + escapeHtml(item.imageUrl) + '" alt="' + escapeHtml(item.name) + '" loading="lazy" />'
			: '<div class="ih-card-icon">' + fallbackSvg + '</div>';

		return '<a href="' + href + '" class="ih-card">' +
			'<div class="ih-card-image">' + imgHtml + '</div>' +
			'<div class="ih-card-body">' +
			'<h3 class="ih-card-title">' + escapeHtml(item.name) + '</h3>' +
			(desc ? '<p class="ih-card-desc">' + desc + '</p>' : '') +
			'<div class="ih-card-chips" data-chips>' + peChip + catChips + ucChips + '<span class="ih-chip ih-chip-overflow" data-chip-overflow hidden></span></div>' +
			meta + '</div></a>';
	}

	function renderPagination(total: number, page: number): void {
		const pages = Math.ceil(total / pageSize);
		if (pages <= 1) {
			clientPagination!.hidden = true;
			return;
		}
		let html = '';
		if (page > 0) {
			html +=
				'<button class="ih-page-btn" data-page="' +
				(page - 1) +
				'"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg><span class="ih-page-btn-text">Previous</span></button>';
		}
		html += '<div class="ih-page-numbers">';
		for (let i = 0; i < pages; i++) {
			if (pages > 7 && i > 0 && i < pages - 1 && Math.abs(i - page) > 1) {
				if (i === 1 || i === pages - 2)
					html += '<span class="ih-page-ellipsis">\u2026</span>';
				continue;
			}
			html +=
				i === page
					? '<span class="ih-page-num active" aria-current="page">' + (i + 1) + '</span>'
					: '<button class="ih-page-num" data-page="' + i + '">' + (i + 1) + '</button>';
		}
		html += '</div>';
		if (page < pages - 1) {
			html +=
				'<button class="ih-page-btn" data-page="' +
				(page + 1) +
				'"><span class="ih-page-btn-text">Next</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>';
		}
		clientPagination!.innerHTML = html;
		clientPagination!.hidden = false;
		clientPagination!.querySelectorAll<HTMLButtonElement>('[data-page]').forEach((btn) => {
			btn.addEventListener('click', () => {
				currentPage = parseInt(btn.dataset.page!, 10);
				doRender();
				grid!.scrollIntoView({ behavior: 'smooth', block: 'start' });
			});
		});
	}

	function restoreSSR(): void {
		grid!.innerHTML = ssrGridHTML;
		countEl!.textContent = ssrCountText;
		ssrPagination!.hidden = false;
		clientPagination!.hidden = true;
		noResults!.hidden = true;
		(clearBtn as HTMLButtonElement).disabled = true;
		history.replaceState(null, '', location.pathname);
	}

	function renderWithData(items: CardItem[]): void {
		(clearBtn as HTMLButtonElement).disabled = false;
		const filtered = filterItems(items);
		const paged = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

		ssrPagination!.hidden = true;
		noResults!.hidden = filtered.length > 0;
		countEl!.textContent = filtered.length + ' items found';

		grid!.innerHTML = filtered.length > 0 ? paged.map(renderCard).join('') : '';
		truncateChipsInContainer(grid!);

		renderPagination(filtered.length, currentPage);

		// Sync URL query params
		const params = new URLSearchParams();
		getChecked('category').forEach((c) => params.append('category', c));
		getChecked('useCase').forEach((u) => params.append('useCase', u));
		if ((document.getElementById('ih-pe-only') as HTMLInputElement | null)?.checked)
			params.set('peOnly', '1');
		if (searchInput!.value.trim()) params.set('q', searchInput!.value.trim());
		if (currentPage > 0) params.set('page', String(currentPage + 1));
		const qs = params.toString();
		history.replaceState(null, '', qs ? '?' + qs : location.pathname);
	}

	function doRender(): void {
		if (!isAnyFilterActive()) {
			restoreSSR();
			return;
		}

		// Show loading state on first fetch
		if (!allItems) {
			countEl!.textContent = 'Loading…';
		}

		loadItems().then((items) => {
			// Re-check — user may have cleared filters while loading
			if (!isAnyFilterActive()) {
				restoreSSR();
				return;
			}
			renderWithData(items);
		});
	}

	// Restore filter state from URL on load
	const urlParams = new URLSearchParams(location.search);
	urlParams.getAll('category').forEach((c) => {
		const el = document.querySelector<HTMLInputElement>(`input[name="category"][value="${c}"]`);
		if (el) el.checked = true;
	});
	urlParams.getAll('useCase').forEach((u) => {
		const el = document.querySelector<HTMLInputElement>(`input[name="useCase"][value="${u}"]`);
		if (el) el.checked = true;
	});
	if (urlParams.get('peOnly')) {
		const peEl = document.getElementById('ih-pe-only') as HTMLInputElement | null;
		if (peEl) peEl.checked = true;
	}
	if (urlParams.get('q')) searchInput.value = urlParams.get('q')!;
	if (urlParams.get('page'))
		currentPage = Math.max(0, parseInt(urlParams.get('page')!, 10) - 1);
	if (isAnyFilterActive()) doRender();

	// Bind events
	let debounceTimer: ReturnType<typeof setTimeout>;
	searchInput.addEventListener('input', () => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			currentPage = 0;
			doRender();
		}, 300);
	});

	document.querySelectorAll<HTMLInputElement>('#ih-filters input[type="checkbox"]').forEach((cb) => {
		cb.addEventListener('change', () => {
			currentPage = 0;
			doRender();
		});
	});

	clearBtn.addEventListener('click', () => {
		document.querySelectorAll<HTMLInputElement>('#ih-filters input[type="checkbox"]').forEach((cb) => {
			cb.checked = false;
		});
		searchInput.value = '';
		currentPage = 0;
		restoreSSR();
	});
}

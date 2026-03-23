// IoT Hub data types — mirrors Angular models from
// thingsboard/ui-ngx/src/app/shared/models/iot-hub/

export type TemplateType = 'widgets' | 'dashboards' | 'calculated-fields' | 'rule-chains';

export enum ItemType {
	WIDGET = 'WIDGET',
	DASHBOARD = 'DASHBOARD',
	CALCULATED_FIELD = 'CALCULATED_FIELD',
	RULE_CHAIN = 'RULE_CHAIN',
}

// --- Raw API response types ---

export interface ApiItem {
	id: string;
	itemId: string;
	createdTime: number;
	submittedTime: number;
	publishedTime: number;
	version: string;
	status: string;
	changelog: string | null;
	name: string;
	description: string;
	type: 'WIDGET' | 'DASHBOARD' | 'CALCULATED_FIELD' | 'RULE_CHAIN';
	peOnly: boolean;
	image: string | null;
	icon: string | null;
	color: string | null;
	tags: string[];
	categories: string[];
	useCases: string[];
	creatorId: string;
	creatorDisplayName: string;
	creatorWebsite: string | null;
	creatorContactEmail: string | null;
	creatorDescription: string | null;
	creatorAvatarUrl: string | null;
	file: string;
	resources: { id: string; type: string }[];
	installCount: number;
	totalInstallCount: number;
	minTbVersion: number;
	dataDescriptor: Record<string, unknown> | null;
}

export interface ApiListResponse {
	data: ApiItem[];
	totalPages: number;
	totalElements: number;
	hasNext: boolean;
}

// --- Internal normalized types (consumed by components) ---

export interface IotHubItem {
	id: string;
	name: string;
	type: TemplateType;
	description?: string;
	categories: string[];
	useCases: string[];
	tags?: string[];
	imageUrl?: string;
	icon?: string;
	color?: string;
	peOnly: boolean;
	creatorDisplayName: string;
	creatorAvatarUrl?: string;
	totalInstallCount: number;
	version: string;
	publishedTime: number;
	dataDescriptor?: Record<string, unknown>;
}

export interface IotHubFullItem extends IotHubItem {
	readme: string;
	changelog?: string;
	creatorId: string;
	creatorDescription?: string;
	creatorWebsite?: string;
	dataDescriptor?: Record<string, unknown>;
}

export interface PageData<T> {
	data: T[];
	totalPages: number;
	totalElements: number;
	hasNext: boolean;
}

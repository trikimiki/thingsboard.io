import { type TemplateType, ItemType } from './types';

// --- Type slug ↔ enum mapping ---

export const TEMPLATE_TYPES: TemplateType[] = [
	'widgets',
	'dashboards',
	'calculated-fields',
	'rule-chains',
];

export const typeSlugToEnum: Record<TemplateType, ItemType> = {
	widgets: ItemType.WIDGET,
	dashboards: ItemType.DASHBOARD,
	'calculated-fields': ItemType.CALCULATED_FIELD,
	'rule-chains': ItemType.RULE_CHAIN,
};

export const enumToTypeSlug: Record<ItemType, TemplateType> = {
	[ItemType.WIDGET]: 'widgets',
	[ItemType.DASHBOARD]: 'dashboards',
	[ItemType.CALCULATED_FIELD]: 'calculated-fields',
	[ItemType.RULE_CHAIN]: 'rule-chains',
};

// --- Human-readable labels ---

export const typeLabels: Record<TemplateType, string> = {
	widgets: 'Widgets',
	dashboards: 'Dashboards',
	'calculated-fields': 'Calculated Fields',
	'rule-chains': 'Rule Chains',
};

export const typeDescriptions: Record<TemplateType, string> = {
	widgets: 'Pre-built UI components for data visualization and device control',
	dashboards: 'Ready-to-use dashboards for monitoring and analytics',
	'calculated-fields': 'Computed metrics and aggregation formulas',
	'rule-chains': 'Automation workflows for data processing and alerting',
};

// --- Dynamic label system ---

/** Known label overrides for enum values where auto-formatting is wrong */
const labelOverrides: Record<string, string> = {
	// Categories
	CHARTS_GRAPHS: 'Charts & Graphs',
	GAUGES_INDICATORS: 'Gauges & Indicators',
	MAPS_LOCATION: 'Maps & Location',
	TABLES_LISTS: 'Tables & Lists',
	CARDS_INFO: 'Cards & Info',
	INPUT_FORMS: 'Input Forms',
	DEVICE_MANAGEMENT: 'Device Management',
	USER_MANAGEMENT: 'User Management',
	ASSET_MANAGEMENT: 'Asset Management',
	CUSTOM_FORMULA: 'Custom Formula',
	DATA_PROCESSING: 'Data Processing',
	DEVICE_CONNECTIVITY: 'Device Connectivity',
	SCADA: 'SCADA',
	// Use cases
	SMART_HOME: 'Smart Home',
	INDUSTRIAL_IOT: 'Industrial IoT',
	ENERGY_MANAGEMENT: 'Energy Management',
	FLEET_MANAGEMENT: 'Fleet Management',
	SMART_CITY: 'Smart City',
	WATER_UTILITIES: 'Water & Utilities',
	// Calculated field subtypes
	ENTITY_AGGREGATION: 'Entity Aggregation',
	RELATED_ENTITIES_AGGREGATION: 'Related Entities Aggregation',
	// Widget subtypes (lowercase from API)
	timeseries: 'Time Series',
	latest: 'Latest',
	static: 'Static',
	alarm: 'Alarm',
	rpc: 'RPC',
};

/** Convert "CHARTS_GRAPHS" → "Charts Graphs", "ENERGY" → "Energy" */
export function formatEnumLabel(value: string): string {
	return value
		.split('_')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
		.join(' ');
}

/** Get human label — uses known override or auto-formats from enum value */
export function getLabel(value: string): string {
	return labelOverrides[value] ?? formatEnumLabel(value);
}

export const PAGE_SIZE = 20;

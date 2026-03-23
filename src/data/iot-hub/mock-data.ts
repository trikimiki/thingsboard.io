import type { IotHubFullItem, TemplateType } from './types';

// Category and use-case values as plain strings (enums removed from types.ts).
// These match the API's enum string values.
const WidgetCategory = { CHARTS_GRAPHS: 'CHARTS_GRAPHS', GAUGES_INDICATORS: 'GAUGES_INDICATORS', CONTROLS: 'CONTROLS', MAPS_LOCATION: 'MAPS_LOCATION', TABLES_LISTS: 'TABLES_LISTS', CARDS_INFO: 'CARDS_INFO', SCADA: 'SCADA', INPUT_FORMS: 'INPUT_FORMS' } as const;
const DashboardCategory = { MONITORING: 'MONITORING', ANALYTICS: 'ANALYTICS', DEVICE_MANAGEMENT: 'DEVICE_MANAGEMENT', USER_MANAGEMENT: 'USER_MANAGEMENT', ASSET_MANAGEMENT: 'ASSET_MANAGEMENT', SCADA: 'SCADA', REPORTING: 'REPORTING', OVERVIEW: 'OVERVIEW', OPERATIONS: 'OPERATIONS' } as const;
const CalcFieldCategory = { AGGREGATION: 'AGGREGATION', GEOSPATIAL: 'GEOSPATIAL', STATISTICAL: 'STATISTICAL', ENERGY: 'ENERGY', ENVIRONMENTAL: 'ENVIRONMENTAL', PREDICTIVE: 'PREDICTIVE', CUSTOM_FORMULA: 'CUSTOM_FORMULA' } as const;
const RuleChainCategory = { DATA_PROCESSING: 'DATA_PROCESSING', ALERTING: 'ALERTING', DEVICE_CONNECTIVITY: 'DEVICE_CONNECTIVITY', INTEGRATION: 'INTEGRATION', ANALYTICS: 'ANALYTICS' } as const;
const UseCase = { SMART_HOME: 'SMART_HOME', INDUSTRIAL_IOT: 'INDUSTRIAL_IOT', ENERGY_MANAGEMENT: 'ENERGY_MANAGEMENT', FLEET_MANAGEMENT: 'FLEET_MANAGEMENT', AGRICULTURE: 'AGRICULTURE', SMART_CITY: 'SMART_CITY', HEALTHCARE: 'HEALTHCARE', RETAIL: 'RETAIL', WATER_UTILITIES: 'WATER_UTILITIES' } as const;

function item(
	id: string,
	name: string,
	type: TemplateType,
	opts: Partial<IotHubFullItem> = {},
): IotHubFullItem {
	return {
		id,
		name,
		type,
		description: opts.description ?? `${name} for ThingsBoard IoT platform.`,
		categories: opts.categories ?? [],
		useCases: opts.useCases ?? [],
		tags: opts.tags ?? [],
		imageUrl: opts.imageUrl,
		icon: opts.icon ?? 'widgets',
		color: opts.color,
		peOnly: opts.peOnly ?? false,
		creatorDisplayName: opts.creatorDisplayName ?? 'ThingsBoard',
		creatorAvatarUrl: opts.creatorAvatarUrl,
		totalInstallCount: opts.totalInstallCount ?? Math.floor(Math.random() * 5000),
		version: opts.version ?? '1.0.0',
		publishedTime: opts.publishedTime ?? Date.now() - Math.floor(Math.random() * 90 * 86400000),
		readme: opts.readme ?? `# ${name}\n\n${opts.description ?? `${name} for ThingsBoard IoT platform.`}\n\n## Installation\n\nInstall from IoT Hub with one click.\n\n## Features\n\n- Easy to configure\n- Responsive design\n- Dark mode support`,
		changelog: opts.changelog ?? 'Initial release.',
		creatorId: opts.creatorId ?? 'creator-tb',
		creatorDescription: opts.creatorDescription ?? 'Official ThingsBoard templates',
		creatorWebsite: opts.creatorWebsite ?? 'https://thingsboard.io',
		dataDescriptor: opts.dataDescriptor,
	};
}

const widgets: IotHubFullItem[] = [
	item('w-1', 'Temperature Line Chart', 'widgets', {
		categories: [WidgetCategory.CHARTS_GRAPHS],
		useCases: [UseCase.SMART_HOME, UseCase.INDUSTRIAL_IOT],
		description: 'Real-time temperature line chart with configurable thresholds and time range.',
		totalInstallCount: 4820,
	}),
	item('w-2', 'Humidity Gauge', 'widgets', {
		categories: [WidgetCategory.GAUGES_INDICATORS],
		useCases: [UseCase.AGRICULTURE, UseCase.SMART_HOME],
		description: 'Radial gauge for humidity percentage with color-coded zones.',
		totalInstallCount: 3950,
	}),
	item('w-3', 'Device Control Panel', 'widgets', {
		categories: [WidgetCategory.CONTROLS],
		useCases: [UseCase.SMART_HOME, UseCase.INDUSTRIAL_IOT],
		description: 'Multi-button control panel for device commands (on/off, dimmer, mode).',
		totalInstallCount: 3200,
	}),
	item('w-4', 'Fleet Map Tracker', 'widgets', {
		categories: [WidgetCategory.MAPS_LOCATION],
		useCases: [UseCase.FLEET_MANAGEMENT],
		description: 'Real-time vehicle tracking on an interactive map with route history.',
		totalInstallCount: 2870,
	}),
	item('w-5', 'Telemetry Data Table', 'widgets', {
		categories: [WidgetCategory.TABLES_LISTS],
		useCases: [UseCase.INDUSTRIAL_IOT, UseCase.ENERGY_MANAGEMENT],
		description: 'Sortable, paginated table of latest telemetry values with export to CSV.',
		totalInstallCount: 2540,
	}),
	item('w-6', 'Device Status Card', 'widgets', {
		categories: [WidgetCategory.CARDS_INFO],
		useCases: [UseCase.SMART_HOME],
		description: 'Compact device status card showing connectivity, battery, and last activity.',
		totalInstallCount: 2100,
	}),
	item('w-7', 'SCADA Process View', 'widgets', {
		categories: [WidgetCategory.SCADA],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Industrial SCADA process visualization with animated pipelines and valves.',
		totalInstallCount: 1850,
		peOnly: true,
	}),
	item('w-8', 'Sensor Config Form', 'widgets', {
		categories: [WidgetCategory.INPUT_FORMS],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Dynamic form for configuring sensor parameters and reporting intervals.',
		totalInstallCount: 1420,
	}),
	item('w-9', 'Energy Consumption Bar Chart', 'widgets', {
		categories: [WidgetCategory.CHARTS_GRAPHS],
		useCases: [UseCase.ENERGY_MANAGEMENT],
		description: 'Stacked bar chart comparing energy consumption across devices and time periods.',
		totalInstallCount: 1980,
	}),
	item('w-10', 'Alarm Status Indicator', 'widgets', {
		categories: [WidgetCategory.GAUGES_INDICATORS],
		useCases: [UseCase.INDUSTRIAL_IOT, UseCase.SMART_CITY],
		description: 'Multi-level alarm indicator with severity colors and acknowledge action.',
		totalInstallCount: 1650,
	}),
	item('w-11', 'Water Level Gauge', 'widgets', {
		categories: [WidgetCategory.GAUGES_INDICATORS],
		useCases: [UseCase.WATER_UTILITIES],
		description: 'Vertical fill gauge for water tank level with min/max thresholds.',
		totalInstallCount: 1340,
	}),
	item('w-12', 'GPS Asset Locator', 'widgets', {
		categories: [WidgetCategory.MAPS_LOCATION],
		useCases: [UseCase.FLEET_MANAGEMENT, UseCase.AGRICULTURE],
		description: 'Map widget showing current asset positions with clustering for large fleets.',
		totalInstallCount: 1120,
	}),
];

const dashboards: IotHubFullItem[] = [
	item('d-1', 'Smart Home Overview', 'dashboards', {
		categories: [DashboardCategory.OVERVIEW],
		useCases: [UseCase.SMART_HOME],
		description: 'Complete smart home dashboard with room-by-room monitoring and control.',
		totalInstallCount: 4200,
	}),
	item('d-2', 'Industrial Monitoring Center', 'dashboards', {
		categories: [DashboardCategory.MONITORING],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Factory floor monitoring with machine status, OEE, and alarm overview.',
		totalInstallCount: 3800,
		peOnly: true,
	}),
	item('d-3', 'Energy Analytics Dashboard', 'dashboards', {
		categories: [DashboardCategory.ANALYTICS],
		useCases: [UseCase.ENERGY_MANAGEMENT],
		description: 'Energy consumption analytics with cost breakdown and trend prediction.',
		totalInstallCount: 3100,
	}),
	item('d-4', 'Device Fleet Manager', 'dashboards', {
		categories: [DashboardCategory.DEVICE_MANAGEMENT],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Bulk device management with firmware updates and health monitoring.',
		totalInstallCount: 2600,
	}),
	item('d-5', 'Tenant Admin Portal', 'dashboards', {
		categories: [DashboardCategory.USER_MANAGEMENT],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'User and role management dashboard for multi-tenant deployments.',
		totalInstallCount: 1900,
		peOnly: true,
	}),
	item('d-6', 'Asset Tracking Dashboard', 'dashboards', {
		categories: [DashboardCategory.ASSET_MANAGEMENT],
		useCases: [UseCase.FLEET_MANAGEMENT],
		description: 'Asset inventory with location tracking, maintenance schedules, and history.',
		totalInstallCount: 2200,
	}),
	item('d-7', 'SCADA Control Room', 'dashboards', {
		categories: [DashboardCategory.SCADA],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Full-screen SCADA dashboard with live process diagrams and control panels.',
		totalInstallCount: 1700,
		peOnly: true,
	}),
	item('d-8', 'Weekly Operations Report', 'dashboards', {
		categories: [DashboardCategory.REPORTING],
		useCases: [UseCase.ENERGY_MANAGEMENT, UseCase.INDUSTRIAL_IOT],
		description: 'Automated weekly report with KPIs, charts, and exportable PDF.',
		totalInstallCount: 1500,
	}),
	item('d-9', 'Smart Agriculture Monitor', 'dashboards', {
		categories: [DashboardCategory.MONITORING],
		useCases: [UseCase.AGRICULTURE],
		description: 'Crop monitoring with soil moisture, weather data, and irrigation control.',
		totalInstallCount: 2800,
	}),
	item('d-10', 'City Infrastructure Overview', 'dashboards', {
		categories: [DashboardCategory.OPERATIONS],
		useCases: [UseCase.SMART_CITY],
		description: 'Smart city dashboard with traffic, lighting, waste, and air quality KPIs.',
		totalInstallCount: 1300,
	}),
];

const calculatedFields: IotHubFullItem[] = [
	item('cf-1', 'Daily Energy Aggregation', 'calculated-fields', {
		categories: [CalcFieldCategory.AGGREGATION],
		useCases: [UseCase.ENERGY_MANAGEMENT],
		description: 'Aggregates hourly energy readings into daily kWh totals per device.',
		totalInstallCount: 2400,
	}),
	item('cf-2', 'Geofence Alert', 'calculated-fields', {
		categories: [CalcFieldCategory.GEOSPATIAL],
		useCases: [UseCase.FLEET_MANAGEMENT],
		description: 'Triggers alert when asset moves outside a defined geofence boundary.',
		totalInstallCount: 1900,
	}),
	item('cf-3', 'Moving Average Filter', 'calculated-fields', {
		categories: [CalcFieldCategory.STATISTICAL],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Smooths noisy sensor data with a configurable moving average window.',
		totalInstallCount: 1700,
	}),
	item('cf-4', 'Power Factor Calculator', 'calculated-fields', {
		categories: [CalcFieldCategory.ENERGY],
		useCases: [UseCase.ENERGY_MANAGEMENT],
		description: 'Computes power factor from voltage, current, and active power readings.',
		totalInstallCount: 1500,
	}),
	item('cf-5', 'Heat Index Calculator', 'calculated-fields', {
		categories: [CalcFieldCategory.ENVIRONMENTAL],
		useCases: [UseCase.AGRICULTURE, UseCase.SMART_CITY],
		description: 'Calculates perceived heat index from temperature and humidity.',
		totalInstallCount: 1200,
	}),
	item('cf-6', 'Failure Prediction Score', 'calculated-fields', {
		categories: [CalcFieldCategory.PREDICTIVE],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'ML-based failure prediction score from vibration and temperature trends.',
		totalInstallCount: 980,
		peOnly: true,
	}),
	item('cf-7', 'Custom Efficiency Formula', 'calculated-fields', {
		categories: [CalcFieldCategory.CUSTOM_FORMULA],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'User-defined efficiency formula based on input/output ratio.',
		totalInstallCount: 850,
	}),
	item('cf-8', 'Monthly Cost Aggregation', 'calculated-fields', {
		categories: [CalcFieldCategory.AGGREGATION],
		useCases: [UseCase.ENERGY_MANAGEMENT, UseCase.RETAIL],
		description: 'Aggregates daily costs into monthly totals with tariff-based pricing.',
		totalInstallCount: 1100,
	}),
	item('cf-9', 'Dew Point Calculator', 'calculated-fields', {
		categories: [CalcFieldCategory.ENVIRONMENTAL],
		useCases: [UseCase.AGRICULTURE],
		description: 'Calculates dew point temperature from ambient temperature and relative humidity.',
		totalInstallCount: 920,
	}),
	item('cf-10', 'Cumulative Flow Totalizer', 'calculated-fields', {
		categories: [CalcFieldCategory.AGGREGATION],
		useCases: [UseCase.WATER_UTILITIES],
		description: 'Accumulates instantaneous flow rate readings into cumulative volume totals.',
		totalInstallCount: 870,
	}),
	item('cf-11', 'Reactive Power Calculator', 'calculated-fields', {
		categories: [CalcFieldCategory.ENERGY],
		useCases: [UseCase.ENERGY_MANAGEMENT],
		description: 'Derives reactive power (kVAR) from active power and apparent power readings.',
		totalInstallCount: 810,
	}),
	item('cf-12', 'Speed from GPS Coordinates', 'calculated-fields', {
		categories: [CalcFieldCategory.GEOSPATIAL],
		useCases: [UseCase.FLEET_MANAGEMENT],
		description: 'Calculates vehicle speed from consecutive GPS coordinate pairs and timestamps.',
		totalInstallCount: 780,
	}),
	item('cf-13', 'Exponential Smoothing', 'calculated-fields', {
		categories: [CalcFieldCategory.STATISTICAL],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Applies exponential smoothing to time series data with configurable alpha parameter.',
		totalInstallCount: 750,
	}),
	item('cf-14', 'Remaining Useful Life Estimator', 'calculated-fields', {
		categories: [CalcFieldCategory.PREDICTIVE],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Estimates remaining useful life of equipment based on degradation patterns.',
		totalInstallCount: 720,
		peOnly: true,
	}),
	item('cf-15', 'Wind Chill Index', 'calculated-fields', {
		categories: [CalcFieldCategory.ENVIRONMENTAL],
		useCases: [UseCase.SMART_CITY],
		description: 'Computes wind chill factor from temperature and wind speed measurements.',
		totalInstallCount: 690,
	}),
	item('cf-16', 'Peak Demand Detector', 'calculated-fields', {
		categories: [CalcFieldCategory.ENERGY],
		useCases: [UseCase.ENERGY_MANAGEMENT],
		description: 'Identifies peak power demand intervals within configurable time windows.',
		totalInstallCount: 660,
	}),
	item('cf-17', 'Weighted Average Calculator', 'calculated-fields', {
		categories: [CalcFieldCategory.STATISTICAL],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Computes weighted average across multiple sensor inputs with custom weights.',
		totalInstallCount: 630,
	}),
	item('cf-18', 'Distance from Origin', 'calculated-fields', {
		categories: [CalcFieldCategory.GEOSPATIAL],
		useCases: [UseCase.FLEET_MANAGEMENT],
		description: 'Calculates Haversine distance between current GPS position and a fixed origin.',
		totalInstallCount: 600,
	}),
	item('cf-19', 'Hourly Consumption Breakdown', 'calculated-fields', {
		categories: [CalcFieldCategory.AGGREGATION],
		useCases: [UseCase.ENERGY_MANAGEMENT],
		description: 'Splits daily consumption into hourly buckets for time-of-use analysis.',
		totalInstallCount: 570,
	}),
	item('cf-20', 'Soil Moisture Deficit', 'calculated-fields', {
		categories: [CalcFieldCategory.ENVIRONMENTAL],
		useCases: [UseCase.AGRICULTURE],
		description: 'Calculates soil moisture deficit from field capacity and current moisture level.',
		totalInstallCount: 540,
	}),
	item('cf-21', 'OEE Calculator', 'calculated-fields', {
		categories: [CalcFieldCategory.CUSTOM_FORMULA],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Computes Overall Equipment Effectiveness from availability, performance, and quality.',
		totalInstallCount: 510,
	}),
	item('cf-22', 'Battery Drain Rate', 'calculated-fields', {
		categories: [CalcFieldCategory.PREDICTIVE],
		useCases: [UseCase.SMART_HOME, UseCase.INDUSTRIAL_IOT],
		description: 'Predicts battery depletion time based on recent voltage drop rate.',
		totalInstallCount: 480,
	}),
	item('cf-23', 'Standard Deviation Monitor', 'calculated-fields', {
		categories: [CalcFieldCategory.STATISTICAL],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Tracks rolling standard deviation to detect process variability changes.',
		totalInstallCount: 450,
	}),
	item('cf-24', 'Carbon Emission Estimator', 'calculated-fields', {
		categories: [CalcFieldCategory.ENERGY],
		useCases: [UseCase.ENERGY_MANAGEMENT, UseCase.SMART_CITY],
		description: 'Estimates CO2 emissions from energy consumption using grid emission factors.',
		totalInstallCount: 420,
	}),
	item('cf-25', 'Zone Occupancy Counter', 'calculated-fields', {
		categories: [CalcFieldCategory.CUSTOM_FORMULA],
		useCases: [UseCase.RETAIL, UseCase.SMART_CITY],
		description: 'Counts zone occupancy from entry/exit sensor events with reset at midnight.',
		totalInstallCount: 390,
	}),
];

const ruleChains: IotHubFullItem[] = [
	item('rc-1', 'Telemetry Normalization', 'rule-chains', {
		categories: [RuleChainCategory.DATA_PROCESSING],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Normalizes raw sensor telemetry into standard units and formats.',
		totalInstallCount: 3100,
	}),
	item('rc-2', 'Threshold Alarm Generator', 'rule-chains', {
		categories: [RuleChainCategory.ALERTING],
		useCases: [UseCase.INDUSTRIAL_IOT, UseCase.SMART_HOME],
		description: 'Generates alarms when telemetry values exceed configurable thresholds.',
		totalInstallCount: 2800,
	}),
	item('rc-3', 'MQTT Device Provisioning', 'rule-chains', {
		categories: [RuleChainCategory.DEVICE_CONNECTIVITY],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Auto-provisions new MQTT devices with default attributes and dashboards.',
		totalInstallCount: 2200,
	}),
	item('rc-4', 'Kafka Data Export', 'rule-chains', {
		categories: [RuleChainCategory.INTEGRATION],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Exports telemetry data to Apache Kafka topic for external processing.',
		totalInstallCount: 1700,
		peOnly: true,
	}),
	item('rc-5', 'Anomaly Detection Pipeline', 'rule-chains', {
		categories: [RuleChainCategory.ANALYTICS],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Detects anomalous telemetry patterns using statistical analysis.',
		totalInstallCount: 1500,
		peOnly: true,
	}),
	item('rc-6', 'Email Notification Workflow', 'rule-chains', {
		categories: [RuleChainCategory.ALERTING],
		useCases: [UseCase.SMART_HOME, UseCase.SMART_CITY],
		description: 'Sends email notifications on alarm creation with customizable templates.',
		totalInstallCount: 2000,
	}),
	item('rc-7', 'HTTP Webhook Forwarder', 'rule-chains', {
		categories: [RuleChainCategory.INTEGRATION],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Forwards telemetry events to external HTTP endpoints as JSON payloads.',
		totalInstallCount: 1400,
	}),
	item('rc-8', 'Data Deduplication Filter', 'rule-chains', {
		categories: [RuleChainCategory.DATA_PROCESSING],
		useCases: [UseCase.INDUSTRIAL_IOT],
		description: 'Filters duplicate telemetry messages based on timestamp and value comparison.',
		totalInstallCount: 1100,
	}),
];

export const mockItems: Record<TemplateType, IotHubFullItem[]> = {
	widgets,
	dashboards,
	'calculated-fields': calculatedFields,
	'rule-chains': ruleChains,
};

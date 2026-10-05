// Core types for LandslideGuard NER

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface LocationData {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  rainfall: number; // mm/24h
  soilMoisture: number; // %
  slope: number; // degrees
  elevation: number; // meters
  historicalEvents: number;
  geologicalSusceptibility: 'Low' | 'Moderate' | 'High';
  riskScore: number;
  riskLevel: RiskLevel;
  temperature: number; // Celsius
  windSpeed: number; // km/h
  roads: number;
  villages: number;
  schools: number;
  riskTrend: number; // % change
  lastUpdated: string;
}

export interface Alert {
  id: string;
  locationId: string;
  locationName: string;
  state: string;
  riskScore: number;
  riskLevel: RiskLevel;
  time: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  triggers: string[];
}

export interface RiskHistoryPoint {
  time: string;
  score: number;
}

export interface HistoricalEvent {
  year: number;
  month: string;
  state: string;
  location: string;
  casualties: number;
  damage: string;
}

export interface InfrastructureItem {
  id: string;
  type: 'road' | 'village' | 'hospital' | 'school' | 'emergency';
  name: string;
  locationId: string;
  riskLevel: RiskLevel;
  details: string;
  distance?: number; // km
}

export interface SystemStatus {
  dataPipeline: 'Operational' | 'Degraded' | 'Down';
  aiModel: 'Operational' | 'Degraded' | 'Down';
  gisService: 'Operational' | 'Degraded' | 'Down';
  alertService: 'Operational' | 'Degraded' | 'Down';
  lastUpdate: string;
}

export interface AlertRecipient {
  id: string;
  name: string;
  type: 'authority' | 'emergency' | 'community';
  status: 'Pending' | 'Sent' | 'Delivered';
  method: string;
}

export type Page =
  | 'dashboard'
  | 'map'
  | 'prediction'
  | 'warnings'
  | 'analysis'
  | 'historical'
  | 'infrastructure'
  | 'satellite'
  | 'architecture'
  | 'settings'
  | 'how-it-works';

export interface SatelliteLayer {
  id: string;
  name: string;
  type: 'optical' | 'dem' | 'slope' | 'moisture' | 'ndvi' | 'insar';
  resolution: string;
  satellite: string;
  description: string;
  lastCaptured: string;
}

export interface DemoStep {
  step: number;
  title: string;
  subtitle: string;
  locationId: string;
  rainfall: number;
  soilMoisture: number;
  riskScore: number;
  riskLevel: RiskLevel;
  flashAlert: boolean;
  message: string;
  triggers?: string[];
  recommendation?: string;
  dispatched?: boolean;
}


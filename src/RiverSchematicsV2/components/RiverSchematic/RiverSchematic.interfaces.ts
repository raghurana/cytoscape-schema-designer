export interface SchematicJsonData {
  catchmentId: number;
  river_schematic_name?: string;
  version: number;
  nodes: SchematicNode[];
  edges: SchematicEdge[];
}

export interface SchematicNode {
  id: number;
  assocSourceID?: number;
  feature_type: Types.NodeFeatureType;
  feature_label: string;
  geometry: Position;
  attributes: NodeAttributes;
  current?: CurrentStorageDetails | CurrentRiverGaugeDetails;
  ui_hints?: {
    label?: string;
    hide_label?: boolean;
    feature_label?: string;
    label_margin_x?: number;
    label_margin_y?: number;
  };
}

export interface SchematicEdge {
  id: number;
  fromID: number;
  toID: number;
  assocSourceID?: number;
  feature_type?: string;
  feature_label?: string;
  geometry?: EdgeGeometry;
  attributes?: EdgeAttributes;
  ui_hints?: {
    label?: string;
    width?: number;
    line_style?: string;
    line_dash_pattern?: number[];
    label_position?: string;
    label_margin_x?: number;
    label_margin_y?: number;
    curve_position?: string;
  };
}

export type NodeAttributes =
  | StorageAttributes
  | TownAttributes
  | RiverGaugeAttributes
  | JunctionAttributes
  | WetlandAttributes
  | FloodplainAttributes;

export interface EdgeAttributes {
  river_name: string;
  segment_no: number;
  segment_count: number;
  river_size: number;
  river_type: number;
  curve_type: Types.EdgeCurveType;
  label_margin_x?: number;
  label_margin_y?: number;
}

export interface CurrentRiverGaugeDetails {
  gaugeId: string;
  wiskiGaugeId: string;
  catchmentId: number;
  catchmentDisplayName: string;
  gaugeName: string;
  gaugeShortName: string;
  observationDay: number;
  watercourseDischarge: number;
  watercourseLevel: number;
  watercourseLevelPrevDay: number;
  lastUpdated: string;
  waterQualityLastUpdated: string | null;
  hasWaterQuality: boolean;
  waterQuality: WaterQualityValue[];
}

export type WaterQualityValue = {
  lastUpdated: string;
  measureDescription: string;
  measureId: string;
  measureSortOrder: number;
  observationDay: number;
  observationValue: number;
  uom: string;
  valueClassification: string | null;
};

export interface CurrentStorageDetails {
  storage_id: number;
  storage_name: string;
  storage_short_name: string;
  storage_description: string;
  percentage_full_now: number;
  percentage_full_ly: number;
  volume_total: number;
  volume_accessible: number;
  capacity_total: number;
  volume_dead: number;
  surface_area: null;
  nsw_state_share: null;
  vic_state_share: null;
  sa_state_share: null;
  qld_state_share: null;
  state_share_effective_date: null;
  catchment_id: number;
  catchment_display_name: string;
  last_updated: string;
  current_year_date: string;
  last_year_date: string;
}

export interface EdgeGeometry {
  from: Position;
  to: Position;
}

export interface Position {
  x: number;
  y: number;
}

export interface StorageAttributes {
  ContractedNodeID: number | null;
  storage_id: number;
  storage_name: string;
  storage_short_name: string;
}

export interface TownAttributes {
  town_name: string;
  label_margin_x?: number;
  label_margin_y?: number;
}

export interface RiverGaugeAttributes {
  ContractedNodeID: number;
  gauge_id: string;
  gauge_name: string;
  gauge_short_name: string;
}

export interface JunctionAttributes {
  junction_description: string;
}

export interface FloodplainAttributes {
  river_name: string;
}

export interface WetlandAttributes {
  wetland_name: string;
  comment: string;
}

export interface SelectedFeature {
  nodeId: string;
  featureType: 'Storage' | 'Rivergauge' | 'Debug';
  details: RiverGaugeSelectionDetail | StorageSelectionDetail;
}

export interface RiverGaugeSelectionDetail {
  gaugeId: string;
  gaugeName: string;
  catchmentId: number;
  watercourseDischarge: number;
  watercourseLevel: number;
  watercourseLevelPrevDay: number;
  lastUpdated: string;
  observationDay: number;
  waterQuality: WaterQualityValue[];
}

export interface StorageSelectionDetail {
  storageId: number;
  storageName: string;
  catchmentId: number;
  percentageFullNow: number;
  percentageFullLy: number;
  volumeTotal: number;
  lastUpdated: string;
}

export interface SchematicPan {
  x: number;
  y: number;
}

export interface SchematicPanExtent {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export const riverSizeMap = new Map<number, Types.RiverSize>();
riverSizeMap.set(1, 'major river');
riverSizeMap.set(3, 'tributary');

export const riverTypeMap = new Map<number, Types.RiverType>();
riverTypeMap.set(1, 'normal');
riverTypeMap.set(2, 'ephemeral');
riverTypeMap.set(3, 'channel/canal');

export namespace Types {
  export type NodeFeatureType = 'Junction' | 'Rivergauge' | 'Storage' | 'Town' | 'Wetland' | 'Floodplain';
  export type EdgeCurveType = 'left' | 'right';
  export type SpecialFeature = 'Rivergauge' | 'Storage' | 'Wetland';
  export type RiverSize = 'major river' | 'tributary';
  export type RiverType = 'normal' | 'ephemeral' | 'channel/canal'; // Eg of ephemeral are Gwydir flood plains
  export type InteractiveFeature = 'Rivergauge' | 'Storage';
  export type NodeLabelDesignerExtension = 'id' | 'geometry' | 'none';
  export type EdgeLabelDesignerExtension = 'id' | 'none';
  export type GraphOptions = {
    minZoom: number;
    maxZoom: number;
    zoomStep: number;
    zoomPadding: number;
    panLimitPadding: number;
    featureSettings: {
      riverGauge: 'FlowRate' | 'RowHeight';
      storage: 'PercentageFull' | 'Volume';
    };
    designerSettings?: {
      nodes?: {
        appendToLabel: NodeLabelDesignerExtension;
      };
      edges?: {
        appendToLabel: EdgeLabelDesignerExtension;
      };
    };
  };
}

export interface Schematic {
  nodes: Node[];
  edges: Edge[];
  meta: {
    name: string;
    catchmentId: number;
  };
}

interface BaseNode {
  id: number;
  featureType: 'Junction' | 'River' | 'Rivergauge' | 'Town' | 'Storage' | 'Wetland' | 'Point';
  geometry: {
    x: number;
    y: number;
  };
}

export interface JunctionNode extends BaseNode {
  featureType: 'Junction';
  attributes: {
    junctionDescription: string;
  };
}

export interface RiverNode extends BaseNode {
  featureType: 'River';
  attributes: {
    riverName: string;
  };
}

export interface RiverGaugeNode extends BaseNode {
  featureType: 'Rivergauge';
  attributes: {
    gaugeId: string;
    gaugeName?: string;
  };
}

export interface TownNode extends BaseNode {
  featureType: 'Town';
  attributes: {
    townName: string;
  };
}

export interface StorageNode extends BaseNode {
  featureType: 'Storage';
  attributes: {
    storageId: string;
    storageName?: string;
  };
}

export interface WetlandNode extends BaseNode {
  featureType: 'Wetland';
}

export interface PointNode extends BaseNode {
  featureType: 'Point';
}

export interface Edge {
  id: number;
  fromId: number;
  toId: number;
  attributes: {
    riverSize: 'major' | 'minor';
    riverType?: 'ephemeral' | 'channel_or_canal';
    flowDirection?: 'from_2_to' | 'to_2_from';
    curveType?: 'left' | 'right';
  };
}

export type Node = JunctionNode | RiverNode | RiverGaugeNode | TownNode | StorageNode | WetlandNode | PointNode;

import v8n from 'v8n';
import { SchematicEdge, SchematicNode } from '../RiverSchematicsV2/components/RiverSchematic/RiverSchematic.interfaces';

export type Direction = 'up' | 'down' | 'left' | 'right';
export const DirectionArray: Direction[] = ['up', 'left', 'down', 'right'];
export const ValidCurveTypes = ['left', 'right'];
export type LineType = 'major river' | 'tributary' | 'ephemeral';
export const ValidLineTypes: LineType[] = ['major river', 'tributary', 'ephemeral'];

export namespace Payload {
  export type NewSchematic = { catchmentId: number };
  export type LoadSchematic = { fileJson: string };
  export type AddNode = SchematicNode;
  export type AddJunctionNode = { x: string; y: string };
  export type AddNodeRelative = { refNodeId: string; distance: string; direction: Direction; newNodeId?: string };
  export type AddJunctionNodeRelative = AddNodeRelative & { junctionDesc?: string };
  export type AddRiverGaugeNodeRelative = AddNodeRelative & { gaugeId: string };
  export type AddStorageNodeRelative = AddNodeRelative & { storageId: string; storageName: string };
  export type AddTownNodeRelative = AddNodeRelative & { townName: string };
  export type AddWetlandNodeRelative = AddNodeRelative & { wetlandName: string };
  export type AddEdge = { fromId: string; toId: string; newEdgeId?: string };
  export type DeleteEdge = { edgeId: string };
  export type UpdateEdgeCurve = { fromId: string; toId: string; curve: string };
  export type UpdateEdgeLabel = { newLabel: string; edgeId: string };
  export type UpdateEdgeLine = { lineType: LineType; edgeId: string };
  export type MoveLabel = { id: string; distance: string; direction: Direction };
}

export namespace PayloadValidator {
  type V8nExtensions = {
    validDirection: () => (value: string) => boolean;
    validCurveType: () => (value: string) => boolean;
    validLineType: () => (value: string) => boolean;
    parsableNumber: () => (value: string) => boolean;
    positiveParsableNumber: () => (value: string) => boolean;
  };

  const extensions: V8nExtensions = {
    validDirection: () => (value: string) => DirectionArray.includes(value as Direction),
    validCurveType: () => (value: string) => ValidCurveTypes.includes(value),
    validLineType: () => (value: string) => ValidLineTypes.includes(value as LineType),
    parsableNumber: () => (value: string) => !isNaN(+value),
    positiveParsableNumber: () => (value: string) => {
      const parsed = +value;
      return !isNaN(parsed) && parsed > 0;
    },
  };

  const v8nExtended = () => v8n() as unknown as V8nExtensions;

  v8n.extend(extensions);

  export const newSchematic = v8n().schema({ catchmentId: v8nExtended().positiveParsableNumber() });

  export const loadSchematic = v8n().schema({ fileJson: v8n().string().not.empty() });

  export const addJunctionNode = v8n().schema({
    x: v8nExtended().parsableNumber(),
    y: v8nExtended().parsableNumber(),
  });

  export const addJunctionNodeRelative = v8n().schema({
    refNodeId: v8nExtended().positiveParsableNumber(),
    distance: v8nExtended().positiveParsableNumber(),
    direction: v8nExtended().validDirection(),
  });

  export const addRiverGaugeNodeRelative = v8n().schema({
    refNodeId: v8nExtended().positiveParsableNumber(),
    distance: v8nExtended().positiveParsableNumber(),
    direction: v8nExtended().validDirection(),
    gaugeId: v8n().string().not.empty(),
  });

  export const addStorageNodeRelative = v8n().schema({
    refNodeId: v8nExtended().positiveParsableNumber(),
    distance: v8nExtended().positiveParsableNumber(),
    direction: v8nExtended().validDirection(),
    storageId: v8n().string().not.empty(),
    storageName: v8n().string().not.empty(),
  });

  export const addTownNodeRelative = v8n().schema({
    refNodeId: v8nExtended().positiveParsableNumber(),
    distance: v8nExtended().positiveParsableNumber(),
    direction: v8nExtended().validDirection(),
    townName: v8n().string().not.empty(),
  });

  export const addWetlandNodeRelative = v8n().schema({
    refNodeId: v8nExtended().positiveParsableNumber(),
    distance: v8nExtended().positiveParsableNumber(),
    direction: v8nExtended().validDirection(),
    wetlandName: v8n().string().not.empty(),
  });

  export const addEdge = v8n().schema({
    fromId: v8nExtended().positiveParsableNumber(),
    toId: v8nExtended().positiveParsableNumber(),
  });

  export const deleteEdge = v8n().schema({
    edgeId: v8nExtended().positiveParsableNumber(),
  });

  export const updateEdgeCurve = v8n().schema({
    fromId: v8nExtended().positiveParsableNumber(),
    toId: v8nExtended().positiveParsableNumber(),
    curve: v8nExtended().validCurveType(),
  });

  export const updateEdgeLabel = v8n().schema({
    newLabel: v8n().string().not.empty(),
    edgeId: v8nExtended().positiveParsableNumber(),
  });

  export const updateEdgeLine = v8n().schema({
    lineType: v8nExtended().validLineType(),
    edgeId: v8nExtended().positiveParsableNumber(),
  });

  export const moveLabel = v8n().schema({
    id: v8nExtended().positiveParsableNumber(),
    distance: v8nExtended().positiveParsableNumber(),
    direction: v8nExtended().validDirection(),
  });
}

export interface Commands {
  undo: () => void;
  newSchematic: (payload: Payload.NewSchematic) => void;
  loadSchematic: (payload: Payload.LoadSchematic) => void;
  addNode: (payload: Payload.AddNode) => void;
  addJunctionNode: (payload: Payload.AddJunctionNode) => void;
  addJunctionNodeRelative: (payload: Payload.AddJunctionNodeRelative) => void;
  addRiverGaugeNodeRelative: (payload: Payload.AddRiverGaugeNodeRelative) => void;
  addStorageNodeRelative: (payload: Payload.AddStorageNodeRelative) => void;
  addTownNodeRelative: (payload: Payload.AddTownNodeRelative) => void;
  addWetlandNodeRelative: (payload: Payload.AddWetlandNodeRelative) => void;
  addEdge: (payload: Payload.AddEdge) => void;
  deleteEdge: (payload: Payload.DeleteEdge) => SchematicEdge | undefined;
  updateEdgeCurve: (payload: Payload.UpdateEdgeCurve) => void;
  updateEdgeLabel: (payload: Payload.UpdateEdgeLabel) => void;
  updateEdgeLine: (payload: Payload.UpdateEdgeLine) => void;
  moveLabel: (payload: Payload.MoveLabel) => void;
}

export type Command<T = void> = {
  type: keyof Commands;
  payload?: T;
};

import v8n from 'v8n';
import { SchematicEdge, SchematicJsonData, SchematicNode } from '../RiverSchematicsV2/components/RiverSchematic/RiverSchematic.interfaces';

export type Direction = 'up' | 'down' | 'left' | 'right';
export const DirectionArray: Direction[] = ['up', 'left', 'down', 'right'];
export const ValidCurveTypes = ['left', 'right'];

export namespace Payload {
  export type NewSchematic = SchematicJsonData['meta'];
  export type LoadSchematic = { fileJson: string };
  export type AddNode = SchematicNode;
  export type AddNodeRelative = { refNodeId: string; distance: string; direction: Direction; newNodeId?: string };
  export type AddJunctionNodeRelative = AddNodeRelative & { junctionDesc?: string };
  export type AddEdge = { fromId: string; toId: string; newEdgeId?: string };
  export type DeleteEdge = { fromId: string; toId: string };
  export type UpdateEdgeCurve = { fromId: string; toId: string; curve: string };
  export type UpdateElementAttribute = { id: string; attributeName: string; value: string };
  export type MoveLabel = { id: string; distance: string; direction: Direction };
}

export namespace PayloadValidator {
  type V8nExtensions = {
    validDirection: () => (value: string) => boolean;
    validCurveType: () => (value: string) => boolean;
    parsableNumber: () => (value: string) => boolean;
    positiveParsableNumber: () => (value: string) => boolean;
  };

  const extensions: V8nExtensions = {
    validDirection: () => (value: string) => DirectionArray.includes(value as Direction),
    validCurveType: () => (value: string) => ValidCurveTypes.includes(value),
    parsableNumber: () => (value: string) => !isNaN(+value),
    positiveParsableNumber: () => (value: string) => {
      const parsed = +value;
      return !isNaN(parsed) && parsed > 0;
    },
  };

  v8n.extend(extensions);
  const v8nExtended = () => v8n() as unknown as V8nExtensions;

  export const loadSchematic = v8n().schema({ fileJson: v8n().string().not.empty() });

  export const addNodeRelative = v8n().schema({
    refNodeId: v8nExtended().positiveParsableNumber(),
    distance: v8nExtended().positiveParsableNumber(),
    direction: v8nExtended().validDirection(),
  });

  export const addEdge = v8n().schema({
    fromId: v8nExtended().positiveParsableNumber(),
    toId: v8nExtended().positiveParsableNumber(),
  });

  export const deleteEdge = v8n().schema({
    fromId: v8nExtended().positiveParsableNumber(),
    toId: v8nExtended().positiveParsableNumber(),
  });

  export const updateEdgeCurve = v8n().schema({
    fromId: v8nExtended().positiveParsableNumber(),
    toId: v8nExtended().positiveParsableNumber(),
    curve: v8nExtended().validCurveType(),
  });

  export const updateAttribute = v8n().schema({
    id: v8nExtended().positiveParsableNumber(),
    attributeName: v8n().string().not.empty(),
    value: v8n().string().not.empty(),
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
  addJunctionNodeRelative: (payload: Payload.AddJunctionNodeRelative) => void;
  addEdge: (payload: Payload.AddEdge) => void;
  deleteEdge: (payload: Payload.DeleteEdge) => SchematicEdge | undefined;
  updateEdgeCurve: (payload: Payload.UpdateEdgeCurve) => void;
  updateElementAttribute: (payload: Payload.UpdateElementAttribute) => void;
  moveLabel: (payload: Payload.MoveLabel) => void;
}

export type Command<T = void> = {
  type: keyof Commands;
  payload?: T;
};

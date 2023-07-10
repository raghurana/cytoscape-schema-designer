import {
  EdgeAttributes,
  SchematicEdge,
  SchematicJsonData,
  SchematicNode,
} from '../RiverSchematicsV2/components/RiverSchematic/RiverSchematic.interfaces';

export namespace Payload {
  export type NewSchematic = SchematicJsonData['meta'];
  export type LoadSchematic = { fileJson: string };
  export type AddNode = SchematicNode;
  export type AddNodeRelative = {
    refNodeId: string;
    newNodeId: string;
    direction: 'left' | 'right' | 'top' | 'bottom';
    distance: string;
  };
  export type AddJunctionNodeRelative = AddNodeRelative & { junctionDesc?: string };
  export type AddEdge = { fromId: string; toId: string; newEdgeId: string };
  export type DeleteEdge = { fromId: string; toId: string };
  export type UpdateEdgeCurve = { fromId: string; toId: string; curve: EdgeAttributes['curve_type'] };
  export type UpdateElementAttribute = {
    elementType: 'node' | 'edge';
    id: string;
    attributeName: string;
    value: string;
  };
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
}

export type Command<T = void> = {
  type: keyof Commands;
  payload?: T;
};

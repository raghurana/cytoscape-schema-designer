import { Schematic, Node, Edge } from './schematic.ts';

export namespace Payload {
  export type NewSchematic = Schematic['meta'];
  export type AddNode = Node;
  export type AddEdge = Edge;
}

export interface Commands {
  undo: () => void;
  newSchematic: (payload: Payload.NewSchematic) => void;
  addNode: (payload: Payload.AddNode) => void;
  addEdge: (payload: Payload.AddEdge) => void;
}

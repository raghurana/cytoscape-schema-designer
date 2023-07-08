import { Payload } from './commands.ts';
import { Schematic } from './schematic.ts';

export class SchematicAggregate {
  private events: SchematicUpdated[] = [];
  private data: Schematic | undefined = undefined;

  get lastEvent() {
    if (this.events.length === 0) return undefined;
    return this.events[this.events.length - 1];
  }

  onNewSchematic(payload: Payload.NewSchematic) {
    this.events = [];
    this.data = { meta: { name: payload.name, catchmentId: payload.catchmentId }, nodes: [], edges: [] };
    this.raiseUpdatedEvent();
  }

  onNewNode(payload: Payload.AddNode) {
    this.data?.nodes.push(payload);
    this.raiseUpdatedEvent();
  }

  onNewEdge(payload: Payload.AddEdge) {
    this.data?.edges.push(payload);
    this.raiseUpdatedEvent();
  }

  onUndo() {
    this.events.pop();
    this.data = this.lastEvent?.data;
  }

  private raiseUpdatedEvent() {
    if (this.data) this.events.push({ data: structuredClone(this.data) });
  }
}

export interface SchematicUpdated {
  data: Schematic | undefined;
}

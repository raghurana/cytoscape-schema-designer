import { Commands, Payload } from './commands.ts';
import {
  JunctionAttributes,
  Position,
  SchematicEdge,
  SchematicJsonData,
  SchematicNode,
} from '../RiverSchematicsV2/components/RiverSchematic/RiverSchematic.interfaces.ts';

export interface SchematicUpdated {
  data: SchematicJsonData | undefined;
}

export class SchematicAggregate implements Commands {
  private events: SchematicUpdated[] = [];
  private data: SchematicJsonData | undefined = undefined;

  get lastEvent() {
    if (this.events.length === 0) return undefined;
    return this.events[this.events.length - 1];
  }

  raiseUpdatedEvent() {
    if (this.data) this.events.push({ data: structuredClone(this.data) });
  }

  undo() {
    this.events.pop();
    this.data = structuredClone(this.lastEvent?.data);
  }

  newSchematic(payload: Payload.NewSchematic) {
    this.events = [];
    this.data = { meta: { name: payload.name }, nodes: [], edges: [] };
  }

  loadSchematic(payload: Payload.LoadSchematic) {
    this.events = [];
    this.data = JSON.parse(payload.fileJson);
  }

  addNode(payload: Payload.AddNode) {
    this.data?.nodes.push(payload);
  }

  addJunctionNodeRelative(payload: Payload.AddJunctionNodeRelative) {
    if (!this.data) return;
    const referenceNode = this.data.nodes.find((n) => n.id === +payload.refNodeId);
    if (!referenceNode) return;
    const relativeDistance = +payload.distance;
    this.addNode({
      id: +payload.newNodeId,
      feature_type: 'Junction',
      feature_label: '',
      geometry: this.geometryFromReferenceNode(referenceNode, payload.direction, relativeDistance),
      attributes: {
        junction_description: payload.junctionDesc,
      } as JunctionAttributes,
    });
  }

  addEdge(payload: Payload.AddEdge) {
    this.data?.edges.push({
      id: +payload.newEdgeId,
      fromID: +payload.fromId,
      toID: +payload.toId,
    });
  }

  deleteEdge(payload: Payload.DeleteEdge) {
    if (!this.data) return;
    const deleteIndex = this.data.edges.findIndex((e) => this.edgeFromToPredicate(e, payload.fromId, payload.toId));
    let deletedEdge: SchematicEdge | undefined = undefined;
    if (deleteIndex >= 0) deletedEdge = this.data.edges.splice(deleteIndex, 1)?.[0];
    return deletedEdge;
  }

  updateElementAttribute(payload: Payload.UpdateElementAttribute) {
    if (!this.data) return;
    let element = undefined;
    if (payload.elementType === 'node') element = this.data.nodes.find((n) => n.id === +payload.id);
    if (payload.elementType === 'edge') element = this.data.edges.find((e) => e.id === +payload.id);
    if (element) this.setElementAttrib(element, payload.attributeName, payload.value);
  }

  updateEdgeCurve(payload: Payload.UpdateEdgeCurve) {
    if (!this.data) return;
    const sourceNode = this.data.nodes.find((n) => n.id === +payload.fromId);
    const targetNode = this.data.nodes.find((n) => n.id === +payload.toId);
    const horizontalEdge = this.data.edges.find((e) => this.edgeFromToPredicate(e, payload.fromId, payload.toId));
    if (sourceNode && targetNode && horizontalEdge) {
      const junctionNodeId = Date.now();
      const junctionDistance = Math.abs(targetNode.geometry.x - sourceNode.geometry.x) * 0.7; // 70% from source
      this.addJunctionNodeRelative({
        refNodeId: sourceNode.id.toString(),
        newNodeId: junctionNodeId.toString(),
        distance: junctionDistance.toString(),
        direction: targetNode.geometry.x > sourceNode.geometry.x ? 'right' : 'left',
      });

      horizontalEdge.fromID = sourceNode.id;
      horizontalEdge.toID = junctionNodeId;

      const curveEdgeId = (junctionNodeId + 1).toString();
      this.addEdge({
        fromId: junctionNodeId.toString(),
        toId: targetNode.id.toString(),
        newEdgeId: curveEdgeId,
      });

      this.updateElementAttribute({
        elementType: 'edge',
        id: curveEdgeId,
        attributeName: 'curve_type',
        value: payload.curve,
      });
    }
  }

  private geometryFromReferenceNode(
    referenceNode: SchematicNode,
    direction: string,
    relativeDistance: number,
  ): Position {
    switch (direction) {
      case 'left':
        return { x: referenceNode.geometry.x - relativeDistance, y: referenceNode.geometry.y };
      case 'right':
        return { x: referenceNode.geometry.x + relativeDistance, y: referenceNode.geometry.y };
      case 'top':
        return { x: referenceNode.geometry.x, y: referenceNode.geometry.y - relativeDistance };
      case 'bottom':
        return { x: referenceNode.geometry.x, y: referenceNode.geometry.y + relativeDistance };
      default:
        return { x: 0, y: 0 };
    }
  }

  private edgeFromToPredicate(edge: SchematicEdge, fromId: string, toId: string) {
    return (edge.fromID === +fromId && edge.toID === +toId) || (edge.fromID === +toId && edge.toID === +fromId);
  }

  private setElementAttrib(element: SchematicNode | SchematicEdge, attribName: string, attribValue: string) {
    const newAttrib = Object.create({});
    newAttrib[attribName] = attribValue;
    element.attributes = { ...element.attributes, ...newAttrib };
  }
}

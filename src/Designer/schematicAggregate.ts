import { Commands, Direction, Payload } from './commands.ts';
import {
  Position,
  SchematicEdge,
  SchematicJsonData,
  SchematicNode,
} from '../RiverSchematicsV2/components/RiverSchematic/RiverSchematic.interfaces.ts';
import { SchematicUtils } from './utils/schematicUtils.ts';

export interface SchematicUpdated {
  data: SchematicJsonData | undefined;
}

export class AggregateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AggregateError';
  }
}

export class SchematicAggregate implements Commands {
  private events: SchematicUpdated[] = [];
  private data: SchematicJsonData | undefined = undefined;
  private readonly NoDataMessage = 'No schematic loaded or created';

  get lastEvent() {
    if (this.events.length === 0) return undefined;
    return this.events[this.events.length - 1];
  }

  raiseUpdatedEvent() {
    if (this.data) this.events.push({ data: structuredClone(this.data) });
  }

  undo() {
    const popped = this.events.pop();
    if (popped === undefined) throw new AggregateError('Nothing left to undo');
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

  addJunctionNodeRelative(payload: Payload.AddJunctionNodeRelative) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const referenceNode = this.data.nodes.find((n) => n.id === +payload.refNodeId);
    if (!referenceNode) throw new AggregateError(`Reference node with id ${payload.refNodeId} not found`);
    const newJunctionGeometry = this.geometryFromReferenceNode(referenceNode, payload.direction, +payload.distance);
    const newNodeId = payload.newNodeId ?? SchematicUtils.getNextAvailableId(this.data).toString();
    const newJunctionNode = this.createJunctionNode(newNodeId, newJunctionGeometry, payload.junctionDesc);
    this.addNode(newJunctionNode);
  }

  addNode(payload: Payload.AddNode) {
    this.data?.nodes.push(payload);
  }

  addEdge(payload: Payload.AddEdge) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const nextAvailableId = payload.newEdgeId ? +payload.newEdgeId : SchematicUtils.getNextAvailableId(this.data);
    this.data?.edges.push({
      id: nextAvailableId,
      fromID: +payload.fromId,
      toID: +payload.toId,
    });
  }

  updateEdgeCurve(payload: Payload.UpdateEdgeCurve) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const sourceNode = this.data.nodes.find((n) => n.id === +payload.fromId);
    const targetNode = this.data.nodes.find((n) => n.id === +payload.toId);
    const horizontalEdge = this.data.edges.find((e) => this.edgeFromToPredicate(e, payload.fromId, payload.toId));
    if (!sourceNode) throw new AggregateError(`Source node with id ${payload.fromId} not found`);
    if (!targetNode) throw new AggregateError(`Target node with id ${payload.toId} not found`);
    if (!horizontalEdge) throw new AggregateError(`Edge with fromId ${payload.fromId}, toId ${payload.toId} not found`);

    const normalHeight = 100;
    const junctionOffsetX = 30;
    const nextAvailableId = SchematicUtils.getNextAvailableId(this.data);

    // Handle Short Curve
    if (Math.abs(targetNode.geometry.y - sourceNode.geometry.y) <= normalHeight) {
      const junctionNodeId = nextAvailableId;
      const junctionDistance = Math.abs(targetNode.geometry.x - sourceNode.geometry.x) - junctionOffsetX;
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
        id: curveEdgeId,
        attributeName: 'curve_type',
        value: payload.curve,
      });
      return;
    }

    // Handle Long curve
    const junctionCloserToSourceId = nextAvailableId;
    const junctionCloserToTargetId = junctionCloserToSourceId + 1;
    const newSourceEdgeId = junctionCloserToSourceId + 2;
    const newCurvedEdgeId = junctionCloserToSourceId + 3;
    const isTargetDown = targetNode.geometry.y < sourceNode.geometry.y;
    const isTargetRight = targetNode.geometry.x > sourceNode.geometry.x;

    horizontalEdge.fromID = junctionCloserToTargetId;
    horizontalEdge.toID = targetNode.id;

    this.addNode(
      this.createJunctionNode(junctionCloserToSourceId.toString(), {
        x: sourceNode.geometry.x,
        y: isTargetDown ? targetNode.geometry.y + normalHeight : targetNode.geometry.y - normalHeight,
      }),
    );

    this.addNode(
      this.createJunctionNode(junctionCloserToTargetId.toString(), {
        x: isTargetRight ? sourceNode.geometry.x + junctionOffsetX : sourceNode.geometry.x - junctionOffsetX,
        y: targetNode.geometry.y,
      }),
    );

    this.addEdge({
      fromId: sourceNode.id.toString(),
      toId: junctionCloserToSourceId.toString(),
      newEdgeId: newSourceEdgeId.toString(),
    });

    this.addEdge({
      fromId: junctionCloserToSourceId.toString(),
      toId: junctionCloserToTargetId.toString(),
      newEdgeId: newCurvedEdgeId.toString(),
    });

    this.updateElementAttribute({
      id: newCurvedEdgeId.toString(),
      attributeName: 'curve_type',
      value: payload.curve,
    });
  }

  deleteEdge(payload: Payload.DeleteEdge) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const deleteIndex = this.data.edges.findIndex((e) => this.edgeFromToPredicate(e, payload.fromId, payload.toId));
    if (deleteIndex < 0) throw new AggregateError(`Edge with fromId ${payload.fromId}, toId ${payload.toId} not found`);
    return this.data.edges.splice(deleteIndex, 1)?.[0];
  }

  updateElementAttribute(payload: Payload.UpdateElementAttribute) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const element = this.findElementWithId(payload.id);
    const final = element.node ?? element.edge;
    if (!final) throw new AggregateError(`A node or edge with id ${payload.id} not found`);
    this.setElementAttrib(final, payload.attributeName, payload.value);
  }

  moveLabel(payload: Payload.MoveLabel) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const element = this.findElementWithId(payload.id);
    const final = element.node ?? element.edge;
    if (!final) throw new AggregateError(`A node or edge with id ${payload.id} not found`);
    this.updateElementAttribute({
      id: final.id.toString(),
      attributeName: payload.direction === 'left' || payload.direction === 'right' ? 'label_margin_x' : 'label_margin_y',
      value: payload.direction === 'left' || payload.direction === 'up' ? `-${payload.distance}` : payload.distance,
    });
  }

  private geometryFromReferenceNode(referenceNode: SchematicNode, direction: Direction, relativeDistance: number): Position {
    switch (direction) {
      case 'left':
        return { x: referenceNode.geometry.x - relativeDistance, y: referenceNode.geometry.y };
      case 'right':
        return { x: referenceNode.geometry.x + relativeDistance, y: referenceNode.geometry.y };
      case 'up':
        return { x: referenceNode.geometry.x, y: referenceNode.geometry.y + relativeDistance };
      case 'down':
        return { x: referenceNode.geometry.x, y: referenceNode.geometry.y - relativeDistance };
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

  private findElementWithId(id: string): { node?: SchematicNode; edge?: SchematicEdge } {
    const nodeElement = this.data?.nodes.find((n) => n.id === +id);
    const edgeElement = this.data?.edges.find((e) => e.id === +id);
    return { node: nodeElement, edge: edgeElement };
  }

  private createJunctionNode(id: string, geometry: Position, junctionDesc?: string): SchematicNode {
    return {
      id: +id,
      feature_type: 'Junction',
      feature_label: '',
      geometry: geometry,
      attributes: {
        junction_description: junctionDesc ?? '',
      },
    };
  }
}

import { Commands, Direction, Payload } from './commands.ts';
import { SchematicUtils } from './utils/schematicUtils.ts';
import {
  Position,
  SchematicEdge,
  SchematicJsonData,
  SchematicNode,
  riverSizeMap,
  riverTypeMap,
  Types,
  NodeAttributes,
  RiverGaugeAttributes,
  JunctionAttributes,
  CurrentRiverGaugeDetails,
  StorageAttributes,
  CurrentStorageDetails,
  TownAttributes,
  WetlandAttributes,
} from '../RiverSchematicsV2/components/RiverSchematic/RiverSchematic.interfaces.ts';

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
    this.data = { catchmentId: payload.catchmentId, nodes: [], edges: [] };
  }

  loadSchematic(payload: Payload.LoadSchematic) {
    this.events = [];
    this.data = JSON.parse(payload.fileJson);
  }

  addNode(payload: Payload.AddNode) {
    this.data?.nodes.push(payload);
  }

  addJunctionNode(payload: Payload.AddJunctionNode) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const newNodeId = SchematicUtils.getNextAvailableId(this.data).toString();
    const newJunctionNode = this.createNewNode(newNodeId, 'Junction', '', { x: +payload.x, y: +payload.y }, {} as JunctionAttributes);
    this.addNode(newJunctionNode);
  }

  addJunctionNodeRelative(payload: Payload.AddJunctionNodeRelative) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const referenceNode = this.data.nodes.find((n) => n.id === +payload.refNodeId);
    if (!referenceNode) throw new AggregateError(`Reference node with id ${payload.refNodeId} not found`);
    const newJunctionGeometry = this.geometryFromReferenceNode(referenceNode, payload.direction, +payload.distance);
    const newNodeId = payload.newNodeId ?? SchematicUtils.getNextAvailableId(this.data).toString();
    this.addNode(
      this.createNewNode(newNodeId, 'Junction', '', newJunctionGeometry, {
        junction_description: payload.junctionDesc ?? '',
      }),
    );
  }

  addRiverGaugeNodeRelative(payload: Payload.AddRiverGaugeNodeRelative) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const referenceNode = this.data.nodes.find((n) => n.id === +payload.refNodeId);
    if (!referenceNode) throw new AggregateError(`Reference node with id ${payload.refNodeId} not found`);
    const newNodeId = payload.newNodeId ?? SchematicUtils.getNextAvailableId(this.data).toString();
    const newNodeGeometry = this.geometryFromReferenceNode(referenceNode, payload.direction, +payload.distance);
    const newNode = this.createNewNode(newNodeId, 'Rivergauge', '', newNodeGeometry, { gauge_id: payload.gaugeId } as RiverGaugeAttributes);
    newNode.current = {
      watercourseLevel: 999,
      watercourseDischarge: 999,
    } as CurrentRiverGaugeDetails;
    this.addNode(newNode);
  }

  addStorageNodeRelative(payload: Payload.AddStorageNodeRelative) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const referenceNode = this.data.nodes.find((n) => n.id === +payload.refNodeId);
    if (!referenceNode) throw new AggregateError(`Reference node with id ${payload.refNodeId} not found`);
    const newNodeId = payload.newNodeId ?? SchematicUtils.getNextAvailableId(this.data).toString();
    const newNodeGeometry = this.geometryFromReferenceNode(referenceNode, payload.direction, +payload.distance);
    const newNode = this.createNewNode(newNodeId, 'Storage', payload.storageName, newNodeGeometry, {
      storage_id: +payload.storageId,
    } as StorageAttributes);
    newNode.current = {
      percentage_full_now: 99,
      volume_total: 999,
    } as CurrentStorageDetails;
    this.addNode(newNode);
  }

  addTownNodeRelative(payload: Payload.AddTownNodeRelative) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const referenceNode = this.data.nodes.find((n) => n.id === +payload.refNodeId);
    if (!referenceNode) throw new AggregateError(`Reference node with id ${payload.refNodeId} not found`);
    const newNodeId = payload.newNodeId ?? SchematicUtils.getNextAvailableId(this.data).toString();
    const newNodeGeometry = this.geometryFromReferenceNode(referenceNode, payload.direction, +payload.distance);
    const newNode = this.createNewNode(newNodeId, 'Town', payload.townName, newNodeGeometry, {
      town_name: payload.townName,
    } as TownAttributes);
    this.addNode(newNode);
  }

  addWetlandNodeRelative(payload: Payload.AddWetlandNodeRelative) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const referenceNode = this.data.nodes.find((n) => n.id === +payload.refNodeId);
    if (!referenceNode) throw new AggregateError(`Reference node with id ${payload.refNodeId} not found`);
    const newNodeId = payload.newNodeId ?? SchematicUtils.getNextAvailableId(this.data).toString();
    const newNodeGeometry = this.geometryFromReferenceNode(referenceNode, payload.direction, +payload.distance);
    const newNode = this.createNewNode(newNodeId, 'Wetland', payload.wetlandName, newNodeGeometry, {
      wetland_name: payload.wetlandName,
    } as WetlandAttributes);
    this.addNode(newNode);
  }

  addEdge(payload: Payload.AddEdge) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const nextAvailableId = payload.newEdgeId ? +payload.newEdgeId : SchematicUtils.getNextAvailableId(this.data);
    const lastEdgeAttributes = this.data.edges.length > 0 ? this.data.edges[this.data.edges.length - 1]?.attributes : undefined;
    const newEdge: SchematicEdge = {
      id: nextAvailableId,
      fromID: +payload.fromId,
      toID: +payload.toId,
    };
    this.data?.edges.push(newEdge);
    if (lastEdgeAttributes) {
      this.setElementAttrib(newEdge, 'river_size', lastEdgeAttributes.river_size);
      this.setElementAttrib(newEdge, 'river_type', lastEdgeAttributes.river_type);
    }
  }

  deleteEdge(payload: Payload.DeleteEdge) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const deleteIndex = this.data.edges.findIndex((e) => e.id === +payload.edgeId);
    if (deleteIndex < 0) throw new AggregateError(`Edge with Id ${payload.edgeId} not found`);
    return this.data.edges.splice(deleteIndex, 1)?.[0];
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

      this.setElementAttribById(curveEdgeId, 'curve_type', payload.curve);
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

    const junctionCloserToSrc = this.createNewNode(
      junctionCloserToSourceId.toString(),
      'Junction',
      '',
      {
        x: sourceNode.geometry.x,
        y: isTargetDown ? targetNode.geometry.y + normalHeight : targetNode.geometry.y - normalHeight,
      },
      {} as JunctionAttributes,
    );

    const junctionCloserToTarget = this.createNewNode(
      junctionCloserToTargetId.toString(),
      'Junction',
      '',
      {
        x: isTargetRight ? sourceNode.geometry.x + junctionOffsetX : sourceNode.geometry.x - junctionOffsetX,
        y: targetNode.geometry.y,
      },
      {} as JunctionAttributes,
    );

    this.addNode(junctionCloserToSrc);
    this.addNode(junctionCloserToTarget);

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

    this.setElementAttribById(newCurvedEdgeId.toString(), 'curve_type', payload.curve);
  }

  updateEdgeLabel(payload: Payload.UpdateEdgeLabel) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const edge = this.data.edges.find((e) => e.id === +payload.edgeId);
    if (!edge) throw new AggregateError(`Edge with id ${payload.edgeId} not found`);
    edge.feature_type = 'River';
    this.setElementAttrib(edge, 'river_name', payload.newLabel);
    this.setElementAttrib(edge, 'segment_no', 1);
  }

  updateEdgeLine(payload: Payload.UpdateEdgeLine) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    const edge = this.data.edges.find((e) => e.id === +payload.edgeId);
    if (!edge) throw new AggregateError(`Edge with id ${payload.edgeId} not found`);
    if (payload.lineType === 'major river' || payload.lineType === 'tributary') {
      const riverSizeValue = this.getKeyByValue(riverSizeMap, payload.lineType);
      if (riverSizeValue) this.setElementAttrib(edge, 'river_size', riverSizeValue);
      this.setElementAttrib(edge, 'river_type', '');
      return;
    }
    if (payload.lineType === 'ephemeral') {
      const riverTypeValue = this.getKeyByValue(riverTypeMap, payload.lineType);
      const riverSizeValue = this.getKeyByValue(riverSizeMap, 'tributary');
      if (riverTypeValue) this.setElementAttrib(edge, 'river_type', riverTypeValue);
      if (riverSizeValue) this.setElementAttrib(edge, 'river_size', riverSizeValue);
      return;
    }
  }

  moveLabel(payload: Payload.MoveLabel) {
    if (!this.data) throw new AggregateError(this.NoDataMessage);
    this.setElementAttribById(
      payload.id,
      payload.direction === 'left' || payload.direction === 'right' ? 'label_margin_x' : 'label_margin_y',
      payload.direction === 'left' || payload.direction === 'up' ? `-${payload.distance}` : payload.distance,
    );
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

  private setElementAttribById(id: string, attribName: string, attribValue: string | number | boolean) {
    const element = this.findElementWithId(id);
    const final = element.node ?? element.edge;
    if (!final) throw new AggregateError(`A node or edge with id ${id} not found`);
    this.setElementAttrib(final, attribName, attribValue);
  }

  private setElementAttrib(element: SchematicNode | SchematicEdge, attribName: string, attribValue: string | number | boolean) {
    const newAttrib = Object.create({});
    newAttrib[attribName] = attribValue;
    element.attributes = { ...element.attributes, ...newAttrib };
  }

  private findElementWithId(id: string): { node?: SchematicNode; edge?: SchematicEdge } {
    const nodeElement = this.data?.nodes.find((n) => n.id === +id);
    const edgeElement = this.data?.edges.find((e) => e.id === +id);
    return { node: nodeElement, edge: edgeElement };
  }

  private createNewNode<T extends NodeAttributes>(
    id: string,
    featureType: Types.NodeFeatureType,
    featureLabel: string,
    geometry: Position,
    attribs: T,
  ): SchematicNode {
    return {
      id: +id,
      feature_type: featureType,
      feature_label: featureLabel,
      geometry: geometry,
      attributes: attribs,
    };
  }

  private getKeyByValue<K, V>(map: Map<K, V>, value: V) {
    return [...map.entries()].find(([, v]) => v === value)?.[0];
  }
}

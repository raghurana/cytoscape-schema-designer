import { SchematicEdge } from '../../../components/RiverSchematic/RiverSchematic.interfaces.ts';

export function curvePositionTransformer(edge: SchematicEdge): SchematicEdge {
  const edgeAttribs = edge.attributes;
  if (!edgeAttribs) return edge;
  if (edge.ui_hints) edge.ui_hints.curve_position = edgeAttribs.curve_type;
  return edge;
}

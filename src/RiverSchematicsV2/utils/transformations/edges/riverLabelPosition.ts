import { SchematicEdge } from '../../../components/RiverSchematic/RiverSchematic.interfaces';

export function riverLabelPositionTransformer(edge: SchematicEdge): SchematicEdge {
  if (!edge.ui_hints) return edge;
  if (edge.feature_type !== 'River') return edge;
  const riverAttribs = edge.attributes;
  if (riverAttribs?.label_margin_x) edge.ui_hints.label_margin_x = riverAttribs.label_margin_x;
  if (riverAttribs?.label_margin_y) edge.ui_hints.label_margin_y = riverAttribs.label_margin_y;
  return edge;
}

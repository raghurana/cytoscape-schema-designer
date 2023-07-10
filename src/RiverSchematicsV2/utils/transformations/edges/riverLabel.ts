import { SchematicEdge, Types } from '../../../components/RiverSchematic/RiverSchematic.interfaces.ts';

export function riverLabelTransformer(edge: SchematicEdge, options?: Types.GraphOptions): SchematicEdge {
  if (edge.feature_type !== 'River') return edge;
  const riverAttribs = edge.attributes;
  if (!riverAttribs?.segment_no) return edge;
  if (edge.ui_hints) {
    let extraLabel;
    if (options?.designerSettings?.edges?.appendToLabel === 'none') extraLabel = '';
    else if (options?.designerSettings?.edges?.appendToLabel === 'id') extraLabel = ` [${edge.id}]`;
    edge.ui_hints.label = riverAttribs.segment_no === 1 ? `${riverAttribs.river_name} ${extraLabel}` : '';
  }
  return edge;
}

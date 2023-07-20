import { SchematicEdge, Types } from '../../../components/RiverSchematic/RiverSchematic.interfaces.ts';

export function riverLabelTransformer(edge: SchematicEdge, options?: Types.GraphOptions): SchematicEdge {
  if (!edge.ui_hints) return edge;

  let extraLabel;
  if (options?.designerSettings?.edges?.appendToLabel === 'none') extraLabel = '';
  if (options?.designerSettings?.edges?.appendToLabel === 'id') extraLabel = ` [${edge.id}]`;

  // For legacy compatibility
  if (edge.feature_type === 'River' && edge.attributes?.segment_no) {
    const riverAttribs = edge.attributes;
    edge.ui_hints.label = +riverAttribs.segment_no === 1 ? `${riverAttribs.river_name} ${extraLabel}` : `${extraLabel}`;
    return edge;
  }

  edge.ui_hints.label = `${extraLabel}`;
  return edge;
}

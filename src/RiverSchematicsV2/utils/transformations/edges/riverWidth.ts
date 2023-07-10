import { SchematicEdge } from '../../../components/RiverSchematic/RiverSchematic.interfaces.ts';

const riverSizeToWidthMap = new Map<number, number>();
riverSizeToWidthMap.set(1, 10);

const defaultEdgeWidth = 4;

export function riverWidthTransformer(node: SchematicEdge): SchematicEdge {
  if (!node.ui_hints) return node;

  node.ui_hints.width = defaultEdgeWidth;
  const riverAttribs = node.attributes;
  if (riverAttribs?.river_size) {
    node.ui_hints.width = riverSizeToWidthMap.get(riverAttribs.river_size) ?? defaultEdgeWidth;
  }

  if (riverAttribs?.river_type === 2) {
    node.ui_hints.width = defaultEdgeWidth;
    node.ui_hints.line_style = 'dashed';
    node.ui_hints.line_dash_pattern = [1, 7];
  }

  return node;
}

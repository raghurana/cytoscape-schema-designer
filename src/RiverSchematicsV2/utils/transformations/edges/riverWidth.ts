import { SchematicEdge, Types, riverSizeMap, riverTypeMap } from '../../../components/RiverSchematic/RiverSchematic.interfaces.ts';

const defaultEdgeWidth = 4;

const widthMapByRiverSize = new Map<Types.RiverSize, number>();
widthMapByRiverSize.set('major river', 10);
widthMapByRiverSize.set('tributary', defaultEdgeWidth);

export function riverWidthTransformer(node: SchematicEdge): SchematicEdge {
  if (!node.ui_hints) return node;
  const riverAttribs = node.attributes;
  const riverSize = riverAttribs ? riverSizeMap.get(riverAttribs.river_size) : undefined;
  const riverType = riverAttribs ? riverTypeMap.get(riverAttribs.river_type) : undefined;
  node.ui_hints.width = riverSize ? widthMapByRiverSize.get(riverSize) : defaultEdgeWidth;
  if (riverType === 'ephemeral') {
    node.ui_hints.line_style = 'dashed';
    node.ui_hints.line_dash_pattern = [1, 7];
  }
  return node;
}

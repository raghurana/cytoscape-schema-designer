import { SchematicNode, TownAttributes } from '../../../components/RiverSchematic/RiverSchematic.interfaces';

export function townLabelPositionTransformer(node: SchematicNode): SchematicNode {
  if (!node.ui_hints) return node;
  if (node.feature_type !== 'Town') return node;
  const townAttribs = node.attributes as TownAttributes;
  if (!townAttribs) return node;
  if (townAttribs.label_margin_x) node.ui_hints.label_margin_x = townAttribs.label_margin_x;
  if (townAttribs.label_margin_y) node.ui_hints.label_margin_y = townAttribs.label_margin_y;
  return node;
}

import { SchematicNode, Types } from '../../../components/RiverSchematic/RiverSchematic.interfaces.ts';
import { CytoUtils } from '../../cytoUtils.ts';
import { featureLabelTransformer } from './featureLabel.ts';
import { townLabelPositionTransformer } from './townLabelPosition.ts';

type TransformerFn = (edge: SchematicNode, options?: Types.GraphOptions) => SchematicNode;

const cytoTransformers: TransformerFn[] = [featureLabelTransformer, townLabelPositionTransformer];

export const NodeTransformers = {
  transform: (nodes: SchematicNode[], options?: Types.GraphOptions) => {
    return nodes.map((node) => {
      node.ui_hints = node.ui_hints ?? {};
      const transformed = cytoTransformers.reduce((acc, transformerFn) => transformerFn(acc, options), node);
      return CytoUtils.conversion.toCytoNode(transformed);
    });
  },
};

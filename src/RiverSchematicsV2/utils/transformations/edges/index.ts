import { ElementDefinition } from 'cytoscape';
import { SchematicEdge, Types } from '../../../components/RiverSchematic/RiverSchematic.interfaces.ts';
import { CytoUtils } from '../../cytoUtils.ts';
import { riverLabelTransformer } from './riverLabel.ts';
import { riverWidthTransformer } from './riverWidth.ts';
import { curvePositionTransformer } from './curvePosition.ts';
import { riverLabelPositionTransformer } from './riverLabelPosition.ts';

type TransformerFn = (edge: SchematicEdge, options?: Types.GraphOptions) => SchematicEdge;

const transformers: TransformerFn[] = [
  riverWidthTransformer,
  riverLabelTransformer,
  riverLabelPositionTransformer,
  curvePositionTransformer,
];

export const EdgeTransformers = {
  transform: (edges: SchematicEdge[], options?: Types.GraphOptions): ElementDefinition[] => {
    return edges.map((edge) => {
      edge.ui_hints = edge.ui_hints ?? {};
      const transformed = transformers.reduce((acc, fn) => fn(acc, options), edge);
      // If after all transformations, the label is still empty, set it to an empty string
      // or else cytoscape will throw warnings about it
      if (!transformed.ui_hints?.label) edge.ui_hints.label = '';
      return CytoUtils.conversion.toCytoEdge(transformed);
    });
  },
};

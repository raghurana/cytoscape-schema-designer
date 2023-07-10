import { useMemo } from 'react';
import { SchematicJsonData, Types } from '../components/RiverSchematic/RiverSchematic.interfaces.ts';
import { EdgeTransformers, NodeTransformers } from '../utils/index.ts';

interface Props {
  riverData: SchematicJsonData | undefined;
  graphOptions: Types.GraphOptions;
}

export const useRiverDataTransformed = (props: Props) => {
  const { riverData, graphOptions: options } = props;

  const cytoNodes = useMemo(() => {
    const originalNodes = riverData?.nodes ?? [];
    const transformedNodes = NodeTransformers.transform(originalNodes, options);
    return { originalNodes, transformedNodes };
  }, [riverData, options]);

  const cytoEdges = useMemo(() => {
    const edges = riverData?.edges ?? [];
    return EdgeTransformers.transform(edges, options);
  }, [riverData, options]);

  return {
    originalNodes: cytoNodes.originalNodes,
    elements: {
      nodes: cytoNodes.transformedNodes,
      edges: cytoEdges,
    },
  };
};

import { useEffect, useMemo, useRef } from 'react';
import { Types } from '../components/RiverSchematic/RiverSchematic.interfaces';
import { CytoUtils } from '../utils/index.ts';

interface Props {
  cytoscape: cytoscape.Core | null;
  elements: {
    nodes: cytoscape.ElementDefinition[];
    edges: cytoscape.ElementDefinition[];
  };
}

export const supportedFeatures: Types.SpecialFeature[] = ['Storage', 'Rivergauge', 'Wetland'];

export const cloneIdPrefix = 'clone-';

export const useRenderElements = (props: Props) => {
  const { cytoscape: cy } = props;
  const { nodes, edges } = props.elements;
  const featureNodes = useMemo(() => createClonedFeatureNodes(nodes), [nodes]);
  const featurePillRefs = useRef(new Map<string, React.RefObject<HTMLDivElement>>());

  useEffect(() => {
    if (!cy) return;
    if (nodes.length === 0) return;

    nodes.forEach((node) => cy.add(node));
    edges.forEach((edge) => {
      const edgeId = edge.data.id;
      if (!edgeId) return;
      if (cy.getElementById(edgeId).empty()) cy.add(edge);
    });
    featureNodes.forEach((node) => {
      if (node.data.id)
        cy.add({
          ...node,
          data: {
            ...node.data,
            dom: featurePillRefs.current.get(node.data.id)?.current,
          },
        });
    });

    return () => {
      cy.elements().remove();
    };
  }, [cy, nodes, edges, featureNodes]);

  return { featureNodes, featurePillRefs };
};
const createClonedFeatureNodes = (nodes: cytoscape.ElementDefinition[]) =>
  nodes
    .filter((node) => supportedFeatures.includes(node.data.type))
    .map((node) => CytoUtils.conversion.cloneCytoNode(node, `${cloneIdPrefix}${node.data.id}`));

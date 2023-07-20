import React, { useCallback } from 'react';
import cytoscape from 'cytoscape';
import { FeaturePillNode } from '../FeaturePillNode/FeaturePillNode.component';
import { useRiverSchematicStore } from '../RiverSchematic/RiverSchematic.store';
import { CommonUtils } from '../../utils';
import { Types } from '../RiverSchematic/RiverSchematic.interfaces';

export interface FeaturesProps {
  nodeDefinitions: cytoscape.ElementDefinition[];
  nodeDomReferences: React.MutableRefObject<Map<string, React.RefObject<HTMLDivElement>>>;
  nodeIdPrefix: string;
  featureClickHandler: (id: string) => void;
}

export const Features: React.FC<FeaturesProps> = ({ nodeDefinitions, nodeDomReferences, featureClickHandler, nodeIdPrefix }) => {
  const featureCard = useRiverSchematicStore((s) => s.uiFeatureCard);

  const handlePillClick = useCallback(
    (id: string) => featureClickHandler(CommonUtils.Text.stripPrefix(id, nodeIdPrefix)),
    [featureClickHandler, nodeIdPrefix],
  );

  nodeDomReferences.current.forEach((pillRef) => pillRef.current?.parentNode?.removeChild(pillRef.current));

  return (
    <div>
      {nodeDefinitions.map((featureNode) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nodeId = featureNode.data.id!;
        if (!nodeDomReferences.current.has(nodeId)) nodeDomReferences.current.set(nodeId, React.createRef<HTMLDivElement>());

        const originalNodeId = CommonUtils.Text.stripPrefix(nodeId, nodeIdPrefix);
        return (
          <div key={featureNode.data.id}>
            <div ref={nodeDomReferences.current.get(nodeId)}>
              <FeaturePillNode
                id={nodeId}
                featureType={featureNode.data.type as Types.SpecialFeature}
                content={featureNode.data.featureLabel}
                onClick={handlePillClick}
                selected={originalNodeId === featureCard?.selectedFeature?.nodeId}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

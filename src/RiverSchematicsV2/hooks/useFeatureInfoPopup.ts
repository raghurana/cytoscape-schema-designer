import { useCallback } from 'react';
import { SchematicNode } from '../components/RiverSchematic/RiverSchematic.interfaces';

interface Props {
  nodes: SchematicNode[];
}

export const useFeatureInfoPopup = (props: Props) => {
  const { nodes } = props;

  const handleFeatureClick = useCallback(
    (id: string) => {
      const selectedNode = nodes.find((node) => node.id.toString() === id);
      if (selectedNode) {
        alert(
          `[${selectedNode.id}] - ${JSON.stringify({
            x: selectedNode.geometry.x,
            y: selectedNode.geometry.y,
          })}`,
        );
      }
    },
    [nodes],
  );

  const handleCloseClick = useCallback(() => {
    console.log('not implemented');
  }, []);

  return { handleFeatureClick, handleCloseClick };
};

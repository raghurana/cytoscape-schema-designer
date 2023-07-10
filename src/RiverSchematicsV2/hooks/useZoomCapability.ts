import { useCallback, useEffect } from 'react';
import cytoscape from 'cytoscape';
import { useRiverSchematicStore } from '../components/RiverSchematic/RiverSchematic.store';
import { CytoUtils } from '../utils';

export const useZoomCapability = (cy: cytoscape.Core | null, zoomStep: number) => {
  const zoomState = useRiverSchematicStore((s) => s.uiZoom);
  const { setZoomInfo } = zoomState;

  useEffect(() => {
    if (!cy) return;
    const onGraphZoom = () => {
      setZoomInfo(cy.zoom(), cy.minZoom(), cy.maxZoom());
    };

    cy.on('zoom', onGraphZoom);
    return () => {
      cy.off('zoom', onGraphZoom);
    };
  }, [cy, setZoomInfo]);

  const handleZoomButtonClick = useCallback(
    (mode: 'in' | 'out') => CytoUtils.zooming.centeredZoom(cy, mode, zoomStep),
    [cy, zoomStep],
  );

  return { zoomState, handleZoomButtonClick };
};

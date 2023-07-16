import { useEffect, useState } from 'react';
import Cytoscape from 'cytoscape';
import CyDomNode from 'cytoscape-dom-node';
import { Types } from '../components/RiverSchematic/RiverSchematic.interfaces';
import { useRiverSchematicStore } from '../components/RiverSchematic/RiverSchematic.store';
import { CytoUtils } from '../utils';

Cytoscape.use(CyDomNode);

type CytoscapeExtended = cytoscape.Core & { domNode: () => void };

export const useCytoscape = (containerRef: React.RefObject<HTMLElement>, graphOptions: Types.GraphOptions) => {
  const [cy, setCy] = useState<cytoscape.Core | null>(null);
  const setSelectedFeature = useRiverSchematicStore((s) => s.uiFeatureCard.setSelectedFeature);

  useEffect(() => {
    if (!containerRef.current) return;

    const cytoInstance = Cytoscape({
      autolock: true,
      style: CytoUtils.styling.getDefaultNetworkStyles(graphOptions),
      container: containerRef.current,
      minZoom: graphOptions.minZoom,
      maxZoom: graphOptions.maxZoom,
      userZoomingEnabled: false, // Disabling default mouse wheel zooming behavior
    });

    // https://www.npmjs.com/package/cytoscape-dom-node
    const cytoDom = cytoInstance as CytoscapeExtended;
    cytoDom.domNode();

    const clickHandler = (event?: MouseEvent) => {
      if (event) {
        // Only set selected feature to null when clicked on canvas and not on a cyto node
        const targetTag = (event.target as HTMLElement).tagName.toLowerCase();
        if (targetTag === 'canvas') setSelectedFeature(null);
        return;
      }
      // If no event info is present, then we must be switching between catchments
      setSelectedFeature(null);
    };

    const mouseWheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      const zoomMode = e.deltaY > 0 ? 'out' : 'in';
      CytoUtils.zooming.centeredZoom(cytoInstance, zoomMode, graphOptions.zoomStep);
    };

    clickHandler();
    setCy(cytoInstance);

    const containerDomElement = containerRef.current;
    containerDomElement.addEventListener('click', clickHandler);
    containerDomElement.addEventListener('wheel', mouseWheelHandler);
    return () => {
      containerDomElement.removeEventListener('wheel', mouseWheelHandler);
      containerDomElement.removeEventListener('click', clickHandler);
      cytoInstance.destroy();
    };
  }, [containerRef, graphOptions, setSelectedFeature]);

  return cy;
};

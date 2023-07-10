import { useEffect } from 'react';
import { SchematicPan, SchematicPanExtent, Types } from '../components/RiverSchematic/RiverSchematic.interfaces';
import { useRiverSchematicStore } from '../components/RiverSchematic/RiverSchematic.store';
import { CytoUtils } from '../utils';

export const usePanLimits = (cy: cytoscape.Core | null, graphOptions: Types.GraphOptions) => {
  const { panLimitPadding } = graphOptions;
  const { panLimits, outsidePanLimits, panLimitsActive, setCurrPan, setPanLimits, setPanLimitsActive } =
    useRiverSchematicStore((s) => s.uiPan);

  useEffect(() => {
    if (!cy) return;

    let programmaticPan = false;

    const onPan = () => {
      if (!panLimitsActive) return;
      if (!programmaticPan && panLimits && outsidePanLimits) {
        programmaticPan = true;
        cy.pan(clampPan(cy.pan(), panLimits));
      } else {
        setCurrPan(cy.pan());
      }
    };

    const onResize = () => {
      setPanLimits(CytoUtils.panning.toPanLimits(cy, panLimitPadding * cy.zoom()));
      setCurrPan(cy.pan());
    };

    const onViewportChange = () => (programmaticPan = false);

    cy.on('pan', onPan);
    cy.on('resize', onResize);
    cy.on('zoom', onResize);
    cy.on('viewport', onViewportChange);
    return () => {
      cy.off('resize', onResize);
      cy.off('pan', onPan);
      cy.off('zoom', onResize);
      cy.off('viewport', onViewportChange);
    };
  }, [cy, panLimitsActive, panLimits, outsidePanLimits, panLimitPadding, setCurrPan, setPanLimits]);

  return { panLimitsActive, setPanLimitsActive };
};

const clampPan = (pan: SchematicPan, limit: SchematicPanExtent) => {
  return {
    x: clamp(pan.x, limit.xMin, limit.xMax),
    y: clamp(pan.y, limit.yMin, limit.yMax),
  };
};

const clamp = (current: number, min: number, max: number) => Math.min(Math.max(current, min), max);

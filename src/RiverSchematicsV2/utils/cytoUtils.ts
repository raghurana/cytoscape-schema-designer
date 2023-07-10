import cytoscape, { ElementDefinition, Stylesheet } from 'cytoscape';
import {
  SchematicEdge,
  SchematicNode,
  SchematicPanExtent,
} from '../components/RiverSchematic/RiverSchematic.interfaces.ts';

export const CytoUtils = {
  conversion: {
    toCytoNode: (node: SchematicNode, scaleOptions = { scaleFactor: 0.5, xFactor: 3.5 }): ElementDefinition => {
      return {
        data: {
          id: node.id.toString(),
          label: node.ui_hints?.label ?? '',
          featureLabel: node.ui_hints?.feature_label ?? node.feature_label ?? '',
          type: node.feature_type,
          ui_hints: node.ui_hints,
        },
        position: {
          x: node.geometry.x * scaleOptions.scaleFactor * scaleOptions.xFactor,
          y: node.geometry.y * -scaleOptions.scaleFactor,
        },
      };
    },
    toCytoEdge: (edge: SchematicEdge): ElementDefinition => {
      const { id, fromID, toID, ui_hints } = edge;
      return {
        data: {
          id: id.toString(),
          source: fromID.toString(),
          target: toID.toString(),
          ui_hints,
        },
      };
    },
    cloneCytoNode: (node: ElementDefinition, newNodeId: string): ElementDefinition => {
      return {
        group: 'nodes',
        data: Object.assign({}, node.data, { id: newNodeId }), // Copy the data of the existing node, but set a new id
        style: node.style, // Copy the style of the existing node
        position: node.position, // Copy the position of the existing node
      };
    },
  },
  styling: {
    colors: {
      ElectricBlue: '#2461E5', // Storage and river gauge nodes, plus river edges
      DarkGreen: '#164D39', // Wetland nodes
      CharcoalDark: '#1E1E1E', // Text
      GreyLight: '#F5F5F5', // Background
      GreyMedium: '#DEDEDE', // Border background
      BrightRed: '#FF0000', // Border limit reached
    },
    getDefaultNetworkStyles: (): Stylesheet[] => {
      return [
        // ==============================================================================
        // Default node styles
        // ==============================================================================
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            color: CytoUtils.styling.colors.CharcoalDark,
            'background-color': CytoUtils.styling.colors.GreyLight,
            'font-size': '12px',
            'text-valign': 'center',
            'text-halign': 'right',
            'text-margin-x': 8,
            'overlay-opacity': 0, // Hides the overlay selection box
            width: 3,
            height: 3,
          },
        },
        // Text Margin X
        {
          selector: 'node[ui_hints.label_margin_x]',
          style: {
            'text-margin-x': 'data(ui_hints.label_margin_x)' as unknown as number,
          },
        },
        // Text Margin Y
        {
          selector: 'node[ui_hints.label_margin_y]',
          style: {
            'text-margin-y': 'data(ui_hints.label_margin_y)' as unknown as number,
          },
        },
        // ==============================================================================
        // Junction Styles
        // ==============================================================================
        {
          selector: 'node[type="Junction"]',
          style: {
            'background-color': 'white',
            label: 'data(featureLabel)',
          },
        },
        // ==============================================================================
        // Town Styles
        // ==============================================================================
        {
          selector: 'node[type="Town"]',
          style: {
            label: 'data(label)',
            'background-opacity': 1,
            'background-color': 'white',
            'border-color': CytoUtils.styling.colors.CharcoalDark,
            'border-width': 3,
            width: 12,
            height: 12,
          },
        },
        // ==============================================================================
        // Default edge styles
        // ==============================================================================
        {
          selector: 'edge',
          style: {
            label: 'data(ui_hints.label)',
            color: CytoUtils.styling.colors.CharcoalDark,
            width: 'data(ui_hints.width)',
            'line-color': CytoUtils.styling.colors.ElectricBlue,
            'line-cap': 'round',
            'font-size': '12px',
            'font-weight': 700,
            'text-valign': 'top',
            'text-halign': 'center',
            'source-endpoint': '0 0',
            'target-endpoint': '0 0',
            'overlay-opacity': 0,
          },
        },
        {
          selector: 'edge[ui_hints.line_style]',
          style: {
            'line-style': 'data(ui_hints.line_style)' as cytoscape.Css.LineStyle,
          },
        },
        {
          selector: 'edge[ui_hints.line_dash_pattern]',
          style: {
            'line-dash-pattern': 'data(ui_hints.line_dash_pattern)' as unknown as number[],
          },
        },
        // Text Margin X
        {
          selector: 'edge[ui_hints.label_margin_x]',
          style: {
            'text-margin-x': 'data(ui_hints.label_margin_x)' as unknown as number,
          },
        },
        // Text Margin Y
        {
          selector: 'edge[ui_hints.label_margin_y]',
          style: {
            'text-margin-y': 'data(ui_hints.label_margin_y)' as unknown as number,
          },
        },
        // Curve Right
        {
          selector: 'edge[ui_hints.curve_position="left"]',
          style: {
            'curve-style': 'unbundled-bezier',
            'control-point-distances': [15, 15],
            'control-point-weights': [0.22, 0.78],
          },
        },
        // Curve Right
        {
          selector: 'edge[ui_hints.curve_position="right"]',
          style: {
            'curve-style': 'unbundled-bezier',
            'control-point-distances': [-15, -15],
            'control-point-weights': [0.22, 0.78],
          },
        },
      ];
    },
  },
  zooming: {
    zoomToFit: (cy: cytoscape.Core | null, padding: number) => {
      if (!cy) return;
      try {
        cy.fit(undefined, padding);
      } catch (e) {
        console.warn('Error fitting graph to screen', e);
      }
    },
    centeredZoom: (cy: cytoscape.Core | null, mode: 'in' | 'out', zoomStep: number) => {
      if (!cy) return;
      try {
        const newZoomLevel = mode === 'in' ? cy.zoom() * zoomStep : cy.zoom() / zoomStep;
        const screenCenter = { x: cy.width() / 2, y: cy.height() / 2 };
        cy.zoom({ level: newZoomLevel, renderedPosition: screenCenter });
      } catch (e) {
        console.warn('Error performing zoom', e);
      }
    },
  },
  panning: {
    toPanLimits: (cy: cytoscape.Core | null, padding: number): SchematicPanExtent | null => {
      if (!cy) return null;
      const bbox = cy.elements().boundingBox();
      const zoom = cy.zoom();
      const panMinX = bbox.x1 * zoom;
      const panMinY = bbox.y1 * zoom;
      const panMaxX = bbox.x2 * zoom;
      const panMaxY = bbox.y2 * zoom;
      return {
        xMin: panMinX - panMaxX + padding,
        xMax: cy.width() - padding,
        yMin: 0 + padding,
        yMax: panMaxY - panMinY + cy.height() - padding,
      };
    },
  },
};

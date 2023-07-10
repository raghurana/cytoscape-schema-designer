import { create } from 'zustand';
import { Types } from '../../RiverSchematicsV2/components/RiverSchematic/RiverSchematic.interfaces';
import { immer } from 'zustand/middleware/immer';

interface State {
  open: boolean;
  graphOptions: Types.GraphOptions;
  nodeLabelOptions: Types.NodeLabelDesignerExtension[];
  edgeLabelOptions: Types.EdgeLabelDesignerExtension[];
  setOpen: (open: boolean) => void;
  updateNodeLabelOption: (newOption: Types.NodeLabelDesignerExtension) => void;
  updateEdgeLabelOption: (newOption: Types.EdgeLabelDesignerExtension) => void;
}

export const useSettingsStore = create(
  immer<State>((set) => ({
    open: false,
    jsonOutputVisible: false,
    nodeLabelOptions: ['id', 'geometry', 'none'],
    edgeLabelOptions: ['id', 'none'],
    graphOptions: {
      minZoom: 0.35,
      maxZoom: 3.5,
      zoomStep: 1.35,
      zoomPadding: 10,
      panLimitPadding: 150,
      featureSettings: { riverGauge: 'FlowRate', storage: 'PercentageFull' },
      designerSettings: {
        nodes: {
          appendToLabel: 'none',
          showJunctions: true,
        },
        edges: {
          appendToLabel: 'none',
        },
      },
    },
    setOpen(open: boolean) {
      set((prev) => {
        prev.open = open;
      });
    },
    updateNodeLabelOption(newOption: Types.NodeLabelDesignerExtension) {
      set((prev) => {
        if (prev.graphOptions.designerSettings?.nodes)
          prev.graphOptions.designerSettings.nodes.appendToLabel = newOption;
      });
    },
    updateEdgeLabelOption(newOption: Types.EdgeLabelDesignerExtension) {
      set((prev) => {
        if (prev.graphOptions.designerSettings?.edges)
          prev.graphOptions.designerSettings.edges.appendToLabel = newOption;
      });
    },
  })),
);

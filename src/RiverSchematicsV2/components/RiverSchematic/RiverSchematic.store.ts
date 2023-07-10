import { create } from 'zustand';
import { SchematicPanExtent, SelectedFeature } from './RiverSchematic.interfaces';

export interface SchematicStoreState {
  uiFullScreen: {
    isFullScreen: boolean;
    setFullScreenStatus: (status: boolean) => void;
    toggleFullScreen: () => void;
  };
  uiZoom: {
    currZoom: number | null;
    isMinZoomLevel: boolean;
    isMaxZoomLevel: boolean;
    setZoomInfo: (currZoom: number, minZoom: number, maxZoom: number) => void;
    resetZoomInfo: () => void;
  };
  uiFeatureCard: {
    selectedFeature: SelectedFeature | null;
    setSelectedFeature: (selectedFeature: SelectedFeature | null) => void;
  };
  uiPan: {
    currPan: { x: number; y: number } | null;
    panLimits: SchematicPanExtent | null;
    panLimitsActive: boolean;
    outsidePanLimits: boolean;
    setCurrPan: (newPan: { x: number; y: number }) => void;
    setPanLimits: (newPanLimit: SchematicPanExtent | null) => void;
    setPanLimitsActive: (activate: boolean) => void;
  };
}

export const useRiverSchematicStore = create<SchematicStoreState>((set, get) => ({
  uiFullScreen: {
    isFullScreen: false,
    setFullScreenStatus(status) {
      set((prev) => ({
        uiFullScreen: {
          ...prev.uiFullScreen,
          isFullScreen: status,
        },
      }));
    },
    toggleFullScreen() {
      set((prev) => ({
        uiFullScreen: {
          ...prev.uiFullScreen,
          isFullScreen: !prev.uiFullScreen.isFullScreen,
        },
      }));
    },
  },
  uiZoom: {
    currZoom: null,
    isMinZoomLevel: false,
    isMaxZoomLevel: false,
    setZoomInfo(newZoom: number, minZoom: number, maxZoom: number) {
      if (newZoom === get().uiZoom.currZoom) return;
      set((prev) => ({
        uiZoom: {
          ...prev.uiZoom,
          currZoom: newZoom,
          isMinZoomLevel: newZoom <= minZoom,
          isMaxZoomLevel: newZoom >= maxZoom,
        },
      }));
    },
    resetZoomInfo() {
      set((prev) => ({
        uiZoom: {
          ...prev.uiZoom,
          currZoom: null,
          isMinZoomLevel: false,
          isMaxZoomLevel: false,
          viewportExtent: null,
          boundingBox: null,
        },
      }));
    },
  },
  uiFeatureCard: {
    selectedFeature: null,
    setSelectedFeature(newSelectedFeature) {
      const existing = get().uiFeatureCard.selectedFeature;
      if (existing?.nodeId === newSelectedFeature?.nodeId) return;
      set((prev) => ({
        uiFeatureCard: {
          ...prev.uiFeatureCard,
          selectedFeature: newSelectedFeature,
        },
      }));
    },
  },
  uiPan: {
    currPan: null,
    panLimits: null,
    panLimitsActive: false,
    outsidePanLimits: false,
    setCurrPan(newPan) {
      const panRounded = { x: +newPan.x.toFixed(2), y: +newPan.y.toFixed(2) };
      const currPanLimits = get().uiPan.panLimits;
      set((prev) => ({
        uiPan: {
          ...prev.uiPan,
          currPan: panRounded,
          outsidePanLimits: currPanLimits
            ? panRounded.x <= currPanLimits.xMin ||
              panRounded.x >= currPanLimits.xMax ||
              panRounded.y <= currPanLimits.yMin ||
              panRounded.y >= currPanLimits.yMax
            : false,
        },
      }));
    },
    setPanLimits(newPanLimit) {
      const limitRounded = newPanLimit
        ? {
            xMin: +newPanLimit.xMin.toFixed(2),
            xMax: +newPanLimit.xMax.toFixed(2),
            yMin: +newPanLimit.yMin.toFixed(2),
            yMax: +newPanLimit.yMax.toFixed(2),
          }
        : null;

      set((prev) => ({
        uiPan: {
          ...prev.uiPan,
          panLimits: limitRounded,
        },
      }));
    },
    setPanLimitsActive(activate) {
      set((prev) => ({
        uiPan: {
          ...prev.uiPan,
          panLimitsActive: activate,
        },
      }));
    },
  },
}));

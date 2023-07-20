import { create } from 'zustand';
import { SelectedFeature } from './RiverSchematic.interfaces';

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
}));

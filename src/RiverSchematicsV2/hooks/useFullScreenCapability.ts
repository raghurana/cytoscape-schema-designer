import { useCallback } from 'react';
import { useFullScreenHandle } from 'react-full-screen';
import { useRiverSchematicStore } from '../components/RiverSchematic/RiverSchematic.store';

export const useFullScreenCapability = () => {
  const fsHandle = useFullScreenHandle();
  const fsState = useRiverSchematicStore((s) => s.uiFullScreen);
  const { isFullScreen, toggleFullScreen, setFullScreenStatus } = fsState;
  const resetZoomInfo = useRiverSchematicStore((s) => s.uiZoom.resetZoomInfo);

  const handlerToggleFullScreen = useCallback(() => {
    if (isFullScreen) fsHandle.exit();
    else fsHandle.enter();
    toggleFullScreen();
  }, [fsHandle, isFullScreen, toggleFullScreen]);

  const handlerOnChange = useCallback(
    (changedState: boolean) => {
      setFullScreenStatus(changedState);
      resetZoomInfo();
    },
    [resetZoomInfo, setFullScreenStatus],
  );

  return { fsHandle, handlerToggleFullScreen, handlerOnChange };
};

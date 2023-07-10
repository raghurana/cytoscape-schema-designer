import { useSchematicLatestEvent } from '../../Designer/hooks/useSchematicLatestEvent';

export const useRiverData = (catchmentId?: number) => {
  const designerData = useSchematicLatestEvent();
  console.debug(`use River Data ${catchmentId}`);
  return designerData;
};

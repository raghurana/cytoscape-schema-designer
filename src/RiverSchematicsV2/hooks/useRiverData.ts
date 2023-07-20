import { useSchematicLatestEvent } from '../../Designer/hooks/useSchematicLatestEvent';

export const useRiverData = (catchmentId?: number) => {
  const designerData = useSchematicLatestEvent();
  console.log(`use River Data ${catchmentId}`);
  return designerData;
};

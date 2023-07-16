import { useStore } from 'zustand';
import { useEffect, useState } from 'react';
import { schematicStore } from '../stores/schematicStore.ts';
import { SchematicJsonData } from '../../RiverSchematicsV2/components/RiverSchematic/RiverSchematic.interfaces.ts';

export const useSchematicLatestEvent = () => {
  const [latestDefinition, setLatestDefinition] = useState<SchematicJsonData | undefined>(undefined);
  const { latestEvent } = useStore(schematicStore);

  useEffect(() => {
    setLatestDefinition(latestEvent?.data);
  }, [latestEvent]);

  return latestDefinition;
};

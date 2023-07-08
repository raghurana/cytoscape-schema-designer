import { useStore } from 'zustand';
import { useEffect, useState } from 'react';
import { schematicStore } from './schematicStore.ts';
import { Schematic } from './schematic.ts';

export const useSchematicLatestEvent = () => {
  const [latestDefinition, setLatestDefinition] = useState<Schematic | undefined>(undefined);
  const { latestEvent } = useStore(schematicStore);

  useEffect(() => {
    console.log('projection useEffect');
    setLatestDefinition(latestEvent?.data);
  }, [latestEvent]);

  return latestDefinition;
};

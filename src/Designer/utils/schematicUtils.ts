import { SchematicJsonData } from '../../RiverSchematicsV2/components/RiverSchematic/RiverSchematic.interfaces';

export const SchematicUtils = {
  getNextAvailableId: (data: SchematicJsonData): number => {
    const allIds = [...data.nodes.map((n) => n.id), ...data.edges.map((e) => e.id)];
    allIds.sort((a, b) => b - a); // sort descending
    return allIds[0] + 1;
  },
};

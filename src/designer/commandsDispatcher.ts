import { Payload } from './commands.ts';
import { DispatchFn } from './schematicStore.ts';

export function commandsDispatcher(command: string, dispatch: DispatchFn) {
  switch (command) {
    case '0':
      dispatch({ type: 'undo' });
      return;

    case '1':
      dispatch<Payload.NewSchematic>({
        type: 'newSchematic',
        payload: { name: 'lachlan', catchmentId: 1 },
      });
      return;

    case '2':
      dispatch<Payload.AddNode>({
        type: 'addNode',
        payload: { id: 1000, geometry: { x: 100, y: 200 }, featureType: 'Point' },
      });
      return;

    case '3':
      dispatch<Payload.AddEdge>({
        type: 'addEdge',
        payload: {
          id: 2000,
          fromId: 1000,
          toId: 1001,
          attributes: {
            riverSize: 'major',
          },
        },
      });
  }
}

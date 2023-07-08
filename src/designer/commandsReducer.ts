import { Payload } from './commands.ts';
import { Command, SchematicState } from './schematicStore.ts';

export function commandsReducer<T>(aggregate: SchematicState['schematicAggregate'], command: Command<T>) {
  switch (command.type) {
    case 'undo':
      aggregate.onUndo();
      break;
    case 'newSchematic':
      aggregate.onNewSchematic(command.payload as Payload.NewSchematic);
      break;
    case 'addNode':
      aggregate.onNewNode(command.payload as Payload.AddNode);
      break;
    case 'addEdge':
      aggregate.onNewEdge(command.payload as Payload.AddEdge);
      break;
    default:
      alert('No command found');
  }
}

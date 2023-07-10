import { createStore } from 'zustand/vanilla';
import { SchematicAggregate, SchematicUpdated } from '../schematicAggregate.ts';
import { Command } from '../commands.ts';

interface State {
  schematicAggregate: SchematicAggregate;
  latestEvent: SchematicUpdated | undefined;
  commands: {
    lastCommand: Command | undefined;
    dispatch: <T>(command: Command<T>) => void;
  };
}

export const schematicStore = createStore<State>((set, get) => ({
  schematicAggregate: new SchematicAggregate(),
  latestEvent: undefined,
  commands: {
    lastCommand: undefined,
    dispatch<T>(command: Command<T>) {
      const aggregate = get().schematicAggregate;
      aggregate[command.type](command.payload as any);
      if (command.type !== 'undo') aggregate.raiseUpdatedEvent();
      set((prev) => ({
        ...prev,
        latestEvent: prev.schematicAggregate.lastEvent,
        commands: { ...prev.commands, lastCommand: command as Command },
      }));
    },
  },
}));

import { createStore } from 'zustand/vanilla';
import { SchematicAggregate, SchematicUpdated } from './schematicAggregate.ts';
import { commandsReducer } from './commandsReducer.ts';
import { Commands } from './commands.ts';

export const schematicStore = createStore<SchematicState>((set, get) => ({
  schematicAggregate: new SchematicAggregate(),
  latestEvent: undefined,
  commands: {
    lastCommand: undefined,
    dispatch<T>(command: Command<T>) {
      commandsReducer<T>(get().schematicAggregate, command);
      set((prev) => ({
        ...prev,
        latestEvent: prev.schematicAggregate.lastEvent,
        commands: { ...prev.commands, lastCommand: command as Command },
      }));
    },
  },
}));

export interface SchematicState {
  schematicAggregate: SchematicAggregate;
  latestEvent: SchematicUpdated | undefined;
  commands: {
    lastCommand: Command | undefined;
    dispatch: DispatchFn;
  };
}

export interface Command<T = void> {
  type: keyof Commands;
  payload?: T;
}

export type DispatchFn = <T>(command: Command<T>) => void;

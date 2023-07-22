import { createStore } from 'zustand/vanilla';
import { SchematicAggregate, SchematicUpdated } from '../schematicAggregate.ts';
import { Command } from '../commands.ts';

interface State {
  schematicAggregate: SchematicAggregate;
  latestEvent: SchematicUpdated | undefined;
  dispatch: <T>(command: Command<T>) => void;
}

type SchematicAggregateClassMethod<T> = (payload: T | undefined) => void;

export const schematicStore = createStore<State>((set, get) => ({
  schematicAggregate: new SchematicAggregate(),
  latestEvent: undefined,
  dispatch<T>(command: Command<T>) {
    const aggregate = get().schematicAggregate;
    (aggregate[command.type] as SchematicAggregateClassMethod<T>)(command.payload);
    if (command.type !== 'undo') aggregate.raiseUpdatedEvent();
    set((prev) => ({
      ...prev,
      latestEvent: prev.schematicAggregate.lastEvent,
    }));
  },
}));

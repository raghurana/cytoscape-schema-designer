import './App.css';
import React, { useCallback } from 'react';
import { useStore } from 'zustand';
import { schematicStore } from './designer/schematicStore.ts';
import { commandsDispatcher } from './designer/commandsDispatcher.ts';
import { useSchematicLatestEvent } from './designer/useSchematicLatestEvent.ts';

const App: React.FC = () => {
  const latestDef = useSchematicLatestEvent();
  const { lastCommand, dispatch } = useStore(schematicStore)?.commands;

  const onCommandCallback = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        commandsDispatcher(e.currentTarget.value, dispatch);
        e.currentTarget.value = '';
      }
    },
    [dispatch],
  );

  return (
    <div className="rootContainer">
      <textarea
        readOnly
        id="jsonOutput"
        placeholder="json"
        value={latestDef ? JSON.stringify(latestDef, null, 1) : ''}
      ></textarea>
      <label htmlFor="commandInput">Enter Command</label>
      <input id="commandInput" onKeyUp={onCommandCallback}></input>
      {lastCommand && JSON.stringify(lastCommand)}
    </div>
  );
};

export default App;

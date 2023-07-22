import styles from './CommandInput.module.css';
import { useCallback, useRef } from 'react';
import { useNLP } from '../hooks/useNlp';
import { useFilePicker } from 'use-file-picker';
import { useCommandHistoryStore } from '../stores/commandHistoryStore';

const EndOfCommands = -1;

export const CommandInput: React.FC = () => {
  const processCommand = useNLP();
  const commandCursor = useRef(EndOfCommands);
  const [open, setOpen, history, clearHistory] = useCommandHistoryStore((s) => [s.open, s.setOpen, s.history, s.clear]);
  const [showCommandsFileDialog] = useFilePicker({
    accept: '.txt',
    multiple: false,
    onFilesSuccessfulySelected({ filesContent }) {
      if (filesContent.length > 0) {
        clearHistory();
        commandCursor.current = EndOfCommands;
        filesContent[0].content.split(/\r?\n/).forEach((command) => setTimeout(() => processCommand(command), 100));
      }
    },
  });

  const onCommandInputKeyup = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp' && history.length > 0) {
        commandCursor.current = commandCursor.current === EndOfCommands ? history.length - 1 : Math.max(commandCursor.current - 1, 0);
        e.currentTarget.value = history[commandCursor.current];
        return;
      }

      if (e.key === 'ArrowDown' && history.length > 0) {
        if (commandCursor.current === EndOfCommands) return;
        commandCursor.current = Math.min(commandCursor.current + 1, history.length - 1);
        e.currentTarget.value = history[commandCursor.current];
        return;
      }

      if (e.key === 'Enter') {
        const target = e.currentTarget;
        processCommand(target.value).then((wasSuccess) => {
          if (wasSuccess) {
            target.value = '';
            commandCursor.current = EndOfCommands;
          }
        });
      }
    },
    [history, processCommand],
  );

  const onCommandHistoryClick = useCallback(() => setOpen(!open), [open, setOpen]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label htmlFor="commandInput">Enter Command</label>
        <button className={styles.loadCommandsBtn} type="button" onClick={showCommandsFileDialog}>
          Choose commands file
        </button>
        <span className={styles.spacer}></span>
        <button type="button" onClick={onCommandHistoryClick}>
          Command history
        </button>
      </div>
      <input id="commandInput" onKeyUp={onCommandInputKeyup}></input>
    </div>
  );
};

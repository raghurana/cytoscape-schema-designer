import styles from './CommandInput.module.css';
import { useCallback } from 'react';
import { useNLP } from '../hooks/useNlp';
import { useFilePicker } from 'use-file-picker';

export const CommandInput: React.FC = () => {
  const processCommand = useNLP();
  const [showCommandsFileDialog] = useFilePicker({
    accept: '.txt',
    multiple: false,
    onFilesSuccessfulySelected({ filesContent }) {
      if (filesContent.length > 0)
        filesContent[0].content.split(/\r?\n/).forEach((command) => setTimeout(() => processCommand(command), 100));
    },
  });

  const onCommandInputKeyup = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const target = e.currentTarget;
        processCommand(target.value).then((wasSuccess) => {
          if (wasSuccess) target.value = '';
        });
      }
    },
    [processCommand],
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label htmlFor="commandInput">Enter Command</label>
        <button className={styles.loadCommandsBtn} type="button" onClick={showCommandsFileDialog}>
          Choose commands file
        </button>
      </div>
      <input id="commandInput" onKeyUp={onCommandInputKeyup}></input>
    </div>
  );
};

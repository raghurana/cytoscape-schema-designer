import styles from './CommandInput.module.css';
import { useNLP } from '../hooks/useNlp';
import { useCallback } from 'react';

export const CommandInput: React.FC = () => {
  const processCommand = useNLP();

  const onLoadCommandsFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.currentTarget?.files?.[0];
      if (!selectedFile) return;
      const fr = new FileReader();
      fr.onload = (e) => {
        const commands = e.target?.result;
        if (typeof commands === 'string') {
          const arr = commands.split('\n');
          arr.forEach((command) => setTimeout(() => processCommand(command), 1000));
        }
      };
      fr.readAsText(selectedFile);
      event.currentTarget.value = '';
    },
    [processCommand],
  );

  const onCommandInputKeyup = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        processCommand(e.currentTarget.value);
        e.currentTarget.value = '';
      }
    },
    [processCommand],
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label htmlFor="commandInput">Enter Command</label>
        <input type="file" placeholder="load commands" onChange={onLoadCommandsFile} />
      </div>
      <input id="commandInput" onKeyUp={onCommandInputKeyup}></input>
    </div>
  );
};

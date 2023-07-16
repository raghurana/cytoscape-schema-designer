import styles from './Toolbar.module.css';
import { useCallback } from 'react';
import { useNLP } from '../hooks/useNlp';
import { useSettingsStore } from '../stores/settingsStore';

export const Toolbar: React.FC = () => {
  const processCommand = useNLP();
  const [open, setOpen] = useSettingsStore((s) => [s.open, s.setOpen]);

  const onFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget?.files?.[0]) {
        const fr = new FileReader();
        fr.onload = (e) => processCommand(`load schematic ${e.target?.result}`);
        fr.readAsText(event.currentTarget.files[0]);
        event.currentTarget.value = '';
      }
    },
    [processCommand],
  );

  return (
    <div className={styles.container}>
      <label>
        Load Schematic
        <input
          type="file"
          id="fileInput"
          accept=".json"
          placeholder="choose schematic file"
          onChange={onFileSelect}
        ></input>
      </label>
      <span className={styles.spacer}></span>
      <button type="submit" onClick={() => setOpen(!open)}>
        Settings
      </button>
    </div>
  );
};

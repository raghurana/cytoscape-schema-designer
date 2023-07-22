import styles from './Toolbar.module.css';
import { useNavigate } from 'react-router-dom';
import { useNLP } from '../hooks/useNlp';
import { useFilePicker } from 'use-file-picker';
import { useSettingsStore } from '../stores/settingsStore';

export const Toolbar: React.FC = () => {
  const processCommand = useNLP();
  const navigator = useNavigate();
  const [open, setOpen] = useSettingsStore((s) => [s.open, s.setOpen]);
  const [showSchematicFileDialog] = useFilePicker({
    accept: '.json',
    multiple: false,
    onFilesSuccessfulySelected({ filesContent }) {
      if (filesContent.length > 0) processCommand(`load schematic ${filesContent[0].content}`);
    },
  });

  return (
    <div className={styles.container}>
      <label>Load Schematic</label>
      <button type="button" onClick={showSchematicFileDialog}>
        Choose JSON file
      </button>
      <button type="button" onClick={() => navigator('./finalise')}>
        Finalise Schematic
      </button>
      <span className={styles.spacer}></span>
      <button type="submit" onClick={() => setOpen(!open)}>
        Settings
      </button>
    </div>
  );
};

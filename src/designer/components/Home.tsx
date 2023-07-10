import { RiverSchematic } from '../../RiverSchematicsV2';
import { createSelectors } from '../stores/createSelectors';
import { useSettingsStore } from '../stores/settingsStore';
import { CommandInput } from './CommandInput';
import styles from './Home.module.css';
import { JsonOutput } from './JsonOutput';
import { Settings } from './Settings';
import { Toolbar } from './Toolbar';

export const Home: React.FC = () => {
  const catchmentId = 0;
  const settingsStore = createSelectors(useSettingsStore);
  const open = settingsStore.use.open();
  const graphOptions = settingsStore.use.graphOptions();

  return (
    <div className={styles.container}>
      <Toolbar />
      <div className={styles.main}>
        <div className={styles.cytoContainer}>
          <RiverSchematic key={catchmentId} catchmentId={catchmentId} graphOptions={graphOptions} />
        </div>
        <JsonOutput />
        {open && <Settings />}
      </div>
      <CommandInput />
    </div>
  );
};

import { RiverSchematic } from '../../RiverSchematicsV2';
import { useCommandHistoryStore } from '../stores/commandHistoryStore';
import { createSelectors } from '../stores/createSelectors';
import { useSettingsStore } from '../stores/settingsStore';
import { CommandHistory } from './CommandHistory';
import { CommandInput } from './CommandInput';
import styles from './Home.module.css';
import { JsonOutput } from './JsonOutput';
import { Settings } from './Settings';
import { Toolbar } from './Toolbar';
import ReactCardFlip from 'react-card-flip';

export const Home: React.FC = () => {
  const catchmentId = 0;
  const settingsStore = createSelectors(useSettingsStore);
  const commandHistory = createSelectors(useCommandHistoryStore);
  const settingsOpen = settingsStore.use.open();
  const showJson = settingsStore.use.showJson();
  const graphOptions = settingsStore.use.graphOptions();
  const commandHistoryOpen = commandHistory.use.open();

  return (
    <div className={styles.container}>
      <Toolbar />
      {settingsOpen && <Settings />}
      {commandHistoryOpen && <CommandHistory />}
      <ReactCardFlip
        isFlipped={showJson}
        infinite={true}
        flipDirection="horizontal"
        flipSpeedBackToFront={0.8}
        flipSpeedFrontToBack={0.8}
        containerClassName={styles.main}
      >
        <div className={styles.cytoContainer}>
          <RiverSchematic key={catchmentId} catchmentId={catchmentId} graphOptions={graphOptions} />
        </div>
        <JsonOutput />
      </ReactCardFlip>
      <CommandInput />
    </div>
  );
};

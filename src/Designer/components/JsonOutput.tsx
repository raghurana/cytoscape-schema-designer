import styles from './JsonOutput.module.css';
import { useSchematicLatestEvent } from '../hooks/useSchematicLatestEvent';

export const JsonOutput: React.FC = () => {
  const latestDefinition = useSchematicLatestEvent();

  return (
    <div className={styles.container}>
      <textarea
        readOnly
        style={{ resize: 'none', width: '100%' }}
        placeholder="{}"
        value={latestDefinition ? JSON.stringify(latestDefinition, null, 3) : ''}
      />
    </div>
  );
};

import { useCallback } from 'react';
import { useCommandHistoryStore } from '../stores/commandHistoryStore';
import styles from './CommandHistory.module.css';

export const CommandHistory: React.FC = () => {
  const [history, clearHistory] = useCommandHistoryStore((s) => [s.history, s.clear]);

  const onCopyToClipboard = useCallback(async () => {
    const text = history.join('\r\n');
    if ('clipboard' in navigator) return await navigator.clipboard.writeText(text);
    else return document.execCommand('copy', true, text);
  }, [history]);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button type="button" onClick={() => clearHistory()}>
          Clear
        </button>
        <div className={styles.spacer} />
        <button type="button" disabled={history.length === 0} onClick={onCopyToClipboard}>
          Copy all to clipboard
        </button>
      </div>
      {writeHistory(history)}
    </div>
  );
};

const writeHistory = (history: string[]) => {
  return history.length === 0 ? (
    <div className={styles.disabledText}>No Data</div>
  ) : (
    <table className={styles.historyTable}>
      {history.map((command, index) => (
        <tr key={index}>
          <td className={styles.disabledText}>{index + 1}.</td>
          <td>{command}</td>
        </tr>
      ))}
    </table>
  );
};

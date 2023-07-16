import styles from './CommandList.module.css';
import { CommandsNlp, NlpCommandDefinition } from '../commandsNlp';

export const CommandsList: React.FC = () => {
  return (
    <div>
      <table className={styles.commandsTable}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Command</th>
            <th>Notes</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {CommandsNlp.map((command, i) => {
            const notesHtml = command.commandNotes
              ?.split('.')
              .map((note) => `<div>${note}</div>`)
              .join('');
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td className={styles.command} dangerouslySetInnerHTML={{ __html: sanitizeEntityNames(command) }} />
                <td dangerouslySetInnerHTML={{ __html: notesHtml }}></td>
                <td className={styles.commandExample}>{command.commandExample}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const sanitizeEntityNames = (command: NlpCommandDefinition) => {
  let commandText = command.commandText;
  command.entityExtraction?.forEach((e) => {
    if (command.commandText.includes(e.entityText)) {
      const replaceText = e.entityText.substring(e.entityText.indexOf('_') + 1);
      commandText = commandText.replace('@' + e.entityText, `<span class=${styles.param}>${replaceText}</span>`);
    }
  });
  return `<div class=${styles.command}>${commandText}</div>`;
};

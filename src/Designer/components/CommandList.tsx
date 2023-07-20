import styles from './CommandList.module.css';
import { CommandsNlp, NlpCommandDefinition } from '../commandsNlp';

export const CommandsList: React.FC = () => (
  <div className={styles.container}>
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
              <td dangerouslySetInnerHTML={{ __html: sanitizeEntityNames(command) }} />
              <td width={500} dangerouslySetInnerHTML={{ __html: notesHtml }} />
              <td dangerouslySetInnerHTML={{ __html: command.commandExample }} />
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

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

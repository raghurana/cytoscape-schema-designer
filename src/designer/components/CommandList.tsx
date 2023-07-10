import styles from './CommandList.module.css';
import { CommandsNlp, NlpCommandDefinition } from '../commandsNlp';

export const CommandsList: React.FC = () => {
  return (
    <div>
      {CommandsNlp.map((command) => {
        const commandText = sanitizeEntityNames(command);
        return <div dangerouslySetInnerHTML={{ __html: commandText }}></div>;
      })}
    </div>
  );
};

const sanitizeEntityNames = (command: NlpCommandDefinition) => {
  let commandText = command.commandText;
  command.entityExtraction?.forEach((e) => {
    if (command.commandText.includes(e.entityText)) {
      let replaceText = e.entityText.substring(e.entityText.indexOf('_') + 1);
      commandText = commandText.replace('@' + e.entityText, `<span class=${styles.param}>${replaceText}</span>`);
    }
  });
  return `<p class=${styles.command}>${commandText}</p>`;
};

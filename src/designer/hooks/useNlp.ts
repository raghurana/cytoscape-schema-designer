import { useCallback, useEffect, useState } from 'react';
import { containerBootstrap } from '@nlpjs/core';
import { Nlp } from '@nlpjs/nlp';
import { LangEn } from '@nlpjs/lang-en-min';
import { CommandsNlp, NlpCommandDefinition } from '../commandsNlp';
import { schematicStore } from '../stores/schematicStore';
import { useStore } from 'zustand';
import { Commands } from '../commands';

const English = 'en';

export const useNLP = () => {
  const [model, setModel] = useState<Nlp | undefined>(undefined);
  const { dispatch } = useStore(schematicStore)?.commands;

  useEffect(() => {
    const trainModel = async () => {
      const container = await containerBootstrap();
      container.use(Nlp);
      container.use(LangEn);
      const nlp = container.get('nlp');
      nlp.settings.autoSave = false;
      nlp.addLanguage(English);
      CommandsNlp.forEach((c) => {
        nlp.addDocument(English, c.commandText, c.intent);
        processEntityExtraction(c, nlp);
      });
      await nlp.train();
      setModel(nlp);
    };

    const processEntityExtraction = (command: NlpCommandDefinition, nlp: Nlp) => {
      if (command.entityExtraction) {
        command.entityExtraction.forEach((e) => {
          if (e.rule.type === 'trim-after-match') nlp.addNerAfterCondition(English, e.entityText, e.rule.matchWords);
          if (e.rule.type === 'trim-between-match')
            nlp.addNerBetweenLastCondition(English, e.entityText, e.rule.leftWords, e.rule.rightWords);
        });
      }
    };

    trainModel();
  }, [setModel]);

  const processCommand = useCallback(
    async (command: string) => {
      if (!model || !command) return;
      const result = await model.process(English, command);
      console.log(result);

      if (!result.intent || result.intent === 'None') {
        alert('Command not supported');
        return;
      }

      const commandType = result.intent as keyof Commands;
      const payload = Object.create({});
      result.entities?.forEach((e) => {
        const entityName = e.entity as string;
        if (entityName.startsWith(commandType)) {
          const removePrefix = `${result.intent}_`;
          const key = entityName.substring(removePrefix.length);
          payload[key] = e.utteranceText;
        }
      });
      //alert(`Command: ${commandType}\nPayload: ${JSON.stringify(payload)}`);
      dispatch({ type: commandType, payload });
    },
    [model, dispatch],
  );

  return processCommand;
};

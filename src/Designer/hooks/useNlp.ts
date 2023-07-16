import { useCallback, useEffect, useRef, useState } from 'react';
import { containerBootstrap } from '@nlpjs/core';
import { Nlp } from '@nlpjs/nlp';
import { LangEn } from '@nlpjs/lang-en-min';
import { CommandsNlp, NlpCommandDefinition } from '../commandsNlp';
import { schematicStore } from '../stores/schematicStore';
import { useStore } from 'zustand';
import { Commands } from '../commands';
import { V8nValidator } from 'v8n';
import { AggregateError } from '../schematicAggregate';

const English = 'en';

export const useNLP = () => {
  const [model, setModel] = useState<Nlp | undefined>(undefined);
  const { dispatch } = useStore(schematicStore);
  const validators = useRef(new Map<keyof Commands, V8nValidator>());

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
        if (c.commandValidator) validators.current.set(c.intent, c.commandValidator);
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
    async (command: string): Promise<boolean> => {
      if (!model || !command) return false;
      const result = await model.process(English, command);
      if (!result.intent || result.intent === 'None') {
        alert('Command not supported');
        return false;
      }

      console.log(`intent: ${result.intent}`, `input: ${result.utterance}`);

      // Construct payload
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

      // Validate payload
      if (validators.current.has(commandType)) {
        const validator = validators.current.get(commandType);
        const errors = validator?.testAll(payload);
        if (errors && errors.length > 0 && errors[0].cause && errors[0].cause[0].target) {
          const errorStr = `Invalid data for ${JSON.stringify(errors[0].cause[0].target)}`;
          alert(`Error: ${errorStr}\nCommand: ${commandType}\nBad Payload: ${JSON.stringify(payload, null, 1)}`);
          return false;
        }
      }

      try {
        dispatch({ type: commandType, payload });
        return true;
      } catch (err) {
        if (err instanceof AggregateError) alert(err.message);
        return false;
      }
    },
    [model, dispatch],
  );

  return processCommand;
};

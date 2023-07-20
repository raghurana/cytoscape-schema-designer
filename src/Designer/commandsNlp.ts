import { Commands } from './commands';
import * as CommandFactory from './commandsFactory';
import { V8nValidator } from 'v8n';

export const CommandsNlp: NlpCommandDefinition[] = [
  CommandFactory.undoCommand(),
  CommandFactory.newSchematic(),
  CommandFactory.loadSchematicCommand(),
  CommandFactory.addJunctionNode(),
  CommandFactory.addJunctionNodeRelativeCommand(),
  CommandFactory.addRiverGaugeNodeRelativeCommand(),
  CommandFactory.addStorageNodeRelativeCommand(),
  CommandFactory.addTownNodeRelativeCommand(),
  CommandFactory.addWetlandNodeRelativeCommand(),
  CommandFactory.addEdgeCommand(),
  CommandFactory.updateEdgeCurveCommand(),
  CommandFactory.updateEdgeLabelCommand(),
  CommandFactory.updateEdgeLineCommand(),
  CommandFactory.deleteEdgeCommand(),
  CommandFactory.moveLabelCommand(),
];

export interface NlpCommandDefinition {
  intent: keyof Commands;
  commandText: string;
  commandNotes: string;
  commandExample: string;
  commandValidator?: V8nValidator;
  entityExtraction?: {
    entityText: string;
    rule: TrimAfterMatch | TrimBetweenMatch;
  }[];
}

export interface TrimAfterMatch {
  type: 'trim-after-match';
  matchWords: string[];
}

export interface TrimBetweenMatch {
  type: 'trim-between-match';
  leftWords: string[];
  rightWords: string[];
}

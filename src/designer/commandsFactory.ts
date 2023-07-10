import { Commands } from './commands';
import { NlpCommandDefinition } from './commandsNlp';
import { Types } from '../RiverSchematicsV2/components/RiverSchematic/RiverSchematic.interfaces';

export const undoCommand = (): NlpCommandDefinition => {
  return {
    intent: 'undo',
    commandText: 'z',
  };
};

export const loadSchematicCommand = (): NlpCommandDefinition => {
  return {
    intent: 'loadSchematic',
    commandText: 'load schematic @loadSchematic_fileJson',
    entityExtraction: [
      {
        entityText: 'loadSchematic_fileJson',
        rule: {
          type: 'trim-after-match',
          matchWords: ['load schematic'],
        },
      },
    ],
  };
};

export const addNodeRelativeCommand = (nodeType: Types.NodeFeatureType): NlpCommandDefinition => {
  const intent = `add${nodeType}NodeRelative` as keyof Commands;
  return {
    intent: intent,
    commandText: `add ${nodeType} @${intent}_distance points @${intent}_direction of @${intent}_refNodeId with id @${intent}_newNodeId`,
    entityExtraction: [
      {
        entityText: `${intent}_distance`,
        rule: {
          type: 'trim-between-match',
          leftWords: [nodeType],
          rightWords: ['points'],
        },
      },
      {
        entityText: `${intent}_direction`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['points'],
          rightWords: ['of'],
        },
      },
      {
        entityText: `${intent}_refNodeId`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['of'],
          rightWords: ['with id'],
        },
      },
      {
        entityText: `${intent}_newNodeId`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['with id'],
        },
      },
    ],
  };
};

export const addEdgeCommand = (): NlpCommandDefinition => {
  return {
    intent: 'addEdge',
    commandText: 'add edge between @addEdge_fromId and @addEdge_toId with id @addEdge_newEdgeId',
    entityExtraction: [
      {
        entityText: 'addEdge_fromId',
        rule: {
          type: 'trim-between-match',
          leftWords: ['edge between'],
          rightWords: ['and'],
        },
      },
      {
        entityText: 'addEdge_toId',
        rule: {
          type: 'trim-between-match',
          leftWords: ['and'],
          rightWords: ['with id'],
        },
      },
      {
        entityText: 'addEdge_newEdgeId',
        rule: {
          type: 'trim-after-match',
          matchWords: ['with id'],
        },
      },
    ],
  };
};

export const deleteEdgeCommand = (): NlpCommandDefinition => {
  return {
    intent: 'deleteEdge',
    commandText: 'delete edge between @deleteEdge_fromId and @deleteEdge_toId',
    entityExtraction: [
      {
        entityText: 'deleteEdge_fromId',
        rule: {
          type: 'trim-between-match',
          leftWords: ['edge between'],
          rightWords: ['and'],
        },
      },
      {
        entityText: 'deleteEdge_toId',
        rule: {
          type: 'trim-after-match',
          matchWords: ['and'],
        },
      },
    ],
  };
};

export const updateEdgeCurveCommand = (): NlpCommandDefinition => {
  return {
    intent: 'updateEdgeCurve',
    commandText:
      'update edge between @updateEdgeCurve_fromId and  @updateEdgeCurve_toId to curve @updateEdgeCurve_curve',
    entityExtraction: [
      {
        entityText: 'updateEdgeCurve_fromId',
        rule: {
          type: 'trim-between-match',
          leftWords: ['edge between'],
          rightWords: ['and'],
        },
      },
      {
        entityText: 'updateEdgeCurve_toId',
        rule: {
          type: 'trim-between-match',
          leftWords: ['and'],
          rightWords: ['to curve'],
        },
      },
      {
        entityText: 'updateEdgeCurve_curve',
        rule: {
          type: 'trim-after-match',
          matchWords: ['to curve'],
        },
      },
    ],
  };
};

export const updateAttributeCommand = (): NlpCommandDefinition => {
  const intent: keyof Commands = 'updateElementAttribute';
  return {
    intent: intent,
    commandText: `update @${intent}_elementType attribute @${intent}_attributeName to @${intent}_value on @${intent}_id`,
    entityExtraction: [
      {
        entityText: `${intent}_elementType`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['update'],
          rightWords: ['attribute'],
        },
      },
      {
        entityText: `${intent}_attributeName`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['attribute'],
          rightWords: ['to'],
        },
      },
      {
        entityText: `${intent}_value`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['to'],
          rightWords: ['on'],
        },
      },
      {
        entityText: `${intent}_id`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['on'],
        },
      },
    ],
  };
};

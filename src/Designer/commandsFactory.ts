import { Commands, PayloadValidator, DirectionArray, ValidCurveTypes } from './commands';
import { NlpCommandDefinition } from './commandsNlp';
import { Types } from '../RiverSchematicsV2/components/RiverSchematic/RiverSchematic.interfaces';

export const undoCommand = (): NlpCommandDefinition => {
  return {
    intent: 'undo',
    commandText: 'z',
    commandNotes: 'Undo last command',
    commandExample: 'z',
  };
};

export const loadSchematicCommand = (): NlpCommandDefinition => {
  return {
    intent: 'loadSchematic',
    commandText: 'load schematic @loadSchematic_fileJson',
    commandNotes: 'Load a schematic from a json document',
    commandExample: 'load schematic {  "nodes": [], "edges": [] }',
    commandValidator: PayloadValidator.loadSchematic,
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
    commandText: `add ${nodeType} @${intent}_distance points @${intent}_direction of @${intent}_refNodeId`,
    commandNotes: `Add a ${nodeType} node relative to another node.
    "distance" must be a number > 0.
    "direction" must be one of ${DirectionArray.join(', ')}.
    "refNodeId" must be the id of an existing node, a number > 0`,
    commandExample: `add ${nodeType} 10 points right of 523`,
    commandValidator: PayloadValidator.addNodeRelative,
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
          type: 'trim-after-match',
          matchWords: ['of'],
        },
      },
    ],
  };
};

export const addEdgeCommand = (): NlpCommandDefinition => {
  return {
    intent: 'addEdge',
    commandText: 'add edge between @addEdge_fromId and @addEdge_toId',
    commandNotes: `Add a new edge between two existing nodes.
    "fromId" and "toId" must be the ids of existing nodes, numbers > 0`,
    commandExample: 'add edge between 100 and 200',
    commandValidator: PayloadValidator.addEdge,
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
          type: 'trim-after-match',
          matchWords: ['and'],
        },
      },
    ],
  };
};

export const deleteEdgeCommand = (): NlpCommandDefinition => {
  return {
    intent: 'deleteEdge',
    commandText: 'delete edge between @deleteEdge_fromId and @deleteEdge_toId',
    commandNotes: `Delete an existing edge between two existing nodes.
    "fromId" and "toId" must be the ids of existing nodes, numbers > 0`,
    commandExample: 'delete edge between 100 and 200',
    commandValidator: PayloadValidator.deleteEdge,
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
    commandText: 'update edge between @updateEdgeCurve_fromId and  @updateEdgeCurve_toId to curve @updateEdgeCurve_curve',
    commandNotes: `Update the curve position of an existing edge between two nodes.
    "fromId" and "toId" must be the ids of existing nodes, numbers > 0.
    "curve" must be one of ${ValidCurveTypes.join(', ')}`,
    commandExample: 'update edge between 100 and 200 to curve left',
    commandValidator: PayloadValidator.updateEdgeCurve,
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
    commandText: `update attribute @${intent}_attributeName to @${intent}_value on @${intent}_id`,
    commandNotes: `Update an attribute of an existing node or edge.
    "attributeName" must be the name of an existing attribute, full list of supported attributes is TBD.
    "value" must be a string.
    "id" must be the id of an existing node or edge, a number > 0`,
    commandExample: `update attribute label_margin_x to 15 on 100`,
    commandValidator: PayloadValidator.updateAttribute,
    entityExtraction: [
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

export const moveLabelCommand = (): NlpCommandDefinition => {
  return {
    intent: 'moveLabel',
    commandText: 'move label @moveLabel_distance points @moveLabel_direction on @moveLabel_id',
    commandNotes: `Move the label on an existing node or edge.
    "distance" must be a number > 0.
    "direction" must be one of ${DirectionArray.join(', ')}.
    "id" must be the id of an existing node or edge, a number > 0`,
    commandExample: 'move label 10 points left on 100',
    commandValidator: PayloadValidator.moveLabel,
    entityExtraction: [
      {
        entityText: 'moveLabel_distance',
        rule: {
          type: 'trim-between-match',
          leftWords: ['label'],
          rightWords: ['points'],
        },
      },
      {
        entityText: 'moveLabel_direction',
        rule: {
          type: 'trim-between-match',
          leftWords: ['points'],
          rightWords: ['on'],
        },
      },
      {
        entityText: 'moveLabel_id',
        rule: {
          type: 'trim-after-match',
          matchWords: ['on'],
        },
      },
    ],
  };
};

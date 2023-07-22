import { Commands, PayloadValidator, DirectionArray, ValidCurveTypes, ValidLineTypes } from './commands';
import { NlpCommandDefinition } from './commandsNlp';

export const undoCommand = (): NlpCommandDefinition => {
  return {
    intent: 'undo',
    commandText: 'z',
    commandNotes: 'Undo last command',
    commandExample: 'z',
  };
};

export const newSchematic = (): NlpCommandDefinition => {
  const intent = 'newSchematic' as keyof Commands;
  return {
    intent: intent,
    commandText: `new schematic @${intent}_catchmentId`,
    commandNotes: 'Create a new schematic for a catchment. "catchmentId" is the ID of an existing catchment, a number > 0',
    commandExample: 'new schematic 13',
    commandValidator: PayloadValidator.newSchematic,
    entityExtraction: [
      {
        entityText: `${intent}_catchmentId`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['new schematic'],
        },
      },
    ],
  };
};

export const loadSchematicCommand = (): NlpCommandDefinition => {
  const intent = 'loadSchematic' as keyof Commands;
  return {
    intent: intent,
    commandText: `load schematic @${intent}_fileJson`,
    commandNotes: 'Load a schematic from a json document. "fileJson" is a valid non-empty json document.',
    commandExample: 'load schematic {  "nodes": [], "edges": [] }',
    commandValidator: PayloadValidator.loadSchematic,
    entityExtraction: [
      {
        entityText: `${intent}_fileJson`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['load schematic'],
        },
      },
    ],
  };
};

export const addJunctionNode = (): NlpCommandDefinition => {
  const intent = 'addJunctionNode' as keyof Commands;
  return {
    intent: intent,
    commandText: `add junction at x @${intent}_x and y @${intent}_y`,
    commandNotes: `Add a junction node at a specific location. "x" and "y" must be numbers, they can be negative or positive and ideally whole numbers multiple of 100.`,
    commandExample: 'add junction at x 100 and y 200',
    commandValidator: PayloadValidator.addJunctionNode,
    entityExtraction: [
      {
        entityText: `${intent}_x`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['at x'],
          rightWords: ['and y'],
        },
      },
      {
        entityText: `${intent}_y`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['and y'],
        },
      },
    ],
  };
};

export const addJunctionNodeRelativeCommand = (): NlpCommandDefinition => {
  const intent = `addJunctionNodeRelative` as keyof Commands;
  return {
    intent: intent,
    commandText: `add junction @${intent}_distance points @${intent}_direction of @${intent}_refNodeId`,
    commandNotes: `Add a Junction node relative to another node.
    "distance" must be a number > 0.
    "direction" must be one of ${DirectionArray.join(', ')}.
    "refNodeId" is the id of an existing node, a number > 0`,
    commandExample: `add junction 10 points right of 523`,
    commandValidator: PayloadValidator.addJunctionNodeRelative,
    entityExtraction: [
      {
        entityText: `${intent}_distance`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['junction'],
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

export const addRiverGaugeNodeRelativeCommand = (): NlpCommandDefinition => {
  const intent = 'addRiverGaugeNodeRelative' as keyof Commands;
  return {
    intent: intent,
    commandText: `add river gauge @${intent}_distance points @${intent}_direction of @${intent}_refNodeId with gauge id @${intent}_gaugeId`,
    commandNotes: `Add a River Gauge node relative to another node.
    "distance" must be a number > 0.
    "direction" must be one of ${DirectionArray.join(', ')}.
    "refNodeId" is the id of an existing node, a number > 0.
    "gaugeId" is a non empty string.`,
    commandExample: `add river gauge 10 points right of 523 with gauge id w001-123`,
    commandValidator: PayloadValidator.addRiverGaugeNodeRelative,
    entityExtraction: [
      {
        entityText: `${intent}_distance`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['river gauge'],
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
          rightWords: ['with gauge id'],
        },
      },
      {
        entityText: `${intent}_gaugeId`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['with gauge id'],
        },
      },
    ],
  };
};

export const addStorageNodeRelativeCommand = (): NlpCommandDefinition => {
  const intent = 'addStorageNodeRelative' as keyof Commands;
  return {
    intent: intent,
    commandText: `add storage @${intent}_distance points @${intent}_direction of @${intent}_refNodeId with storage id @${intent}_storageId and storage name @${intent}_storageName`,
    commandNotes: `Add a Storage node relative to another node.
    "distance" must be a number > 0.
    "direction" must be one of ${DirectionArray.join(', ')}.
    "refNodeId" is the id of an existing node, a number > 0.
    "storageId" is a non empty string.
    "storageName" is a non empty string.`,
    commandExample: `add storage 10 points right of 523 with storage id w002-345 and storage name Coperton`,
    commandValidator: PayloadValidator.addStorageNodeRelative,
    entityExtraction: [
      {
        entityText: `${intent}_distance`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['add storage'],
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
          rightWords: ['with storage id'],
        },
      },
      {
        entityText: `${intent}_storageId`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['with storage id'],
          rightWords: ['and storage name'],
        },
      },
      {
        entityText: `${intent}_storageName`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['and storage name'],
        },
      },
    ],
  };
};

export const addTownNodeRelativeCommand = (): NlpCommandDefinition => {
  const intent = 'addTownNodeRelative' as keyof Commands;
  return {
    intent: intent,
    commandText: `add town @${intent}_distance points @${intent}_direction of @${intent}_refNodeId with name @${intent}_townName`,
    commandNotes: `Add a Town node relative to another node.
    "distance" must be a number > 0.
    "direction" must be one of ${DirectionArray.join(', ')}.
    "refNodeId" is the id of an existing node, a number > 0.
    "townName" is a non empty string.`,
    commandExample: `add town 10 points right of 523 with name Gravescend`,
    commandValidator: PayloadValidator.addTownNodeRelative,
    entityExtraction: [
      {
        entityText: `${intent}_distance`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['add town'],
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
          rightWords: ['with name'],
        },
      },
      {
        entityText: `${intent}_townName`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['with name'],
        },
      },
    ],
  };
};

export const addWetlandNodeRelativeCommand = (): NlpCommandDefinition => {
  const intent = 'addWetlandNodeRelative' as keyof Commands;
  return {
    intent: intent,
    commandText: `add wetland @${intent}_distance points @${intent}_direction of @${intent}_refNodeId with name @${intent}_wetlandName`,
    commandNotes: `Add a Wetland node relative to another node.
    "distance" must be a number > 0.
    "direction" must be one of ${DirectionArray.join(', ')}.
    "refNodeId" is the id of an existing node, a number > 0.
    "wetlandName" is a non empty string.`,
    commandExample: `add wetland 10 points right of 523 with name Gwydir floodplains`,
    commandValidator: PayloadValidator.addWetlandNodeRelative,
    entityExtraction: [
      {
        entityText: `${intent}_distance`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['add wetland'],
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
          rightWords: ['with name'],
        },
      },
      {
        entityText: `${intent}_wetlandName`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['with name'],
        },
      },
    ],
  };
};

export const addEdgeCommand = (): NlpCommandDefinition => {
  const intent = 'addEdge' as keyof Commands;
  return {
    intent: intent,
    commandText: `add edge between @${intent}_fromId and @${intent}_toId`,
    commandNotes: `Add a new edge between two existing nodes.
    "fromId" and "toId" must be the ids of existing nodes, numbers > 0`,
    commandExample: 'add edge between 100 and 200',
    commandValidator: PayloadValidator.addEdge,
    entityExtraction: [
      {
        entityText: `${intent}_fromId`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['edge between'],
          rightWords: ['and'],
        },
      },
      {
        entityText: `${intent}_toId`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['and'],
        },
      },
    ],
  };
};

export const updateEdgeCurveCommand = (): NlpCommandDefinition => {
  const intent = 'updateEdgeCurve' as keyof Commands;
  return {
    intent: intent,
    commandText: `update edge between @${intent}_fromId and  @${intent}_toId to curve @${intent}_curve`,
    commandNotes: `Update the curve position of an existing edge between two nodes.
    "fromId" and "toId" must be the ids of existing nodes, numbers > 0.
    "curve" must be one of ${ValidCurveTypes.join(', ')}.
    <b>** <u>Note</u> ** The curve direction is relative to the fromId node, therefore left or right is determined from fromId's perspective.
    If this command doesn't create the desired curve, try swapping the fromId and toId and adjust the curve direction accordingly.
    </b>
    `,
    commandExample: 'update edge between 100 and 200 to curve left',
    commandValidator: PayloadValidator.updateEdgeCurve,
    entityExtraction: [
      {
        entityText: `${intent}_fromId`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['edge between'],
          rightWords: ['and'],
        },
      },
      {
        entityText: `${intent}_toId`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['and'],
          rightWords: ['to curve'],
        },
      },
      {
        entityText: `${intent}_curve`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['to curve'],
        },
      },
    ],
  };
};

export const updateEdgeLabelCommand = (): NlpCommandDefinition => {
  const intent = 'updateEdgeLabel' as keyof Commands;
  return {
    intent: intent,
    commandText: `update edge label to @${intent}_newLabel on @${intent}_edgeId`,
    commandNotes: 'Update the label of an existing edge. "newLabel" is a non empty string. "edgeId" is the ID of an existing edge.',
    commandExample: 'update edge label to My River on 200',
    commandValidator: PayloadValidator.updateEdgeLabel,
    entityExtraction: [
      {
        entityText: `${intent}_newLabel`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['label to'],
          rightWords: ['on'],
        },
      },
      {
        entityText: `${intent}_edgeId`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['on'],
        },
      },
    ],
  };
};

export const updateEdgeLineCommand = (): NlpCommandDefinition => {
  const intent = 'updateEdgeLine' as keyof Commands;
  return {
    intent: intent,
    commandText: `update edge line to @${intent}_lineType on @${intent}_edgeId`,
    commandNotes: `Update the line type of an existing edge. "lineType" is one of ${ValidLineTypes}. "edgeId" is the ID of an existing edge.`,
    commandExample: 'update edge line to major river on 200',
    commandValidator: PayloadValidator.updateEdgeLine,
    entityExtraction: [
      {
        entityText: `${intent}_lineType`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['line to'],
          rightWords: ['on'],
        },
      },
      {
        entityText: `${intent}_edgeId`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['on'],
        },
      },
    ],
  };
};

export const deleteEdgeCommand = (): NlpCommandDefinition => {
  const intent = 'deleteEdge' as keyof Commands;
  return {
    intent: intent,
    commandText: `delete edge @${intent}_edgeId`,
    commandNotes: `Delete an existing edge using its id. "edgeId" is the ID of an existing edge.`,
    commandExample: 'delete edge 200',
    commandValidator: PayloadValidator.deleteEdge,
    entityExtraction: [
      {
        entityText: `${intent}_edgeId`,
        rule: {
          type: 'trim-after-match',
          matchWords: ['delete edge'],
        },
      },
    ],
  };
};

export const moveLabelCommand = (): NlpCommandDefinition => {
  const intent = 'moveLabel' as keyof Commands;
  return {
    intent: intent,
    commandText: `move label @${intent}_distance points @${intent}_direction on @${intent}_id`,
    commandNotes: `Move the label on an existing node or edge.
    "distance" must be a number > 0.
    "direction" must be one of ${DirectionArray.join(', ')}.
    "id" must be the id of an existing node or edge, a number > 0`,
    commandExample: 'move label 10 points left on 100',
    commandValidator: PayloadValidator.moveLabel,
    entityExtraction: [
      {
        entityText: `${intent}_distance`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['label'],
          rightWords: ['points'],
        },
      },
      {
        entityText: `${intent}_direction`,
        rule: {
          type: 'trim-between-match',
          leftWords: ['points'],
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

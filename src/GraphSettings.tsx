import './GraphSettings.css';
import { useCallback, useRef, useState } from 'react';
import { produce } from 'immer';
import { Types } from './RiverSchematicsV2/components/RiverSchematic/RiverSchematic.interfaces';

export const GraphSettings: React.FC<{
  graphOptions: Types.GraphOptions;
  notifyUpdate: (graphOptions: Types.GraphOptions) => void;
}> = ({ graphOptions, notifyUpdate }) => {
  const [open, setOpen] = useState(false);
  const nodeLabelOptions = useRef<Types.NodeLabelDesignerExtension[]>(['id', 'geometry', 'none']);
  const [selectedNodeLabelOpt, setSelectedNodeLabelOpt] = useState<Types.NodeLabelDesignerExtension | undefined>(
    graphOptions.designerSettings?.nodes?.appendToLabel,
  );

  const onNodeLabelChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    const changedVal = e.currentTarget.value as Types.NodeLabelDesignerExtension;
    setSelectedNodeLabelOpt(changedVal);
    notifyUpdate(
      produce(graphOptions, (draft) => {
        if (draft?.designerSettings?.nodes) draft.designerSettings.nodes.appendToLabel = changedVal;
      }),
    );
  }, []);

  return (
    <div className="settingsContainer">
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        Settings
      </button>
      {open && (
        <div className="dialog">
          <label>
            Append to Node Label:
            <select className="combo" value={selectedNodeLabelOpt} onChange={onNodeLabelChange}>
              {nodeLabelOptions.current.map((additional) => (
                <option key={additional} value={additional}>
                  {additional}
                </option>
              ))}
            </select>
          </label>
          <label>
            Show Junctions:
            <input type="checkbox" title="show Junctions" className="checkbox" />
          </label>
        </div>
      )}
    </div>
  );
};

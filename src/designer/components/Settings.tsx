import styles from './Settings.module.css';
import { createSelectors } from '../stores/createSelectors';
import { useSettingsStore } from '../stores/settingsStore';
import { Types } from '../../RiverSchematicsV2/components/RiverSchematic/RiverSchematic.interfaces';

export const Settings: React.FC = () => {
  const store = createSelectors(useSettingsStore);
  const graphOptions = store.use.graphOptions();
  const nodeLabelOptions = store.use.nodeLabelOptions();
  const edgeLabelOptions = store.use.edgeLabelOptions();
  const updateNodeLabelOption = store.use.updateNodeLabelOption();
  const updateEdgeLabelOption = store.use.updateEdgeLabelOption();

  return (
    <div className={styles.container}>
      <label>
        Append to Node Label:
        <select
          value={graphOptions.designerSettings?.nodes?.appendToLabel}
          onChange={(e) => updateNodeLabelOption(e.currentTarget.value as Types.NodeLabelDesignerExtension)}
        >
          {nodeLabelOptions.map((additional) => (
            <option key={additional} value={additional}>
              {additional}
            </option>
          ))}
        </select>
      </label>
      <label>
        Append to Edge Label:
        <select
          value={graphOptions.designerSettings?.edges?.appendToLabel}
          onChange={(e) => updateEdgeLabelOption(e.currentTarget.value as Types.EdgeLabelDesignerExtension)}
        >
          {edgeLabelOptions.map((additional) => (
            <option key={additional} value={additional}>
              {additional}
            </option>
          ))}
        </select>
      </label>
      <a href="./commands" target="_blank">
        Show Commands (new tab)
      </a>
    </div>
  );
};

import styles from './FinaliseSchematic.module.css';
import { FieldValues, useForm } from 'react-hook-form';
import { JsonOutput } from './JsonOutput';
import { useSchematicLatestEvent } from '../hooks/useSchematicLatestEvent';
import { useNavigate } from 'react-router-dom';

interface FinaliseData {
  catchmentId: number;
  riverSchematicName: string;
  version: number;
}

export const FinaliseSchematic: React.FC = () => {
  const latestDefinition = useSchematicLatestEvent();
  const navigator = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSaveToDisk = (data: FieldValues) => {
    if (!latestDefinition) return;
    const formData = data as FinaliseData;
    // Save new props
    latestDefinition.catchmentId = +formData.catchmentId;
    latestDefinition.river_schematic_name = formData.riverSchematicName;
    latestDefinition.version = +formData.version;

    // Clean Nodes
    latestDefinition.nodes.forEach((node) => {
      if (node.current) delete node.current;
      if (node.ui_hints) delete node.ui_hints;
    });

    // Clean Edges
    latestDefinition.edges.forEach((edge) => {
      if (edge.geometry) delete edge.geometry;
      if (edge.ui_hints) delete edge.ui_hints;
    });

    // Remove legacy props
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loose = latestDefinition as any;
    delete loose.origin;
    delete loose.has_data;
    delete loose.extent;
    delete loose.last_updated;
    delete loose.fields;

    const link = document.createElement('a');
    link.download = `river_schematic_${formData.catchmentId}_v2.json`;
    link.href = URL.createObjectURL(new Blob([JSON.stringify(latestDefinition, null, 1)], { type: 'application/json' }));
    link.click();

    navigator('/');
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit(onSaveToDisk)}>
        <h1>Finalise Schematic Json</h1>
        <br />
        <label className={styles.formLabel}>
          Catchment Id: <br />
          <input type="text" className={styles.formInput} {...register('catchmentId', { required: true, pattern: /\d+/ })} />
          {errors.catchmentId && <div className={styles.error}>required and must be a number</div>}
        </label>
        <label className={styles.formLabel}>
          River Schematic Name: <br />
          <input type="text" className={styles.formInput} {...register('riverSchematicName', { required: true })} />
          {errors.riverSchematicName && <div className={styles.error}>required</div>}
        </label>
        <label className={styles.formLabel}>
          New Version No: <br />
          <input type="text" className={styles.formInput} {...register('version', { required: true, pattern: /\d+/ })} />
          {errors.version && <div className={styles.error}>required and must be a number</div>}
        </label>
        <input type="submit" className={styles.saveBtn} value="Save to disk" />
      </form>
      <JsonOutput />
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { FullScreen } from 'react-full-screen';
import { Features } from '../../components/Features/Features';
import { Types } from './RiverSchematic.interfaces';
import { CytoUtils } from '../../utils/index';
import styles from './RiverSchematic.module.scss';
import * as Hooks from '../../hooks';

const Component: React.FC<{ catchmentId: number; graphOptions: Types.GraphOptions }> = ({ catchmentId, graphOptions }) => {
  const cytoContainerRef = useRef<HTMLDivElement>(null);

  const cytoscape = Hooks.useCytoscape(cytoContainerRef, graphOptions);
  const fullScreen = Hooks.useFullScreenCapability();
  const riverData = Hooks.useRiverData(catchmentId);
  const transformed = Hooks.useRiverDataTransformed({ riverData, graphOptions });
  const renderInfo = Hooks.useRenderElements({ cytoscape, elements: transformed.elements });
  const features = Hooks.useFeatureInfoPopup({ nodes: transformed.originalNodes });

  useEffect(() => {
    if (!cytoscape) return;
    setTimeout(() => CytoUtils.zooming.zoomToFit(cytoscape, graphOptions.zoomPadding), 200);
  }, [cytoscape, graphOptions.zoomPadding, riverData?.catchmentId, riverData?.river_schematic_name]);

  return (
    <div className={styles.schematicWrapper}>
      <FullScreen className={styles.fullscreenContainer} handle={fullScreen.fsHandle} onChange={fullScreen.handlerOnChange}>
        {!riverData && <div className={styles.loading}>No Data</div>}
        <div className={styles.cytoscapeContainer} ref={cytoContainerRef}>
          <Features
            nodeIdPrefix={Hooks.cloneIdPrefix}
            nodeDefinitions={renderInfo.featureNodes}
            nodeDomReferences={renderInfo.featurePillRefs}
            featureClickHandler={features.handleFeatureClick}
          />
        </div>
      </FullScreen>
    </div>
  );
};

export const RiverSchematic = React.memo(Component);

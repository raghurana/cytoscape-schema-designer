import { useState } from 'react';
import { FeatureIcon } from '../FeatureIcons/FeatureIcons';
import { Types } from '../RiverSchematic/RiverSchematic.interfaces';
import cx from 'classnames';
import styles from './FeaturePillNode.module.scss';

export interface FeaturePillNodeProps {
  id: string;
  featureType: Types.SpecialFeature;
  content: string;
  selected: boolean;
  onClick: (id: string) => void;
}

export function FeaturePillNode({ id, featureType, content, selected, onClick }: FeaturePillNodeProps): JSX.Element {
  const [hover, setHover] = useState(false);

  const handleToggleHover = () => {
    setHover(!hover);
  };

  const handleOnClick = (id: string) => (): void => {
    onClick(id);
  };

  const isRiverGauge = featureType === 'Rivergauge';

  const containerStyle = cx(styles.container, {
    [styles.withContent]: Boolean(content),
    [styles.wetland]: featureType === 'Wetland',
    [styles.selected]: selected,
  });

  const contentStyle = cx(styles.content, {
    [styles.riverGauge]: isRiverGauge && !selected,
    [styles.storage]: featureType === 'Storage' && !selected,
    [styles.wetland]: featureType === 'Wetland',
    [styles.selectedContent]: selected,
  });

  const iconStyle = cx(styles.icon, {
    [styles.wetlandIcon]: featureType === 'Wetland',
    [styles.iconSelected]: selected,
    [styles.iconHoverDark]: isRiverGauge && !content && !selected,
  });

  // Not the cleanest way to do this, but it works
  // Refactor later, to a more elegant solution
  const shouldInvertForRiverGauge = content ? false : hover;
  const shouldSelectForRiverGauge = content ? (selected ? true : hover) : selected;

  return (
    <div
      className={containerStyle}
      onMouseEnter={handleToggleHover}
      onMouseLeave={handleToggleHover}
      onClick={handleOnClick(id)}
      onTouchStart={handleOnClick(id)}
      tabIndex={0}
    >
      <div className={iconStyle}>
        {isRiverGauge ? (
          // Special case for river gauge icon, different icon colors when selected with content
          <FeatureIcon
            featureType={featureType}
            invert={shouldInvertForRiverGauge}
            select={shouldSelectForRiverGauge}
          />
        ) : (
          <FeatureIcon featureType={featureType} invert={hover} select={selected} />
        )}
      </div>
      {content && <div className={contentStyle}>{content}</div>}
    </div>
  );
}

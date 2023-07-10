import jcc from 'json-case-convertor';
import { CommonUtils } from '../../../utils';
import { SchematicNode, Types } from '../../../components/RiverSchematic/RiverSchematic.interfaces.ts';
import {
  CurrentRiverGaugeDetails,
  CurrentStorageDetails,
} from '../../../components/RiverSchematic/RiverSchematic.interfaces';

export function featureLabelTransformer(node: SchematicNode, options?: Types.GraphOptions): SchematicNode {
  if (!node.ui_hints) return node;

  let extraLabel;
  if (options?.designerSettings?.nodes?.appendToLabel === 'none') extraLabel = '';
  else if (options?.designerSettings?.nodes?.appendToLabel === 'id') extraLabel = ` [${node.id}]`;
  else if (options?.designerSettings?.nodes?.appendToLabel === 'geometry')
    extraLabel = ` ${JSON.stringify({ x: +node.geometry.x.toFixed(2), y: +node.geometry.y.toFixed(2) })}`;

  if (node.feature_type === 'Town') node.ui_hints.label = node.feature_label + extraLabel;
  else if (node.feature_type === 'Junction') node.ui_hints.feature_label = extraLabel;
  else if (node.feature_type === 'Rivergauge') node.ui_hints.feature_label = riverGaugeContent(node, options);
  else if (node.feature_type === 'Storage') node.ui_hints.feature_label = storageContent(node, options);
  else if (node.feature_type === 'Wetland') node.ui_hints.feature_label = `${node.feature_label}`;

  // Hide Label overrides everything
  if (node.ui_hints.hide_label) {
    node.ui_hints.label = '';
    node.ui_hints.feature_label = '';
  }

  return node;
}

const riverGaugeContent = (node: SchematicNode, options?: Types.GraphOptions) => {
  const riverGaugeDetails = jcc.camelCaseKeys(node.current) as CurrentRiverGaugeDetails;
  if (!riverGaugeDetails) return 'No Current Data';
  const { watercourseLevel, watercourseDischarge } = riverGaugeDetails;
  const isFlowRate = options?.featureSettings.riverGauge === 'FlowRate';
  const unitSuffix = isFlowRate ? 'ML/day' : 'm';
  const featureVal = isFlowRate ? watercourseDischarge : watercourseLevel;
  const featureValFormatted = isFlowRate
    ? CommonUtils.Text.roundedCommaMarkUp(featureVal)
    : CommonUtils.Maths.roundDecimal(featureVal);

  return `${featureValFormatted} ${unitSuffix}`;
};

const storageContent = (node: SchematicNode, options?: Types.GraphOptions) => {
  const storageDetails = node.current as CurrentStorageDetails;
  if (!storageDetails) return 'No Current Data';
  const { percentage_full_now, volume_total } = storageDetails;
  const isPercentageFull = options?.featureSettings.storage === 'PercentageFull';
  const symbolSuffix = isPercentageFull ? '%' : ' ML';
  const featureVal = isPercentageFull ? percentage_full_now : volume_total;
  const featureValFormatted = isPercentageFull ? featureVal.toString() : CommonUtils.Text.markUpNum(featureVal);
  return `${node.feature_label} ${featureValFormatted} ${symbolSuffix}`;
};

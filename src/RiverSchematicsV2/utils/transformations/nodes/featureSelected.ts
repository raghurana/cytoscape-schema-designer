import jcc from 'json-case-convertor';
import { SchematicNode } from '../../../components/RiverSchematic/RiverSchematic.interfaces.ts';
import {
  CurrentRiverGaugeDetails,
  CurrentStorageDetails,
  SelectedFeature,
} from '../../../components/RiverSchematic/RiverSchematic.interfaces';

export function getRiverGaugeCardContent(node: SchematicNode): SelectedFeature {
  const details = jcc.camelCaseKeys(node.current) as CurrentRiverGaugeDetails;

  return {
    nodeId: node.id.toString(),
    featureType: 'Rivergauge',
    details: {
      gaugeId: details.gaugeId,
      gaugeName: details.gaugeName,
      catchmentId: details.catchmentId,
      watercourseDischarge: details.watercourseDischarge,
      watercourseLevel: details.watercourseLevel,
      watercourseLevelPrevDay: details.watercourseLevelPrevDay,
      lastUpdated: details.lastUpdated,
      observationDay: details.observationDay,
      waterQuality: details.waterQuality,
    },
  };
}

export function getStorageCardContent(node: SchematicNode): SelectedFeature {
  const details = node.current as CurrentStorageDetails;

  return {
    nodeId: node.id.toString(),
    featureType: 'Storage',
    details: {
      storageId: details.storage_id,
      storageName: details.storage_name,
      catchmentId: details.catchment_id,
      percentageFullNow: details.percentage_full_now,
      percentageFullLy: details.percentage_full_ly,
      volumeTotal: details.volume_total,
      lastUpdated: details.last_updated,
    },
  };
}

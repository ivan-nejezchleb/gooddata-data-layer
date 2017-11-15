import { AFM } from '@gooddata/typings';
import * as VisObj from './model/VisualizationObject';

function convertFilters(filters: AFM.CompatibilityFilter[]): VisObj.EmbeddedFilter[] {
    return null;
}

function convertToBuckets(Afm: AFM.IAfm, resultSpec: AFM.IResultSpec): VisObj.IBucket[] {
    return null;
}

function convertSorting(properties: string, resultSpec: AFM.IResultSpec) {
    if (resultSpec.sorts) {
        return properties.concat(JSON.stringify(resultSpec.sorts));
    }

    return properties;
}

export function toVisObj(
    afm: AFM.IAfm,
    visualizationClass: string,
    properties: string,
    resultSpec: AFM.IResultSpec
): VisObj.IVisualizationObjectContent {
    const buckets = convertToBuckets(afm, resultSpec);
    const filters = convertFilters(afm.filters);
    properties = convertSorting(properties, resultSpec);
    const visType = 'bar';

    return {
        visualizationClass,
        buckets,
        visType,
        filters,
        properties
    };
}

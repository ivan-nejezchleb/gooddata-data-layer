import filter = require('lodash/filter');
import compact = require('lodash/compact');
import get = require('lodash/get');
import { AFM } from '@gooddata/typings';
import * as VisObj from './model/VisualizationObject';
import { normalizeAfm } from '../utils/AfmUtils';

function convertAttribute(attribute: VisObj.IVisualizationAttribute): AFM.IAttribute {
    const alias = attribute.visualizationAttribute.alias;
    const aliasProp = alias ? { alias } : {};
    return {
        localIdentifier: attribute.visualizationAttribute.localIdentifier,
        displayForm: {
            uri: attribute.visualizationAttribute.displayForm
        },
        ...aliasProp
    };
}

function convertAFM(visObj: VisObj.IVisualizationObjectContent, translatedPopSuffix: string): AFM.IAfm {

    const attributes: AFM.IAttribute[] = getAttributes(visObj.buckets).map(convertAttribute);
    const attrProp = attributes.length ? { attributes } : {};

    const measures: AFM.IMeasure[] = getMeasures(visObj.buckets)
        .map(measure => convertMeasureAfm(measure, translatedPopSuffix));
    const measuresProp = measures.length ? { measures } : {};

    const filters: AFM.CompatibilityFilter[] = visObj.filters ? compact(visObj.filters.map(convertFilter)) : [];
    const filtersProp = filters.length ? { filters } : {};

    return {
        ...measuresProp,
        ...attrProp,
        ...filtersProp
    };
}

function convertMeasureAfm(measure: VisObj.IMeasure, translatedPopSuffix: string): AFM.IMeasure {
    let convertedDefinition;
    let alias;

    if (VisObj.isMeasureDefinition(measure.measure.definition)) {
        const measureDefinition = (measure.measure.definition as VisObj.IMeasureDefinition).measureDefinition;
        const filters: AFM.FilterItem[] = measureDefinition.filters
            ? measureDefinition.filters.map(convertMeasureFilter) : [];
        const filtersProp = filters.length ? { filters } : {};

        const aggregation = measureDefinition.aggregation;
        const aggregationProp = aggregation ? { aggregation } : {};

        const computeRatio = measureDefinition.computeRatio;
        const computeRatioProp = computeRatio ? { computeRatio } : {};

        alias = measure.measure.alias ? measure.measure.alias : measure.measure.title;

        convertedDefinition = {
            measure: {
                item: {
                    uri: measureDefinition.item
                },
                ...filtersProp,
                ...aggregationProp,
                ...computeRatioProp
            }
        };
    } else {
        const popDefinition = (measure.measure.definition as VisObj.IPoPMeasureDefinition).popMeasureDefinition;
        alias = `${measure.measure.alias ? measure.measure.alias : measure.measure.title} - ${translatedPopSuffix}`;

        convertedDefinition = {
            popMeasure: {
                measureIdentifier: popDefinition.measureIdentifier,
                popAttribute: {
                    uri: popDefinition.popAttribute
                }
            }
        };
    }

    const aliasProp = alias ? { alias } : {};

    const format = measure.measure.format;
    const formatProp = format ? { format } : {};

    return {
        localIdentifier: measure.measure.localIdentifier,
        definition: convertedDefinition,
        ...aliasProp,
        ...formatProp
    };
}

function convertFilter(filter: VisObj.EmbeddedFilter): AFM.CompatibilityFilter {
    if (VisObj.isEmbeddedDateFilter(filter)) {
        const dateFilter = (filter as VisObj.IEmbeddedDateFilter).dateFilter;

        if (dateFilter.from === undefined || dateFilter.to === undefined) {
            return;
        }

        if (dateFilter.type === 'relative') {
            return {
                relativeDateFilter: {
                    dataSet: {
                        uri: dateFilter.dataset
                    },
                    granularity: dateFilter.granularity,
                    from: parseInt(dateFilter.from as string, 10),
                    to: parseInt(dateFilter.to as string, 10)
                }
            };
        }

        return {
            absoluteDateFilter: {
                dataSet: {
                    uri: dateFilter.dataset
                },
                from: dateFilter.from as string,
                to: dateFilter.to as string
            }
        };
    }

    const attributeFilter = (filter as VisObj.IEmbeddedListAttributeFilter).listAttributeFilter;

    if (!attributeFilter.default.attributeElements.length) {
        return;
    }

    if (attributeFilter.default.negativeSelection) {
        return {
            negativeAttributeFilter: {
                displayForm: {
                    uri: attributeFilter.displayForm
                },
                notIn: attributeFilter.default.attributeElements
            }
        };
    }

    return {
        positiveAttributeFilter: {
            displayForm: {
                uri: attributeFilter.displayForm
            },
            in: attributeFilter.default.attributeElements
        }
    };
}

function convertMeasureFilter(filter: VisObj.MeasureFilter): AFM.FilterItem {
    if (VisObj.isAttributeFilter(filter)) {
        if (VisObj.isPositiveAttributeFilter(filter)) {
            const positiveFilter = (filter as VisObj.IPositiveAttributeFilter).positiveAttributeFilter;
            return {
                positiveAttributeFilter: {
                    displayForm: {
                        uri: positiveFilter.displayForm
                    },
                    in: positiveFilter.in
                }
            };
        }
        const negativeFilter = (filter as VisObj.INegativeAttributeFilter).negativeAttributeFilter;
        return {
            negativeAttributeFilter: {
                displayForm: {
                    uri: negativeFilter.displayForm
                },
                notIn: negativeFilter.notIn
            }
        };
    }

    if (VisObj.isAbsoluteDateFilter(filter)) {
        const absoluteDateFilter = (filter as VisObj.IAbsoluteDateFilter).absoluteDateFilter;
        return {
            absoluteDateFilter: {
                dataSet: {
                    uri: absoluteDateFilter.dataSet
                },
                from: absoluteDateFilter.from,
                to: absoluteDateFilter.to
            }
        };
    }

    const relativeDateFilter = (filter as VisObj.IRelativeDateFilter).relativeDateFilter;
    return {
        relativeDateFilter: {
            dataSet: {
                uri: relativeDateFilter.dataSet
            },
            granularity: relativeDateFilter.granularity,
            from: relativeDateFilter.from,
            to: relativeDateFilter.to
        }
    };
}

function getMeasures(buckets: VisObj.IBucket[]): VisObj.IMeasure[] {
    return buckets.reduce((result: VisObj.IMeasure[], bucket: VisObj.IBucket) => {
        const measureItems = filter(bucket.items, VisObj.isMeasure) as VisObj.IMeasure[];

        return result.concat(measureItems);
    }, []);
}

function getAttributes(buckets: VisObj.IBucket[]): VisObj.IVisualizationAttribute[] {
    return buckets.reduce((result: VisObj.IVisualizationAttribute[], bucket: VisObj.IBucket) => {
        const measureItems = filter(bucket.items, VisObj.isAttribute) as VisObj.IVisualizationAttribute[];

        return result.concat(measureItems);
    }, []);
}

function convertSorting(visObj: VisObj.IVisualizationObjectContent): AFM.SortItem[] {
    if (visObj.properties) {
        const properties = JSON.parse(visObj.properties);

        const sorts = get(properties, 'sorts') as AFM.SortItem[];
        return sorts ? sorts : [];
    }

    return [];
}

function shouldGenerateDimensions(afm: AFM.IAfm) {
    const normalizedAfm = normalizeAfm(afm);
    return normalizedAfm.measures.length > 0 || normalizedAfm.attributes.length > 0;
}

type IAttributeToStringFunc = (category: VisObj.IVisualizationAttribute) => string;

function attributeToIdentFunc(afmAttributes: AFM.IAttribute[]): IAttributeToStringFunc  {
    return (attribute: VisObj.IVisualizationAttribute) => {
        const df = attribute.visualizationAttribute.displayForm;
        const afmAttribute = afmAttributes.find(a => (a.displayForm as AFM.IObjUriQualifier).uri === df);
        return get(afmAttribute, 'localIdentifier');
    };
}

// TODO: this will be delivered with vis obj
function convertResultSpec(
    visObj: VisObj.IVisualizationObjectContent,
    afm: AFM.IAfm,
    visType: VisObj.VisualizationType
): AFM.IResultSpec {

    const sorts = convertSorting(visObj);
    const sortsProp = sorts.length ? { sorts } : {};

    if (!shouldGenerateDimensions(afm)) {
        return {
            ...sortsProp
        };
    }

    const afmAttributes = afm.attributes;

    const dimensionIdentifiers = [
        getAttributes(visObj.buckets.filter(bucket => bucket.localIdentifier === 'categories'))
            .map(attributeToIdentFunc(afmAttributes)),
        getAttributes(visObj.buckets.filter(bucket => bucket.localIdentifier === 'stack'))
            .map(attributeToIdentFunc(afmAttributes))
    ];

    if (getMeasures(visObj.buckets).length > 0) {
        // for PIE chart with multiple metrics we need data like [[M1, M2, M3]] -> measureGroup in X
        const pieOnlyMeasures = visType === 'pie' && getAttributes(visObj.buckets).length === 0;
        const stackedChart = visObj.buckets.some(bucket => bucket.localIdentifier === 'stack');
        const measureGroupIndex = pieOnlyMeasures || stackedChart ? 0 : 1;
        dimensionIdentifiers[measureGroupIndex].push('measureGroup');
    }

    const dimensions = generateDimensions(dimensionIdentifiers, visObj.buckets);

    return {
        dimensions,
        ...sortsProp
    };
}

function generateDimensions(dimensionIdentifiers: string[][], buckets: VisObj.IBucket[]): AFM.IDimension[] {
    const dimensions: AFM.IDimension[] = [];

    dimensionIdentifiers.map((itemIdentifiers) => {
        const totals: AFM.ITotalItem[] = [];
        itemIdentifiers.map((itemIdentifier) => {
            if (itemIdentifier !== 'measureGroup') {
                buckets.map((bucket) => {
                    if (bucket.totals) {
                        totals.push(bucket.totals.find(total => total.attributeIdentifier === itemIdentifier));
                    }
                });
            }
        });

        const totalProp = totals.length ? {totals} : {};
        dimensions.unshift({
            itemIdentifiers,
            ...totalProp
        });
    });

    return dimensions;
}

export interface IConvertedAFM {
    afm: AFM.IAfm;
    resultSpec: AFM.IResultSpec;
}

export function toAFM(visObj: VisObj.IVisualizationObjectContent, translatedPopSuffix: string): IConvertedAFM {
    const afm = convertAFM(visObj, translatedPopSuffix);
    return {
        afm,
        resultSpec: convertResultSpec(visObj, afm, visObj.visType)
    };
}

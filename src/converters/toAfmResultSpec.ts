import flatten = require('lodash/flatten');
import compact = require('lodash/compact');
import { AFM } from '@gooddata/typings';
import { get } from 'lodash';

import { normalizeAfm } from '../utils/AfmUtils';
import * as VisObj from './model/VisualizationObject';

function getMeasureId(n: number, isPoP?: boolean, measure?: VisObj.IMeasure): string {
    if (measure && measure.measure.generatedId) {
        return measure.measure.generatedId;
    }
    return `m${n + 1}${isPoP ? '_pop' : ''}`;
}

function convertAttribute(attribute: VisObj.ICategory, idx: number): AFM.IAttribute {
    return {
        displayForm: {
            uri: attribute.category.displayForm
        },
        localIdentifier: `a${idx + 1}`
    };
}

function convertRelativeDateFilter(
    filter: VisObj.IEmbeddedDateFilter,
    dateDataSetUri: string
): AFM.IRelativeDateFilter {
    const granularity = filter.dateFilter.granularity;
    const relativeDateFilter: AFM.IRelativeDateFilter = {
        relativeDateFilter: {
            dataSet: {
                uri: dateDataSetUri
            },
            granularity,
            from: Number(filter.dateFilter.from),
            to: Number(filter.dateFilter.to)
        }
    };
    return relativeDateFilter;
}

function convertAbsoluteDateFilter(
    filter: VisObj.IEmbeddedDateFilter,
    dateDataSetUri: string
): AFM.IAbsoluteDateFilter {
    const absoluteDateFilter: AFM.IAbsoluteDateFilter = {
        absoluteDateFilter: {
            dataSet: {
                uri: dateDataSetUri
            },
            from: String(filter.dateFilter.from),
            to: String(filter.dateFilter.to)
        }
    };
    return absoluteDateFilter;
}

function convertDateFilter(filter: VisObj.IEmbeddedDateFilter): AFM.DateFilterItem {
    // skip All time date filters or broken filters with one of from/to undefined
    const { dateFilter } = filter;
    if (dateFilter.from === undefined || dateFilter.to === undefined) {
        return null;
    }
    const dateDataSetUri = filter.dateFilter.dataset;

    if (filter.dateFilter.type === 'relative') {
        return convertRelativeDateFilter(filter, dateDataSetUri);
    }
    return convertAbsoluteDateFilter(filter, dateDataSetUri);
}

function convertNegativeAttributeFilter(
    filter: VisObj.IEmbeddedListAttributeFilter
): AFM.INegativeAttributeFilter {
    const negativeFilter: AFM.INegativeAttributeFilter = {
        negativeAttributeFilter: {
            displayForm: {
                uri: filter.listAttributeFilter.displayForm
            },
            notIn: filter.listAttributeFilter.default.attributeElements
        }
    };
    return negativeFilter;
}

function convertPositiveAttributeFilter(
    filter: VisObj.IEmbeddedListAttributeFilter
): AFM.IPositiveAttributeFilter {
    const positiveFilter: AFM.IPositiveAttributeFilter = {
        positiveAttributeFilter: {
            displayForm: {
                uri: filter.listAttributeFilter.displayForm
            },
            in: filter.listAttributeFilter.default.attributeElements
        }
    };
    return positiveFilter;
}

function convertAttributeFilter(filter: VisObj.IEmbeddedListAttributeFilter): AFM.AttributeFilterItem {
    const items: string[] = filter.listAttributeFilter.default.attributeElements;
    // skip filters with ALL
    if (items.length === 0) {
        return null;
    }
    if (filter.listAttributeFilter.default.negativeSelection) {
        return convertNegativeAttributeFilter(filter);
    }
    return convertPositiveAttributeFilter(filter);
}

function convertFilter(filter: VisObj.EmbeddedFilter): AFM.FilterItem {
    if ((filter as VisObj.IEmbeddedDateFilter).dateFilter) {
        return convertDateFilter(filter as VisObj.IEmbeddedDateFilter);
    }

    return convertAttributeFilter(filter as VisObj.IEmbeddedListAttributeFilter);
}

function convertMeasureFilters(measure: VisObj.IMeasure): AFM.AttributeFilterItem[] {
    return measure.measure.measureFilters.map(convertFilter) as AFM.AttributeFilterItem[];
}

function convertMeasureAfm(
    measure: VisObj.IMeasure,
    index: number,
    popAttribute: string,
    translatedPopSuffix: string
): AFM.IMeasure[] {
    const computeRatioProp = measure.measure.showInPercent ? { computeRatio: true } : {};
    const aggregationProp = measure.measure.aggregation ? { aggregation: measure.measure.aggregation } : {};
    const filters = compact(convertMeasureFilters(measure));
    const filtersProp = filters.length ? { filters } : {};
    const aliasProp = measure.measure.title ? { alias: measure.measure.title } : {};
    const measures: AFM.IMeasure[] = [
        {
            localIdentifier: getMeasureId(index, false, measure),
            definition: {
                measure: {
                    item: {
                        uri: measure.measure.objectUri
                    },
                    ...aggregationProp,
                    ...computeRatioProp,
                    ...filtersProp
                }
            },
            ...aliasProp
        }
    ];

    if (measure.measure.showPoP) {
        const aliasPopProp = measure.measure.title
            ? { alias: `${measure.measure.title} - ${translatedPopSuffix}` }
            : {};
        const popMeasure: AFM.IMeasure = {
            localIdentifier: getMeasureId(index, true),
            definition: {
                popMeasure: {
                    measureIdentifier: getMeasureId(index),
                    popAttribute: {
                        uri: popAttribute
                    }
                }
            },
            ...aliasPopProp
        };

        measures.unshift(popMeasure);
    }

    return measures;
}

function convertSorting(visObj: VisObj.IVisualizationObjectContent): AFM.SortItem[] {
    const measureSorting = visObj.buckets.measures.map((measure, index) => {
        if (!measure.measure.sort) {
            return null;
        }
        const measureSort: AFM.IMeasureSortItem = {
            measureSortItem: {
                direction: measure.measure.sort.direction,
                locators: [
                    {
                        measureLocatorItem: {
                            measureIdentifier: getMeasureId(index, measure.measure.sort.sortByPoP)
                        }
                    }
                ]
            }
        };
        return measureSort;
    });

    const attributesSorting = visObj.buckets.categories.map((category, index) => {
        if (!category.category.sort) {
            return null;
        }

        const attributeSort: AFM.IAttributeSortItem = {
            attributeSortItem: {
                direction: category.category.sort,
                attributeIdentifier: `a${index + 1}`
           }
        };
        return attributeSort;
    });

    return compact([...measureSorting, ...attributesSorting]);
}

function getPoPAttribute(visObj: VisObj.IVisualizationObjectContent): string {
    const category = visObj.buckets.categories[0];

    if (category && category.category.type === 'date') {
        return category.category.attribute;
    }

    const filter: VisObj.IEmbeddedDateFilter = (visObj.buckets.filters as VisObj.IEmbeddedDateFilter[])
        .find((f: VisObj.IEmbeddedDateFilter) => {
            return !!f.dateFilter;
        });

    if (filter) {
        return filter.dateFilter.attribute;
    }

    return null;
}

function convertAFM(visObj: VisObj.IVisualizationObjectContent, translatedPopSuffix: string): AFM.IAfm {
    const attributes = visObj.buckets.categories.map(convertAttribute);
    const attributesProp = attributes.length ? { attributes } : {};

    const popAttribute = getPoPAttribute(visObj);
    const measures = flatten(visObj.buckets.measures.map((measure, index) => {
        return convertMeasureAfm(measure, index, popAttribute, translatedPopSuffix);
    }));
    const measuresProp = measures.length ? { measures } : {};

    const filters = compact(visObj.buckets.filters.map(convertFilter));
    const filtersProp = filters.length ? { filters } : {};

    return {
        ...measuresProp,
        ...attributesProp,
        ...filtersProp
    };
}

type ICategoryToStringFunc = (category: VisObj.ICategory) => string;

function categoryToIdentFunc(afmAttributes: AFM.IAttribute[]): ICategoryToStringFunc  {
    return (category: VisObj.ICategory) => {
        const df = category.category.displayForm;
        const attribute = afmAttributes.find(a => (a.displayForm as AFM.IObjUriQualifier).uri === df);
        return get(attribute, 'localIdentifier');
    };
}

// TODO duplicated from https://github.com/gooddata/gdc-analytical-designer/blob/489ddc1/app/models/metadata.js#L65
const visTypeToXySpec = {
    table: {
        x: 'attribute'
    },
    column: {
        x: 'view',
        y: 'stack'
    },
    bar: {
        x: 'view',
        y: 'stack'
    },
    line: {
        x: 'trend',
        y: 'segment'
    },
    pie: {
        x: 'view'
    }
};

function shouldGenerateDimensions(afm: AFM.IAfm) {
    const normalizedAfm = normalizeAfm(afm);
    return normalizedAfm.measures.length > 0 || normalizedAfm.attributes.length > 0;
}

function convertResultSpec(
    visObj: VisObj.IVisualizationObjectContent,
    afm: AFM.IAfm
): AFM.IResultSpec {
    // TODO move this somewhere close to visualizations
    const sorts = convertSorting(visObj);
    const sortsProp = sorts.length ? { sorts } : {};

    const { categories, measures } = visObj.buckets;
    const xySpec = visTypeToXySpec[visObj.type];

    if (!shouldGenerateDimensions(afm)) {
        return {
            ...sortsProp
        };
    }

    const afmAttributes = afm.attributes;
    const dimensions = [
        categories.filter(c => c.category.collection === xySpec.x).map(categoryToIdentFunc(afmAttributes)),
        categories.filter(c => c.category.collection === xySpec.y).map(categoryToIdentFunc(afmAttributes))
    ];

    if (measures.length > 0) {
        // for PIE chart with multiple metrics we need data like [[M1, M2, M3]] -> measureGroup in X
        const pieOnlyMeasures = visObj.type === 'pie' && categories.length === 0;
        const stackedChart = categories.some(c => c.category.collection === 'stack'); // TODO tests
        const measureGroupIndex = pieOnlyMeasures || stackedChart ? 0 : 1;
        dimensions[measureGroupIndex].push('measureGroup'); // TODO tests
    }

    return {
        dimensions: [ // means that data is returned in array[dim1][dim0]
            { itemIdentifiers: dimensions[0] }, // dimension 0
            { itemIdentifiers: dimensions[1] }, // dimension 1
        ],
        ...sortsProp
    };
}

export interface IConvertedAFM {
    afm: AFM.IAfm;
    resultSpec: AFM.IResultSpec;
    type: VisObj.VisualizationType;
}

export function toAfmResultSpec(
    visObj: VisObj.IVisualizationObjectContent,
    translatedPopSuffix: string
): IConvertedAFM {
    const afm = convertAFM(visObj, translatedPopSuffix);

    return {
        type: visObj.type,
        afm,
        resultSpec: convertResultSpec(visObj, afm)
    };
}

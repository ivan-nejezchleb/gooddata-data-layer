import { IVisualizationObjectContent, TotalType } from '../../model/VisualizationObject';
import {
    ATTRIBUTE_DISPLAY_FORM_URI,
    ATTRIBUTE_URI,
    ATTRIBUTE_DISPLAY_FORM_URI_2,
    ATTRIBUTE_URI_2,
    DATE_DATA_SET_URI,
    DATE_DISPLAY_FORM_URI,
    DATE_URI
} from './Afm.fixtures';

const simpleMeasure: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [
        {
            localIdentifier: 'measures',
            items: [
                {
                    measure: {
                        localIdentifier: 'm1',
                        alias: 'Measure M1',
                        definition: {
                            measureDefinition: {
                                item: '/gdc/md/project/obj/metric.id'
                            }
                        }
                    }
                }
            ]
        }]
};

const filteredMeasure: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [
        {
            localIdentifier: 'measures',
            items: [
                {
                    measure: {
                        localIdentifier: 'm1',
                        alias: 'Measure M1',
                        definition: {
                            measureDefinition: {
                                item: '/gdc/md/project/obj/metric.id',
                                filters: [
                                    {
                                        positiveAttributeFilter: {
                                            displayForm: ATTRIBUTE_DISPLAY_FORM_URI,
                                            in: [
                                                `${ATTRIBUTE_URI}?id=1`,
                                                `${ATTRIBUTE_URI}?id=2`
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        }
    ]
};

const measureWithRelativeDate: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [
        {
            localIdentifier: 'measures',
            items: [
                {
                    measure: {
                        localIdentifier: 'm1',
                        alias: 'Measure M1',
                        definition: {
                            measureDefinition: {
                                item: '/gdc/md/project/obj/metric.id',
                                filters: [
                                    {
                                        relativeDateFilter: {
                                            dataSet: DATE_DATA_SET_URI,
                                            granularity: 'GDC.time.date',
                                            from: -89,
                                            to: 0
                                        }
                                    }, {
                                        positiveAttributeFilter: {
                                            displayForm: ATTRIBUTE_DISPLAY_FORM_URI,
                                            in: [
                                                `${ATTRIBUTE_URI}?id=1`,
                                                `${ATTRIBUTE_URI}?id=2`
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        }
    ]
};

const measureWithAbsoluteDate: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [
        {
            localIdentifier: 'measures',
            items: [{
                measure: {
                    localIdentifier: 'm1',
                    alias: 'Measure M1',
                    definition: {
                        measureDefinition: {
                            item: '/gdc/md/project/obj/metric.id',
                            filters: [
                                {
                                    absoluteDateFilter: {
                                        dataSet: DATE_DATA_SET_URI,
                                        from: '2016-01-01',
                                        to: '2017-01-01'
                                    }
                                }, {
                                    positiveAttributeFilter: {
                                        displayForm: ATTRIBUTE_DISPLAY_FORM_URI,
                                        in: [
                                            `${ATTRIBUTE_URI}?id=1`,
                                            `${ATTRIBUTE_URI}?id=2`
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            }]
        }
    ]
};

const factBasedMeasure: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [
        {
            localIdentifier: 'measures',
            items: [
                {
                    measure: {
                        localIdentifier: 'm1',
                        alias: 'SUM of Measure M1',
                        definition: {
                            measureDefinition: {
                                item: '/gdc/md/project/obj/fact.id',
                                aggregation: 'sum'
                            }
                        }
                    }
                }
            ]
        }]
};

const attributeBasedMeasure: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [
        {
            localIdentifier: 'measures',
            items: [
                {
                    measure: {
                        localIdentifier: 'm1',
                        alias: 'COUNT of Measure M1',
                        definition: {
                            measureDefinition: {
                                item: ATTRIBUTE_DISPLAY_FORM_URI,
                                aggregation: 'count'
                            }
                        }
                    }
                }
            ]
        }]
};

const showInPercent: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [
        {
            localIdentifier: 'measures',
            items: [
                {
                    measure: {
                        localIdentifier: 'm1',
                        alias: 'Measure M1',
                        format: '#,##0.00%',
                        definition: {
                            measureDefinition: {
                                item: '/gdc/md/project/obj/metric.id',
                                computeRatio: true,
                            }
                        }
                    }
                }
            ]
        }, {
            localIdentifier: 'categories',
            items: [
                {
                    visualizationAttribute: {
                        localIdentifier: 'a1',
                        displayForm: ATTRIBUTE_DISPLAY_FORM_URI
                    }
                }
            ]
        }]
};

const showInPercentWithDate: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [
        {
            localIdentifier: 'measures',
            items: [
                {
                    measure: {
                        localIdentifier: 'm1',
                        alias: 'Measure M1',
                        format: '#,##0.00%',
                        definition: {
                            measureDefinition: {
                                item: '/gdc/md/project/obj/metric.id',
                                computeRatio: true,
                            }
                        }
                    }
                }
            ]
        }, {
            localIdentifier: 'categories',
            items: [
                {
                    visualizationAttribute: {
                        localIdentifier: 'a1',
                        displayForm: DATE_DISPLAY_FORM_URI
                    }
            }]
        }]
    };

const measureWithSorting: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [
        {
            localIdentifier: 'measures',
            items: [
                {
                    measure: {
                        localIdentifier: 'm1',
                        alias: 'Measure M1',
                        definition: {
                            measureDefinition: {
                                item: '/gdc/md/project/obj/metric.id'
                            }
                        }
                    }
                }
            ]
        }],

    // tslint:disable-next-line:max-line-length
    properties: '{"sorts":[{"measureSortItem":{"direction":"desc","locators":[{"measureLocatorItem":{"measureIdentifier":"m1"}}]}}]}'
};

const popMeasure: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [
        {
            localIdentifier: 'measures',
            items: [
                {
                    measure: {
                        localIdentifier: 'm1_pop',
                        alias: 'Measure M1',
                        definition: {
                            popMeasureDefinition: {
                                measureIdentifier: 'm1',
                                popAttribute: ATTRIBUTE_URI
                            }
                        }
                    }
                },
                {
                    measure: {
                        localIdentifier: 'm1',
                        alias: 'Measure M1',
                        definition: {
                            measureDefinition: {
                                item: '/gdc/md/project/obj/metric.id'
                            }
                        }
                    }
                }
            ]
        }, {
            localIdentifier: 'categories',
            items: [
                {
                    visualizationAttribute: {
                        localIdentifier: 'a1',
                        displayForm: ATTRIBUTE_DISPLAY_FORM_URI
                    }
                }]
            }],
    // tslint:disable-next-line:max-line-length
    properties: '{"sorts":[{"measureSortItem":{"direction":"desc","locators":[{"measureLocatorItem":{"measureIdentifier":"m1"}}]}}]}'
};

const popMeasureWithSorting: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [
        {
            localIdentifier: 'measures',
            items: [
                {
                    measure: {
                        localIdentifier: 'm1_pop',
                        alias: 'Measure M1',
                        definition: {
                            popMeasureDefinition: {
                                measureIdentifier: 'm1',
                                popAttribute: ATTRIBUTE_URI
                            }
                        }
                    }
                },
                {
                    measure: {
                        localIdentifier: 'm1',
                        alias: 'Measure M1',
                        definition: {
                            measureDefinition: {
                                item: '/gdc/md/project/obj/metric.id'
                            }
                        }
                    }
                }
            ]
        }, {
            localIdentifier: 'categories',
            items: [{
                visualizationAttribute: {
                    localIdentifier: 'a1',
                    displayForm: ATTRIBUTE_DISPLAY_FORM_URI
                }
            }]
        }],
    // tslint:disable-next-line:max-line-length
    properties: '{"sorts":[{"measureSortItem":{"direction":"desc","locators":[{"measureLocatorItem":{"measureIdentifier":"m1_pop"}}]}}]}'
};

const categoryWithSorting: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [
        {
            localIdentifier: 'categories',
            items: [
                {
                    visualizationAttribute: {
                        localIdentifier: 'a1',
                        displayForm: ATTRIBUTE_DISPLAY_FORM_URI
                    }
                }
            ]
        }],
    // tslint:disable-next-line:max-line-length
    properties: '{"sorts":[{"attributeSortItem":{"direction":"desc","attributeIdentifier":"a1"}}]}',
};

const attributeFilter: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [],
    filters: [
            {
                listAttributeFilter: {
                    attribute: ATTRIBUTE_URI,
                    displayForm: ATTRIBUTE_DISPLAY_FORM_URI,
                    default: {
                        negativeSelection: false,
                        attributeElements: [
                            `${ATTRIBUTE_URI}?id=1`,
                            `${ATTRIBUTE_URI}?id=2`,
                            `${ATTRIBUTE_URI}?id=3`
                        ]
                    }
                }
            },
            {
                listAttributeFilter: {
                    attribute: ATTRIBUTE_URI_2,
                    displayForm: ATTRIBUTE_DISPLAY_FORM_URI_2,
                    default: {
                        negativeSelection: false,
                        attributeElements: [
                            `${ATTRIBUTE_URI_2}?id=a`
                        ]
                    }
                }
            }]
        };

const dateFilter: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [],
    filters: [{
        dateFilter: {
            attribute: DATE_URI,
            dataset: DATE_DATA_SET_URI,
            from: -89,
            granularity: 'GDC.time.date',
            to: 0,
            type: 'relative'
        }
    }]
};

const dateFilterWithStrings: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [],
    filters: [{
        dateFilter: {
            attribute: DATE_URI,
            dataset: DATE_DATA_SET_URI,
            from: '-89',
            granularity: 'GDC.time.date',
            to: '0',
            type: 'relative'
        }
    }]
};

const dateFilterWithUndefs: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [],
    filters: [{
        dateFilter: {
            attribute: DATE_URI,
            dataset: DATE_DATA_SET_URI,
            granularity: 'GDC.time.date',
            type: 'relative'
        }
    }]
};

const attributeFilterWithAll: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [],
    filters: [
        {
            listAttributeFilter: {
                attribute: ATTRIBUTE_URI,
                displayForm: ATTRIBUTE_DISPLAY_FORM_URI,
                default: {
                    negativeSelection: true,
                    attributeElements: []
                }
            }
        },
        {
            listAttributeFilter: {
                attribute: ATTRIBUTE_URI_2,
                displayForm: ATTRIBUTE_DISPLAY_FORM_URI_2,
                default: {
                    negativeSelection: false,
                    attributeElements: [
                        `${ATTRIBUTE_URI_2}?id=a`
                    ]
                }
            }
        }
    ]
};

const stackingAttribute: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [
        {
            localIdentifier: 'measures',
            items: [
                {
                    measure: {
                        localIdentifier: 'm1',
                        alias: 'Sum of Bundle cost',
                        format: '#,##0.00',
                        definition: {
                            measureDefinition: {
                                item: '/gdc/md/project/obj/metric.id',
                                aggregation: 'sum',
                            }
                        }
                    }
                }
            ]
        }, {
            localIdentifier: 'categories',
            items: [{
                visualizationAttribute: {
                    localIdentifier: 'a1',
                    displayForm: DATE_DISPLAY_FORM_URI
                }
            }]
        }, {
            localIdentifier: 'stack',
            items: [
                {
                    visualizationAttribute: {
                        localIdentifier: 'a2',
                        displayForm: ATTRIBUTE_DISPLAY_FORM_URI
                    }
                }
            ]
        }],
    filters: [
        {
            dateFilter: {
                type: 'relative',
                from: -3,
                to: 0,
                granularity: 'GDC.time.quarter',
                dataset: DATE_DATA_SET_URI,
            }
        },
        {
            listAttributeFilter: {
                displayForm: ATTRIBUTE_DISPLAY_FORM_URI,
                default: {
                    negativeSelection: true,
                    attributeElements: [`${ATTRIBUTE_URI}?id=1`]
                }
            }
        }
    ]
};

export const charts = {
    bar: {
        simpleMeasure,
        filteredMeasure,
        measureWithRelativeDate,
        measureWithAbsoluteDate,
        factBasedMeasure,
        attributeBasedMeasure,
        showInPercent,
        showInPercentWithDate,
        measureWithSorting,
        popMeasure,
        popMeasureWithSorting,
        categoryWithSorting,
        dateFilter,
        dateFilterWithStrings,
        dateFilterWithUndefs,
        attributeFilter,
        attributeFilterWithAll,
        stackingAttribute
    }
};

export const attributeWithIdentifier: IVisualizationObjectContent = {
    visualizationClass: 'visClassUri',
    visType: 'bar',
    buckets: [{
        localIdentifier: 'measures',
        items: [
            {
                measure: {
                    localIdentifier: 'm1',
                    alias: 'm1',
                    definition: {
                        measureDefinition: {
                            item: 'foo'
                        }
                    }
                }
            }
        ]
    }, {
        localIdentifier: 'categories',
        items: [
            {
                visualizationAttribute: {
                    localIdentifier: 'bar',
                    displayForm: ATTRIBUTE_DISPLAY_FORM_URI,
                    alias: 'Attribute Bar'
                }
            }
        ]
    }]
};

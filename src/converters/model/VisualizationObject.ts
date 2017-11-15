export type SortDirection = 'asc' | 'desc';

export type EmbeddedFilter = IEmbeddedDateFilter | IEmbeddedListAttributeFilter;

export type EmbeddedDateFilterType = 'relative' | 'absolute';

export type AttributeFilter = IPositiveAttributeFilter | INegativeAttributeFilter;
export type DateFilter = IAbsoluteDateFilter | IRelativeDateFilter;
export type MeasureFilter = AttributeFilter | DateFilter;
export type Identifier = string;
export type TotalType = 'sum' | 'avg' | 'max' | 'min' | 'nat' | 'med';
export type CategoryCollection = 'attribute' | 'stack' | 'view' | 'trend' | 'segment';
export type VisualizationType = 'table' | 'line' | 'column' | 'bar' | 'pie' | 'doughnut' | 'combo';
export type VisualizationStyleType = 'common' | 'table' | 'line' | 'column' | 'bar';
export type MeasureType = 'metric' | 'fact' | 'attribute';
export type MeasureAggregation = 'sum' | 'count' | 'avg' | 'min' | 'max' | 'median' | 'runsum';
export type BucketItem = IMeasure | IVisualizationAttribute;
export type SortItem = IAttributeSortItem | IMeasureSortItem;
export type LocatorItem =   IAttributeLocatorItem | IMeasureLocatorItem;

export interface IAttributeSortItem {
    attributeSortItem: {
        direction: 'asc' | 'desc';
        attributeIdentifier: Identifier
    };
}

export interface IMeasureSortItem {
    measureSortItem: {
        direction: 'asc' | 'desc',
        locators: LocatorItem[]
    };
}

export interface IAttributeLocatorItem {
    attributeLocatorItem: {
        attributeIdentifier: Identifier,
        element: string // URI
    };
}

export interface IMeasureLocatorItem {
    measureLocatorItem: {
        measureIdentifier: Identifier
    };
}

export interface IEmbeddedDateFilter {
    dateFilter: {
        type: EmbeddedDateFilterType;
        from?: string | number;
        to?: string | number;
        granularity: string;
        attribute?: string;
        dataset?: string;
        dimension?: string;
    };
}

export interface IEmbeddedListAttributeFilter {
    listAttributeFilter: {
        attribute?: string;
        displayForm: string;
        'default': {
            negativeSelection: boolean;
            attributeElements: string[];
        }
    };
}

export interface IMeasureSort {
    direction: SortDirection;
    sortByPoP?: boolean;
}

export interface IVisualizationStyle {
    visualizationStyle: {
        type: VisualizationStyleType;
        colorPalette: {
            measure?: {
                color: string;
                periodOverPeriod: string;
            }

            stack?: any
        }
    };
}

export interface IMeasureDefinition {
    measureDefinition: {
        item: string; // URISTRING
        aggregation?: MeasureAggregation;
        filters?: MeasureFilter[];
        computeRatio?: boolean;
    };
}

export interface IPoPMeasureDefinition {
    popMeasureDefinition: {
        measureIdentifier: Identifier;
        popAttribute: string;
    };
}

export interface IPositiveAttributeFilter {
    positiveAttributeFilter: {
        displayForm: string;
        in: string[];
    };
}

export interface INegativeAttributeFilter {
    negativeAttributeFilter: {
        displayForm: string;
        notIn: string[];
    };
}

export interface IAbsoluteDateFilter {
    absoluteDateFilter: {
        dataSet: string;
        from: string;
        to: string;
    };
}

export interface IRelativeDateFilter {
    relativeDateFilter: {
        dataSet: string; // URISTRING
        granularity: string;
        from: number;
        to: number;
    };
}

export interface ITotalItem {
    measureIdentifier: Identifier;
    type: TotalType;
    attributeIdentifier: string;
}

export type CategoryType = 'attribute' | 'date';

export interface ICategory {
    category: {
        type: CategoryType;
        collection: CategoryCollection;
        displayForm: string;
        attribute?: string;
        sort?: SortDirection;
        styles?: IVisualizationStyle[];
    };
}

export interface IVisualizationObject {
    meta: IVisualizationObjectMeta;
    content: IVisualizationObjectContent;
}

export interface IVisualization {
    visualization: IVisualizationObject;
}

export interface IVisualizationObjectResponse {
    visualization: IVisualizationObject;
}

export interface IVisualizationObjectMeta {
    author?: string;
    category?: string;
    contributor?: string;
    created?: Date;
    deprecated?: boolean;
    identifier?: string;
    isProduction?: boolean;
    locked?: boolean;
    projectTemplate?: string;
    sharedWithSomeone?: boolean;
    summary?: string;
    tags?: string;
    title: string;
    unlisted?: boolean;
    updated?: Date;
    uri?: string;
}

export interface IVisualizationObjectContent {
    visualizationClass: string;
    buckets: IBucket[];
    visType: VisualizationType; // TODO: delete
    filters?: EmbeddedFilter[];
    properties?: string;
    references?: IReferenceItem[];
}

export interface IReferenceItem {
    [identifier: string]: string;
}

export interface IBucket {
    localIdentifier?: Identifier;
    items: BucketItem[];
    totals?: ITotalItem[];
}

export interface IMeasure {
    measure: {
        localIdentifier: Identifier;
        definition: IMeasureDefinition | IPoPMeasureDefinition
        alias?: string;
        title?: string,
        format?: string;
    };
}

export interface IVisualizationAttribute {
    visualizationAttribute: {
        localIdentifier: Identifier;
        displayForm: string,
        alias?: string
    };
}

export interface IAttributesMap {
    [x: string]: string;
}

export interface IMeasuresMap {
    [x: string]: Partial<IMeasure>;
}

export interface IVisualizationMetadataResult {
    metadata: IVisualizationObject;
    measuresMap: IMeasuresMap;
}

export function isEmbeddedDateFilter(dateFilter: EmbeddedFilter): dateFilter is IEmbeddedDateFilter {
    return (dateFilter as IEmbeddedDateFilter).dateFilter !== undefined;
}

export function isMeasure(bucketItem: IMeasure | IVisualizationAttribute): bucketItem is IMeasure {
    return (bucketItem as IMeasure).measure !== undefined;
}

export function isVisualizationAttribute(bucketItem: IMeasure | IVisualizationAttribute)
: bucketItem is IVisualizationAttribute {
        return (bucketItem as IVisualizationAttribute).visualizationAttribute !== undefined;
}

export function isMeasureDefinition(definition: IMeasureDefinition | IPoPMeasureDefinition)
: definition is IMeasureDefinition {
    return (definition as IMeasureDefinition).measureDefinition !== undefined;
}

export function isAttributeFilter(filter: MeasureFilter): filter is AttributeFilter {
    return (filter as IPositiveAttributeFilter).positiveAttributeFilter !== undefined ||
        (filter as INegativeAttributeFilter).negativeAttributeFilter !== undefined;
}

export function isPositiveAttributeFilter(filter: AttributeFilter): filter is IPositiveAttributeFilter {
    return (filter as IPositiveAttributeFilter).positiveAttributeFilter !== undefined;
}

export function isAbsoluteDateFilter(filter: DateFilter): filter is IAbsoluteDateFilter {
    return (filter as IAbsoluteDateFilter).absoluteDateFilter !== undefined;
}

export function isAttribute(bucketItem: BucketItem): bucketItem is IVisualizationAttribute {
    return (bucketItem as IVisualizationAttribute).visualizationAttribute !== undefined;
}

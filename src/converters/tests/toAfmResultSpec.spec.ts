import { toAfmResultSpec } from '../toAfmResultSpec';

import {
    // empty,
    simpleMeasure,
    filteredMeasure,
    measureWithAbsoluteDate,
    measureWithRelativeDate,
    popMeasure,
    popMeasureWithSorting,
    showInPercent,
    showInPercentWithDate,
    measureWithSorting,
    categoryWithSorting,
    factBasedMeasure,
    attributeBasedMeasure,
    stackingAttribute,
    attributeFilter,
    attributeFilterWithAll,
    dateFilter,
    dateFilterWithoutInterval,
    segmentedAndTrendedLineChart,
    measuresOnlyPieChart
    // attributeWithIdentifier,
    // ATTRIBUTE_URI,
    // ATTRIBUTE_DISPLAY_FORM_URI
} from './fixtures/Afm.fixtures';

import { charts } from './fixtures/VisObj.fixtures';
describe('toAfmResultSpec', () => {
    it('should convert simple measures', () => {
        expect(toAfmResultSpec(charts.bar.simpleMeasure)).toEqual({
            ...simpleMeasure,
            type: 'bar'
        });
    });

    it('should convert filtered measures', () => {
        expect(toAfmResultSpec(charts.bar.filteredMeasure)).toEqual({
            ...filteredMeasure,
            type: 'bar'
        });
    });

    it('should convert relative date filtered measures', () => {
        expect(toAfmResultSpec(charts.bar.measureWithRelativeDate)).toEqual({
            ...measureWithRelativeDate,
            type: 'bar'
        });
    });

    it('should convert absolute date filtered measures', () => {
        expect(toAfmResultSpec(charts.bar.measureWithAbsoluteDate)).toEqual({
            ...measureWithAbsoluteDate,
            type: 'bar'
        });
    });

    it('should convert fact based measures', () => {
        expect(toAfmResultSpec(charts.bar.factBasedMeasure)).toEqual({
            ...factBasedMeasure,
            type: 'bar'
        });
    });

    it('should convert attribute based measures', () => {
        expect(toAfmResultSpec(charts.bar.attributeBasedMeasure)).toEqual({
            ...attributeBasedMeasure,
            type: 'bar'
        });
    });

    it('should convert measure with show in percent with attribute', () => {
        expect(toAfmResultSpec(charts.bar.showInPercent)).toEqual({
            ...showInPercent,
            type: 'bar'
        });
    });

    it('should convert measure with show in percent with date', () => {
        expect(toAfmResultSpec(charts.bar.showInPercentWithDate)).toEqual({
            ...showInPercentWithDate,
            type: 'bar'
        });
    });

    it('should convert measure with sorting', () => {
        expect(toAfmResultSpec(charts.bar.measureWithSorting)).toEqual({
            ...measureWithSorting,
            type: 'bar'
        });
    });

    it('should convert pop measure', () => {
        expect(toAfmResultSpec(charts.bar.popMeasure)).toEqual({
            ...popMeasure,
            type: 'bar'
        });
    });

    it('should convert pop measure with sorting', () => {
        expect(toAfmResultSpec(charts.bar.popMeasureWithSorting)).toEqual({
            ...popMeasureWithSorting,
            type: 'bar'
        });
    });

    it('should convert category with sorting', () => {
        expect(toAfmResultSpec(charts.bar.categoryWithSorting)).toEqual({
            ...categoryWithSorting,
            type: 'bar'
        });
    });

    it('should convert attribute filter', () => {
        expect(toAfmResultSpec(charts.bar.attributeFilter)).toEqual({
            ...attributeFilter,
            type: 'bar'
        });
    });

    it('should convert date filter', () => {
        expect(toAfmResultSpec(charts.bar.dateFilter)).toEqual({
            ...dateFilter,
            type: 'bar'
        });
    });

    it('should convert date filter with from/to as strings', () => {
        expect(toAfmResultSpec(charts.bar.dateFilterWithStrings)).toEqual({
            ...dateFilter,
            type: 'bar'
        });
    });

    it('should skip filter when date filter from/to is undefined for relative (alltime)', () => {
        expect(toAfmResultSpec(charts.bar.dateFilterWithUndefs)).toEqual({
            ...dateFilterWithoutInterval,
            type: 'bar'
        });
    });

    it('should convert stacking attribute', () => {
        expect(toAfmResultSpec(charts.bar.stackingAttribute)).toEqual({
            ...stackingAttribute,
            type: 'bar'
        });
    });

    it('should skip attribute filter with ALL', () => {
        expect(toAfmResultSpec(charts.bar.attributeFilterWithAll)).toEqual({
            ...attributeFilterWithAll,
            type: 'bar'
        });
    });

    it('should convert segmented attribute for Line chart', () => {
        expect(toAfmResultSpec(charts.line.segmentedAndTrended)).toEqual({
            ...segmentedAndTrendedLineChart,
            type: 'line'
        });
    });

    it('should convert measures only for pie chart', () => {
        expect(toAfmResultSpec(charts.pie.measuresOnly)).toEqual({
            ...measuresOnlyPieChart,
            type: 'pie'
        });
    });
});

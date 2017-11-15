import {
    empty,
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
    attributeWithIdentifier,
    ATTRIBUTE_URI,
    ATTRIBUTE_DISPLAY_FORM_URI
} from './fixtures/Afm.fixtures';

import { charts } from './fixtures/VisObj.fixtures';

import { toVisObj, toAFM } from '../converters';
import { IAttributeHeader } from '../../interfaces/Header';

describe('converters', () => {
    // describe('toVisObj', () => {
    //     it('should handle attribute with identifier', () => {
    //         const { afm, resultSpec } = attributeWithIdentifier;

    //         expect(toVisObj(afm, 'visClassUri', '', resultSpec))
    //             .toEqual(visObjFixtures.attributeWithIdentifier);
    //     });

    //     it('should convert empty AFM to empty vis. object', () => {
    //         const { afm, transformation } = empty;

    //         expect(toVisObj(afm, transformation)).toEqual(visObjFixtures.emptyVisObj);
    //     });

    //     it('should convert simple measure', () => {
    //         const { afm, transformation } = simpleMeasure;

    //         expect(toVisObj(afm, transformation)).toEqual(charts.bar.simpleMeasure);
    //     });

    //     it('should convert fact based measure', () => {
    //         const { afm, transformation } = factBasedMeasure;

    //         expect(toVisObj(afm, transformation)).toEqual(charts.bar.factBasedMeasure);
    //     });

    //     it('should convert attribute base measure', () => {
    //         const { afm, transformation } = attributeBasedMeasure;

    //         expect(toVisObj(afm, transformation)).toEqual(charts.bar.attributeBasedMeasure);
    //     });

    //     it('should handle the case when no transformation is given', () => {
    //         const { afm } = simpleMeasure;

    //         expect(toVisObj(afm, null)).toEqual({
    //             visualizationClass: 'visClassUri',
    //             buckets: [
    //                 {
    //                     localIdentifier: 'measures',
    //                     items: [
    //                         {
    //                             measure: {
    //                                 localIdentifier: 'm1',
    //                                 alias: 'm1',
    //                                 definition: {
    //                                     measureDefinition: {
    //                                         item: '/gdc/md/project/obj/metric.id'
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     ]
    //                 }]
    //         });
    //     });

    //     it('should handle the case when no transformation is given for attribute', () => {
    //         const { afm } = showInPercent;

    //         expect(() => toVisObj(afm, null)).not.toThrow();
    //     });

    //     it('should convert filtered measures', () => {
    //         const { afm, transformation } = filteredMeasure;
    //         const attributeMap: AttributeMap = [
    //             {
    //                 attribute: ATTRIBUTE_URI,
    //                 attributeDisplayForm: ATTRIBUTE_DISPLAY_FORM_URI
    //             }
    //         ];

    //         expect(toVisObj(afm, transformation, null, attributeMap)).toEqual({
    //             ...charts.bar.filteredMeasure
    //         });
    //     });

    //     it('should convert show in percent measure with attribute', () => {
    //         const { afm, transformation } = showInPercent;

    //         expect(toVisObj(afm, transformation)).toEqual(charts.bar.showInPercent);
    //     });

    //     it('should convert show in percent measure with date', () => {
    //         const { afm, transformation } = showInPercentWithDate;

    //         expect(toVisObj(afm, transformation)).toEqual(charts.bar.showInPercentWithDate);
    //     });

    //     it('should apply sorting to simple measure', () => {
    //         const { afm, transformation } = measureWithSorting;

    //         expect(toVisObj(afm, transformation)).toEqual(charts.bar.measureWithSorting);
    //     });

    //     it('should handle measure with PoP', () => {
    //         const { afm, transformation } = popMeasure;

    //         expect(toVisObj(afm, transformation)).toEqual(charts.bar.popMeasure);
    //     });

    //     it('should handle measure with PoP with sorting', () => {
    //         const { afm, transformation } = popMeasureWithSorting;

    //         expect(toVisObj(afm, transformation)).toEqual(charts.bar.popMeasureWithSorting);
    //     });

    //     it('should apply sorting to category', () => {
    //         const { afm, transformation } = categoryWithSorting;

    //         expect(toVisObj(afm, transformation)).toEqual(charts.bar.categoryWithSorting);
    //     });

    //     it('should set attribute collection to stack', () => {
    //         const { afm, transformation } = stackingAttribute;

    //         expect(toVisObj(afm, transformation)).toEqual(charts.bar.stackingAttribute);
    //     });

    //     it('should convert relative date filtered measures', () => {
    //         const { afm, transformation } = measureWithRelativeDate;
    //         const attributeMap: AttributeMap = [
    //             {
    //                 attribute: ATTRIBUTE_URI,
    //                 attributeDisplayForm: ATTRIBUTE_DISPLAY_FORM_URI
    //             }
    //         ];

    //         expect(toVisObj(afm, transformation, null, attributeMap)).toEqual(charts.bar.measureWithRelativeDate);
    //     });

    //     it('should convert absolute date filtered measures', () => {
    //         const { afm, transformation } = measureWithAbsoluteDate;
    //         const attributeMap: AttributeMap = [
    //             {
    //                 attribute: ATTRIBUTE_URI,
    //                 attributeDisplayForm: ATTRIBUTE_DISPLAY_FORM_URI
    //             }
    //         ];

    //         expect(toVisObj(afm, transformation, null, attributeMap)).toEqual(charts.bar.measureWithAbsoluteDate);
    //     });
    // });

    describe('toAFM', () => {
        it('should convert simple measures', () => {
            expect(toAFM(charts.bar.simpleMeasure, 'translated-pop-suffix')).toEqual({
                ...simpleMeasure
            });
        });

        it('should convert filtered measures', () => {
            expect(toAFM(charts.bar.filteredMeasure, 'translated-pop-suffix')).toEqual({
                ...filteredMeasure
            });
        });

        it('should convert relative date filtered measures', () => {
            expect(toAFM(charts.bar.measureWithRelativeDate, 'translated-pop-suffix')).toEqual({
                ...measureWithRelativeDate
            });
        });

        it('should convert absolute date filtered measures', () => {
            expect(toAFM(charts.bar.measureWithAbsoluteDate, 'translated-pop-suffix')).toEqual({
                ...measureWithAbsoluteDate
            });
        });

        it('should convert fact based measures', () => {
            expect(toAFM(charts.bar.factBasedMeasure, 'translated-pop-suffix')).toEqual({
                ...factBasedMeasure
            });
        });

        it('should convert attribute based measures', () => {
            expect(toAFM(charts.bar.attributeBasedMeasure, 'translated-pop-suffix')).toEqual({
                ...attributeBasedMeasure
            });
        });

        it('should convert measure with show in percent with attribute', () => {
            expect(toAFM(charts.bar.showInPercent, 'translated-pop-suffix')).toEqual({
                ...showInPercent
            });
        });

        it('should convert measure with show in percent with date', () => {
            expect(toAFM(charts.bar.showInPercentWithDate, 'translated-pop-suffix')).toEqual({
                ...showInPercentWithDate
            });
        });

        it('should convert measure with sorting', () => {
            expect(toAFM(charts.bar.measureWithSorting, 'translated-pop-suffix')).toEqual({
                ...measureWithSorting
            });
        });

        it('should convert pop measure', () => {
            expect(toAFM(charts.bar.popMeasure, 'translated-pop-suffix')).toEqual({
                ...popMeasure
            });
        });

        it('should convert pop measure with sorting', () => {
            expect(toAFM(charts.bar.popMeasureWithSorting, 'translated-pop-suffix')).toEqual({
                ...popMeasureWithSorting
            });
        });

        it('should convert category with sorting', () => {
            expect(toAFM(charts.bar.categoryWithSorting, 'translated-pop-suffix')).toEqual({
                ...categoryWithSorting
            });
        });

        it('should convert attribute filter', () => {
            expect(toAFM(charts.bar.attributeFilter, 'translated-pop-suffix')).toEqual({
                ...attributeFilter
            });
        });

        it('should convert date filter', () => {
            expect(toAFM(charts.bar.dateFilter, 'translated-pop-suffix')).toEqual({
                ...dateFilter
            });
        });

        it('should convert date filter with from/to as strings', () => {
            expect(toAFM(charts.bar.dateFilterWithStrings, 'translated-pop-suffix')).toEqual({
                ...dateFilter
            });
        });

        it('should skip filter when date filter from/to is undefined for relative (alltime)', () => {
            expect(toAFM(charts.bar.dateFilterWithUndefs, 'translated-pop-suffix')).toEqual({
                ...dateFilterWithoutInterval
            });
        });

        it('should skip attribute filter with ALL', () => {
            expect(toAFM(charts.bar.attributeFilterWithAll, 'translated-pop-suffix')).toEqual({
                ...attributeFilterWithAll
            });
        });

        it('should convert stacking attribute', () => {
            expect(toAFM(charts.bar.stackingAttribute, 'translated-pop-suffix')).toEqual({
                ...stackingAttribute
            });
        });
    });
});

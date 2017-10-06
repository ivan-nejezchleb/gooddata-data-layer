import { AFM } from '@gooddata/typings';

import { applySorting } from '../ResultSpecUtils';

describe('applySorting', () => {
    const resultSpec: AFM.IResultSpec = {
        sorts: [
            {
                attributeSortItem: {
                    attributeIdentifier: 'a1',
                    direction: 'desc'
                }
            },
            {
                attributeSortItem: {
                    attributeIdentifier: 'a2',
                    direction: 'desc'
                }
            }
        ]
    };

    it('should not change resultSpec if sortItems are empty', () => {
        expect(applySorting(resultSpec, [])).toEqual(resultSpec);
    });

    it('should override existing sorting', () => {
        const sortItems: AFM.SortItem[] = [
            {
                attributeSortItem: {
                    attributeIdentifier: 'a3',
                    direction: 'desc'
                }
            }
        ];

        const expectedResultSpec: AFM.IResultSpec = {
            sorts: [
                {
                    attributeSortItem: {
                        attributeIdentifier: 'a3',
                        direction: 'desc'
                    }
                }
            ]
        };

        expect(applySorting(resultSpec, sortItems)).toEqual(expectedResultSpec);
    });
});

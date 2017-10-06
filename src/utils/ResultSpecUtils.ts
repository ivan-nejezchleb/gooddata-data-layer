import { AFM } from '@gooddata/typings';

export function applySorting(
    resultSpec: AFM.IResultSpec = {},
    sortItems: AFM.SortItem[] = []
): AFM.IResultSpec {
    if (sortItems.length === 0) {
        return resultSpec;
    }
    return {
        ...resultSpec,
        sorts: sortItems
    };
}

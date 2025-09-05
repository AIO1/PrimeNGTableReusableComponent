import { DataAlignVertical } from "../enums";

export function dataAlignVerticalAsText(dataAlignVertical: DataAlignVertical): string {
    switch (dataAlignVertical) {
        case DataAlignVertical.Top:
            return 'top';
        case DataAlignVertical.Middle:
            return 'middle';
        case DataAlignVertical.Bottom:
            return 'bottom';
        default:
            return 'middle';
    }
}
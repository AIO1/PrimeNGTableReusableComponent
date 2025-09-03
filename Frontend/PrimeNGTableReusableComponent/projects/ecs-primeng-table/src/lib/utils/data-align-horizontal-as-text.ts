import { DataAlignHorizontal } from "../enums";

export function dataAlignHorizontalAsText(dataAlignHorizontal: DataAlignHorizontal): string {
    switch (dataAlignHorizontal) {
        case DataAlignHorizontal.Left:
            return 'left';
        case DataAlignHorizontal.Center:
            return 'center';
        case DataAlignHorizontal.Right:
            return 'right';
        default:
            return 'center';
    }
}
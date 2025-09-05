import { DataType } from "../enums";

export function dataTypeAsText(dataType: DataType): string {
    switch (dataType) {
        case DataType.Text:
            return 'text';
        case DataType.Numeric:
            return 'numeric';
        case DataType.Boolean:
            return 'boolean';
        case DataType.Date:
            return 'date';
        default:
            return 'text';
    }
}
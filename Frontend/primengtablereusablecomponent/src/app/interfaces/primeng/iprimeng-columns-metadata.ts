export enum enumDataType {
    Text,
    Numeric,
    Boolean,
    Date
}
export enum enumDataAlign {
    Left,
    Center,
    Right,
}
export interface IprimengColumnsMetadata {
    field: string;
    header: string;
    dataType: enumDataType;
    dataAlign: enumDataAlign;
    canBeHidden: boolean;
    startHidden: boolean;
    canBeResized: boolean;
    canBeReordered: boolean;
    canBeSorted: boolean;
    canBeFiltered: boolean;
    filterUsesPredifinedValues: boolean;
    filterPredifinedValuesName: string;
    canBeGlobalFiltered: boolean;
    columnDescription: string;
    dataTooltip: boolean;
}
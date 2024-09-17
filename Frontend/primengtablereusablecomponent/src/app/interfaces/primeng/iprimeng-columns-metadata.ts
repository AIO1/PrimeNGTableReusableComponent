export interface IprimengColumnsMetadata {
    field: string;
    header: string;
    dataType: string;
    dataAlign: 'left' | 'center' | 'right';
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
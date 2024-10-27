export enum enumDataType {
    Text,
    Numeric,
    Boolean,
    Date
}
export enum enumDataAlignHorizontal {
    Left,
    Center,
    Right
}
export enum enumDataAlignVertical {
    Top,
    Middle,
    Bottom
}
export enum enumFrozenColumnAlign {
    Noone,
    Left,
    Right
}
export enum enumCellOverflowBehaviour {
    Hidden,
    Wrap/*,
    Ellipsis*/
}
export interface IprimengColumnsMetadata {
    field: string;
    header: string;
    dataType: enumDataType;
    dataAlignHorizontal: enumDataAlignHorizontal;
    dataAlignHorizontalAllowUserEdit: boolean;
    dataAlignVertical: enumDataAlignVertical;
    dataAlignVerticalAllowUserEdit: boolean;
    canBeHidden: boolean;
    startHidden: boolean;
    canBeResized: boolean;
    canBeReordered: boolean;
    canBeSorted: boolean;
    canBeFiltered: boolean;
    filterPredifinedValuesName: string;
    canBeGlobalFiltered: boolean;
    columnDescription: string;
    dataTooltipShow: boolean;
    dataTooltipCustomColumnSource: string;
    frozenColumnAlign: enumFrozenColumnAlign;
    cellOverflowBehaviour: enumCellOverflowBehaviour;
    cellOverflowBehaviourAllowUserEdit: boolean;
    initialWidth: number;
}
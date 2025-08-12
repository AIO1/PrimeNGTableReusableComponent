export enum ECSPrimengTableDataType {
    Text,
    Numeric,
    Boolean,
    Date
}
export enum ECSPrimengTableDataAlignHorizontal {
    Left,
    Center,
    Right
}
export enum ECSPrimengTableDataAlignVertical {
    Top,
    Middle,
    Bottom
}
export enum ECSPrimengTableFrozenColumnAlign {
    Noone,
    Left,
    Right
}
export enum ECSPrimengTableCellOverflowBehaviour {
    Hidden,
    Wrap/*,
    Ellipsis*/
}
export interface ECSPrimengTableColumnMetadata {
    field: string;
    header: string;
    dataType: ECSPrimengTableDataType;
    dataAlignHorizontal: ECSPrimengTableDataAlignHorizontal;
    dataAlignHorizontalAllowUserEdit: boolean;
    dataAlignVertical: ECSPrimengTableDataAlignVertical;
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
    frozenColumnAlign: ECSPrimengTableFrozenColumnAlign;
    cellOverflowBehaviour: ECSPrimengTableCellOverflowBehaviour;
    cellOverflowBehaviourAllowUserEdit: boolean;
    initialWidth: number;
}
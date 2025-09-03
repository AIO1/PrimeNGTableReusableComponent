import { CellOverflowBehaviour, DataAlignHorizontal, DataAlignVertical, DataType, FrozenColumnAlign } from "../enums";
export interface IColumnMetadata {
    field: string;
    header: string;
    dataType: DataType;
    dataAlignHorizontal: DataAlignHorizontal;
    dataAlignHorizontalAllowUserEdit: boolean;
    dataAlignVertical: DataAlignVertical;
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
    frozenColumnAlign: FrozenColumnAlign;
    cellOverflowBehaviour: CellOverflowBehaviour;
    cellOverflowBehaviourAllowUserEdit: boolean;
    initialWidth: number;
}
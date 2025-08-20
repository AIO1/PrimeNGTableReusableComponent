import { FrozenColumnAlign } from "../enums";

export function frozenColumnAlignAsText(frozenColumnAlign: FrozenColumnAlign): string {
    switch (frozenColumnAlign) {
      case FrozenColumnAlign.Left:
        return 'left';
      case FrozenColumnAlign.Right:
        return 'right';
      default:
        return 'left';
    }
  }
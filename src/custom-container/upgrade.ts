import { Data, SlotIds } from './constants';

export default function ({
    data,
    slot
}: UpgradeParams<Data>): boolean {
    /**
     * @description v1.0.1 slotStyle兼容
     */
    if (!data.slotStyle) {
        const contentSlot = slot.get(SlotIds.Content);
        const flexDirection = contentSlot?.getLayout()?.split('-')?.[1] || 'row';
        const alignItems = contentSlot?.getAlignItems() || 'flex-start';
        const justifyContent = contentSlot?.getJustifyContent() || 'flex-start';
        data.slotStyle = {
            display: "flex",
            position: "inherit",
            flexWrap: "nowrap",
            flexDirection,
            alignItems,
            justifyContent
        };
    }
    return true;
}
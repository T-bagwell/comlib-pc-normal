import { uuid } from '../../../utils';
import { WidthUnitEnum, Data, ColumnParams } from '../../constants';
export const createColByWidth = (width: number = 280) => {
  const id = uuid();
  return {
    key: id,
    slot: id,
    widthOption: WidthUnitEnum.Px,
    width,
    span: 4,
    colStyle: {
      overflowX: 'hidden',
      overflowY: 'hidden'
    },
    flex: 1,
    slotStyle: {
      display: 'flex',
      position: 'inherit',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexWrap: 'nowrap'
    }
  };
};

export const createAutoCol = (flex: number = 1) => {
  const id = uuid();
  return {
    key: id,
    slot: id,
    widthOption: WidthUnitEnum.Auto,
    width: 300,
    span: 4,
    colStyle: {
      overflowX: 'hidden',
      overflowY: 'hidden'
    },
    flex,
    slotStyle: {
      display: 'flex',
      position: 'inherit',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexWrap: 'nowrap'
    }
  };
};

export const createColBySpan = (span: number = 4) => {
  const id = uuid();
  return {
    key: id,
    slot: id,
    widthOption: WidthUnitEnum.Span,
    width: 300,
    span,
    colStyle: {
      overflowX: 'hidden',
      overflowY: 'hidden'
    },
    flex: 1,
    slotStyle: {
      display: 'flex',
      position: 'inherit',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexWrap: 'nowrap'
    }
  };
};

export function getRowIndex(data, focusArea) {
  const _key = focusArea.dataset.rowIndex;
  return data.rows.findIndex(({ key }) => key === _key);
}
// 获取行数据
export function getRowItem(data: Data, focusArea: any) {
  const index = getRowIndex(data, focusArea);
  return data.rows[index];
}

export function getColIndex(data, focusArea: any) {
  const [rowKey, colKey]: number[] = JSON.parse(focusArea.dataset.colCoordinate);
  const rowIndex = data.rows.findIndex(({ key }) => key === rowKey);
  const colIndex = data.rows[rowIndex].columns.findIndex(({ key }) => key === colKey);
  return [rowIndex, colIndex];
}
// 获取列数据
export function getColItem(data: Data, focusArea: any) {
  const [rowIndex, colIndex]: number[] = getColIndex(data, focusArea);
  return data.rows[rowIndex] && data.rows[rowIndex].columns[colIndex];
}

export function generateColumnsTitle({
  widthOption,
  span,
  width
}: {
  widthOption: WidthUnitEnum;
  span?: number;
  width?: number;
}) {
  switch (widthOption) {
    case WidthUnitEnum.Span:
      return `col-${span}`;
    case WidthUnitEnum.Px:
      return `固定（${width}px）`;
    case WidthUnitEnum.Auto:
      return `自适应`;
    case WidthUnitEnum.Media:
      return `响应式`;
    default:
      return `默认`;
  }
}

//更新行，最后一列默认“自动填充”
export const updateCol = (row, slot) => {
  const autoColIndex = row.columns.findIndex(
    ({ widthOption }) => widthOption === WidthUnitEnum.Auto
  );
  //除了最后一列，前面有“自动填充”列，不处理
  if (autoColIndex >= 0 && autoColIndex < row.columns.length - 1) return;
  //否则，保证最后一列是“自动填充”
  row.columns.forEach((col, index) => {
    if (index === row.columns.length - 1) {
      col.widthOption = 'auto';
    }
    updateSlotTitle(col, slot);
  });
};

// 重新计算列标题
export function updateSlotTitle(col: ColumnParams, slot: any) {
  const title = generateColumnsTitle({
    widthOption: col.widthOption,
    span: col.span,
    width: col.width
  });
  slot.setTitle(col.slot, title);
}

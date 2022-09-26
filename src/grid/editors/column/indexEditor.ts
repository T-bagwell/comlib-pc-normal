import { Data } from '../../constants';
import { getColIndex, getColItem, updateCol, addColumn } from '../utils';

const IndexEditor = [
  {
    title: '操作',
    items: [
      {
        title: '前面添加列',
        type: 'Button',
        value: {
          set(props: EditorResult<Data>) {
            addColumn(props, 'before');
          }
        }
      },
      {
        title: '后面添加列',
        type: 'Button',
        value: {
          set(props: EditorResult<Data>) {
            addColumn(props, 'after');
          }
        }
      },
      {
        title: '前移',
        type: 'Button',
        ifVisible({ focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const [rowIndex, colIndex] = getColIndex(focusArea);
          return colIndex !== undefined && colIndex !== 0;
        },
        value: {
          set({ data, focusArea, slot }: EditorResult<Data>) {
            if (!focusArea) return;
            const [rowIndex, colIndex] = getColIndex(focusArea);
            if (colIndex < 1) return;
            const row = data.rows[rowIndex];
            const oldColumn = row.columns[colIndex];
            row.columns[colIndex] = row.columns[colIndex - 1];
            row.columns[colIndex - 1] = oldColumn;
            updateCol(row, slot)
          }
        }
      },
      {
        title: '后移',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const [rowIndex, colIndex] = getColIndex(focusArea);
          return colIndex !== undefined && colIndex + 1 !== data.rows[rowIndex].columns.length;
        },
        value: {
          set({ data, focusArea, slot }: EditorResult<Data>) {
            if (!focusArea) return;
            const [rowIndex, colIndex] = getColIndex(focusArea);
            const row = data.rows[rowIndex];
            if (colIndex === row.columns.length - 1) return;
            const oldColumn = row.columns[colIndex];
            row.columns[colIndex] = row.columns[colIndex + 1];
            row.columns[colIndex + 1] = oldColumn;
            updateCol(row, slot)
          }
        }
      },
      {
        title: '删除',
        type: 'Button',
        value: {
          set({ data, slot, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            const [rowIndex, colIndex] = getColIndex(focusArea);
            slot.remove(item?.slot);
            data.rows[rowIndex].columns.splice(colIndex, 1);
            updateCol(data.rows[rowIndex], slot)
          }
        }
      }
    ]
  }
];

export default IndexEditor;

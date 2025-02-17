import React from 'react';
import visibleOpt from '../../../components/editorRender/visibleOpt';
import { setDataSchema } from '../../schema';
import { Data, IColumn, TableLayoutEnum, WidthTypeEnum } from '../../types';
import { getNewColumn, setColumns } from '../../utils';

const ColorMap = {
  number: {
    color: '#4460B8',
    text: '数字'
  },
  boolean: {
    color: '#ff0000',
    text: '布尔'
  },
  string: {
    color: '#88a409',
    text: '字符'
  },
  object: {
    color: '#9727d0',
    text: '对象'
  },
  array: {
    color: '#ce980f',
    text: '数组'
  }
};

const getAddColumnEditor = ({ data }: EditorResult<Data>) => {
  return {
    title: '列',
    folded: true,
    items: [
      {
        title: '显示列头',
        type: 'switch',
        description: '关闭后，不显示列标题行',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.showHeader === false ? false : true;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.showHeader = value;
          }
        }
      },
      {
        title: '列宽分配',
        type: 'Select',
        options: [
          { label: '固定列宽(不自动适配)', value: TableLayoutEnum.FixedWidth },
          { label: '按比例分配多余宽度', value: TableLayoutEnum.Fixed },
          { label: '按比例适配（无横向滚动条）', value: TableLayoutEnum.Auto }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.tableLayout || TableLayoutEnum.Fixed;
          },
          set({ data }: EditorResult<Data>, value: TableLayoutEnum) {
            data.tableLayout = value;
          }
        }
      },
      {
        title: '',
        type: 'array',
        options: {
          addText: '添加列',
          editable: true,
          customOptRender: visibleOpt,
          getTitle: (item: IColumn) => {
            const path = Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : item.dataIndex;
            const { color, text } = ColorMap[item.dataSchema?.type] || ColorMap.string;
            if (item.visible) {
              return (
                <>
                  <span style={{ color }}>{text}</span>
                  <span>
                    【{item.width === WidthTypeEnum.Auto ? '自适应' : `${item.width}px`}】
                    {item.title}
                    {path ? `(${path})` : ''}
                  </span>
                </>
              );
            } else {
              return (
                <>
                  <span style={{ color }}>{text}</span>
                  <span>
                    【隐藏】{item.title}({path})
                  </span>
                </>
              );
            }
          },
          onAdd: () => {
            return getNewColumn(data);
          },
          items: [
            {
              title: '列名',
              type: 'Text',
              value: 'title'
            },
            {
              title: '字段',
              type: 'Text',
              value: 'dataIndex',
              options: {
                placeholder: '不填默认使用 列名 作为字段'
              }
            }
          ]
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return [...data.columns];
          },
          set({ data, output, input, slot, ...res }: EditorResult<Data>, val: IColumn[]) {
            setColumns({ data, slot }, val);
            setDataSchema({ data, output, input, slot, ...res });
          }
        }
      }
    ]
  };
};

export default getAddColumnEditor;

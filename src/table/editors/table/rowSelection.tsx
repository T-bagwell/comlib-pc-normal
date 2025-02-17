import Tree from '../../../components/editorRender/fieldSelect';
import { runScript } from '../../../utils/runExpCodeScript';
import { DefaultRowKey, InputIds, OutputIds, SlotIds, TEMPLATE_RENDER_KEY } from '../../constants';
import { Data, RowSelectionPostionEnum, RowSelectionTypeEnum } from '../../types';
import { Schemas, setDataSchema } from '../../schema';
import { getColumnsSchema } from '../../utils';

const getRowSelectionEditor = (props: EditorResult<Data>) => {
  const suggestions: any[] = [];
  props?.data?.columns?.forEach((col) => {
    if (!suggestions.find((item) => col.dataIndex === item.label)) {
      suggestions.push({
        label: col.dataIndex,
        insertText: `{${col.dataIndex}}` + ' === ${2}',
        detail: `当前行${col.dataIndex}值`
      });
    }
  });
  return [
    {
      title: '勾选',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useRowSelection;
        },
        set({ data, input, output, slot, ...res }: EditorResult<Data>, value: boolean) {
          data.useRowSelection = value;
          if (value) {
            slot.add({ id: SlotIds.ROW_SELECTION_OPERATION, title: `勾选操作区`, type: 'scope' });
            slot
              .get(SlotIds.ROW_SELECTION_OPERATION)
              .inputs.add(
                InputIds.ROW_SELECTION_SELECTED_ROW_KEYS,
                '当前勾选数据-标识',
                Schemas.Array
              );
            slot
              .get(SlotIds.ROW_SELECTION_OPERATION)
              .inputs.add(
                InputIds.ROW_SELECTION_SELECTED_ROWS,
                '当前勾选数据-行数据',
                Schemas.Array
              );

            output.add(OutputIds.ROW_SELECTION, '勾选事件', Schemas.Object);
            output.add(OutputIds.GET_ROW_SELECTION, '勾选数据', Schemas.Object);
            input.add(InputIds.CLEAR_ROW_SELECTION, '清空勾选', Schemas.Void);
            input.add(InputIds.GET_ROW_SELECTION, '输出勾选数据', Schemas.Void);
            input.get(InputIds.GET_ROW_SELECTION).setRels([OutputIds.GET_ROW_SELECTION]);
            setDataSchema({ data, input, output, slot, ...res });
          } else {
            data.rowKey = DefaultRowKey;
            if (output.get(OutputIds.GET_ROW_SELECTION)) {
              output.remove(OutputIds.GET_ROW_SELECTION);
            }
            if (input.get(InputIds.CLEAR_ROW_SELECTION)) {
              input.remove(InputIds.CLEAR_ROW_SELECTION);
            }
            if (input.get(InputIds.GET_ROW_SELECTION)) {
              input.remove(InputIds.GET_ROW_SELECTION);
            }
            slot.remove(SlotIds.ROW_SELECTION_OPERATION);
          }
        }
      }
    },
    {
      title: '勾选配置',
      ifVisible({ data }: EditorResult<Data>) {
        return data.useRowSelection;
      },
      items: [
        {
          title: '勾选类型',
          type: 'Select',
          options: [
            { label: '单选', value: RowSelectionTypeEnum.Radio },
            { label: '批量选择', value: RowSelectionTypeEnum.Checkbox }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.selectionType || RowSelectionTypeEnum.Checkbox;
            },
            set({ data }: EditorResult<Data>, value: RowSelectionTypeEnum) {
              data.selectionType = value;
            }
          }
        },
        {
          title: '勾选限制',
          type: 'inputnumber',
          options: [{ title: '最多', min: 0, width: '100%', placeholder: '0为不限制' }],
          ifVisible({ data }: EditorResult<Data>) {
            return data.selectionType !== RowSelectionTypeEnum.Radio;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return [data.rowSelectionLimit];
            },
            set({ data }: EditorResult<Data>, value: number[]) {
              data.rowSelectionLimit = value[0];
            }
          }
        },
        {
          title: '勾选标识',
          description: '勾选标识所对应的行数据，需要全局唯一',
          type: 'editorRender',
          options: {
            render: Tree
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return {
                value: data.rowKey || undefined,
                schema: getColumnsSchema(data),
                placeholder: '默认使用内置标识'
              };
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.rowKey = value || undefined;
            }
          }
        },
        {
          title: `顶部勾选操作区显示`,
          description: '开启后，显示顶部勾选操作区',
          type: 'Switch',
          ifVisible({ data }: EditorResult<Data>) {
            return data.selectionType !== RowSelectionTypeEnum.Radio;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return (data.rowSelectionPostion || []).includes(RowSelectionPostionEnum.TOP);
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              const temp = (data.rowSelectionPostion || []).filter(
                (item) => item !== RowSelectionPostionEnum.TOP
              );
              if (value) {
                temp.push(RowSelectionPostionEnum.TOP);
              }
              data.rowSelectionPostion = temp;
            }
          }
        },
        {
          title: `底部勾选操作区显示`,
          description: '开启后，显示底部勾选操作区',
          type: 'Switch',
          ifVisible({ data }: EditorResult<Data>) {
            return data.selectionType !== RowSelectionTypeEnum.Radio;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return (data.rowSelectionPostion || []).includes(RowSelectionPostionEnum.BOTTOM);
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              const temp = (data.rowSelectionPostion || []).filter(
                (item) => item !== RowSelectionPostionEnum.BOTTOM
              );
              if (value) {
                temp.push(RowSelectionPostionEnum.BOTTOM);
              }
              data.rowSelectionPostion = temp;
            }
          }
        },
        {
          title: '禁止勾选',
          description: '禁止勾选的表达式（{}, =, <, >, ||, &&）, 例：{status} === 1',
          type: 'EXPRESSION',
          options: {
            autoSize: true,
            placeholder: `禁止勾选的表达式（{}, =, <, >, ||, &&）, 例：{status} === 1`,
            suggestions: suggestions,
            runCode: (str: string) => {
              return runScript(str, {}, TEMPLATE_RENDER_KEY);
            }
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.isDisabledScript;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.isDisabledScript = value;
            }
          }
        },
        {
          title: '动态设置勾选项',
          description: '开启后，支持通过逻辑连线设置勾选项',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.useSetSelectedRowKeys;
            },
            set({ data, input }: EditorResult<Data>, value: boolean) {
              data.useSetSelectedRowKeys = value;
              if (value) {
                input.add(InputIds.SET_ROW_SELECTION, '设置勾选项', Schemas.SET_ROW_SELECTION);
              } else {
                input.remove(InputIds.SET_ROW_SELECTION);
              }
            }
          }
        },
        {
          title: '勾选事件',
          type: '_Event',
          options: () => {
            return {
              outputId: OutputIds.ROW_SELECTION
            };
          }
        }
      ]
    }
  ];
};

export { getRowSelectionEditor };

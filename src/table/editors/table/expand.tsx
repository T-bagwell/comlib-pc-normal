import { InputIds, SlotIds } from '../../constants';
import { Data } from '../../types';
import { getDefaultDataSchema, Schemas, setDataSchema } from '../../schema';
import { getColumnsSchema } from '../../utils';
import Tree from '../../../components/editorRender/fieldSelect';

const expandEditor = [
  {
    title: '表格行展开',
    items: [
      {
        title: '表格行展开',
        description: '开启后，支持自定义行展开内容',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useExpand;
          },
          set({ data, slot, ...res }: EditorResult<Data>, value: boolean) {
            if (value) {
              slot.add({ id: SlotIds.EXPAND_CONTENT, title: `展开内容`, type: 'scope' });
              if (data.expandDataIndex) {
                slot
                  .get(SlotIds.EXPAND_CONTENT)
                  .inputs.add(InputIds.EXP_ROW_VALUES, '展开数据', Schemas.Object);
              }
              slot
                .get(SlotIds.EXPAND_CONTENT)
                .inputs.add(InputIds.EXP_COL_VALUES, '当前行数据', Schemas.Object);
              slot
                .get(SlotIds.EXPAND_CONTENT)
                .inputs.add(InputIds.INDEX, '当前行序号', Schemas.Number);
              setDataSchema({ data, slot, ...res });
            } else {
              slot.remove(SlotIds.EXPAND_CONTENT);
            }
            data.useExpand = value;
          }
        }
      },
      {
        title: '展开字段',
        type: 'editorRender',
        description: '[非必填]与后端返回数据字段对应',
        options: {
          render: Tree
        },
        ifVisible({ data }: EditorResult<Data>) {
          return data.useExpand;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            const ret = Array.isArray(data.expandDataIndex)
              ? data.expandDataIndex.join('.')
              : data.expandDataIndex;
            return {
              value: ret,
              schema: getColumnsSchema(data),
              placeholder: '[非必填]与后端返回数据字段对应'
            };
          },
          set({ data, slot, ...res }: EditorResult<Data>, value: string) {
            let valArr: string | string[] = value.trim().split('.');
            if (valArr.length === 1) {
              valArr = valArr[0];
            }
            const hasEvent = slot.get(SlotIds.EXPAND_CONTENT).inputs.get(InputIds.EXP_ROW_VALUES);
            if (value) {
              !hasEvent &&
                slot
                  .get(SlotIds.EXPAND_CONTENT)
                  .inputs.add(InputIds.EXP_ROW_VALUES, '展开数据', Schemas.Object);
            } else {
              hasEvent && slot.get(SlotIds.EXPAND_CONTENT).inputs.remove(InputIds.EXP_ROW_VALUES);
            }

            data.expandDataIndex = valArr;
            setDataSchema({ data, slot, ...res });
          }
        }
      },
      {
        title: '数据类型',
        type: '_schema',
        ifVisible({ data }: EditorResult<Data>) {
          return !!(data.useExpand && data.expandDataIndex);
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.expandDataSchema || getDefaultDataSchema(data.expandDataIndex, data);
          },
          set({ data, ...res }: EditorResult<Data>, value: object) {
            data.expandDataSchema = value;
            setDataSchema({ data, ...res });
          }
        }
      }
    ]
  }
];

export default expandEditor;

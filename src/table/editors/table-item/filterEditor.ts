import { InputIds, OutputIds } from '../../constants';
import { Schemas, setDataSchema } from '../../schema';
import { ContentTypeEnum, Data, Filter, FilterTypeEnum, IColumn } from '../../types';
import { getColumnItem } from '../../utils';

interface Props {
  data: Data;
  output: any;
  input: any;
}
const addFilterIO = ({ data, output, input }: Props) => {
  const event1 = output.get(OutputIds.FILTER);
  const event2 = output.get(OutputIds.GET_FILTER);
  const event3 = input.get(InputIds.GET_FILTER);
  const event4 = input.get(InputIds.SET_FILTER);
  const event5 = input.get(InputIds.SET_FILTER_INPUT);

  // 接口筛选
  const useFilter = data.columns.some((item) => item.filter?.enable);
  if (useFilter) {
    if (!event1) {
      output.add(OutputIds.FILTER, '筛选', Schemas.Object);
    }
    if (!event2) {
      output.add(OutputIds.GET_FILTER, '筛选数据', Schemas.Object);
    }
    if (!event3) {
      input.add(InputIds.GET_FILTER, '获取筛选数据', Schemas.Void);
      input.get(InputIds.GET_FILTER).setRels([OutputIds.GET_FILTER]);
    }
    if (!event4) {
      input.add(InputIds.SET_FILTER, '设置筛选数据', Schemas.Object);
    }
    if (!event5) {
      input.add(InputIds.SET_FILTER_INPUT, '设置筛选项', Schemas.Object);
    }
  } else {
    event1 && output.remove(OutputIds.FILTER);
    event2 && output.remove(OutputIds.GET_FILTER);
    event3 && input.remove(InputIds.GET_FILTER);
    event4 && input.remove(InputIds.SET_FILTER);
    event5 && input.remove(InputIds.SET_FILTER_INPUT);
  }
};

const setFilterProps = <T extends keyof Filter, P extends Filter[T]>(
  col: IColumn,
  key: T,
  value: P
) => {
  if (!col.filter) {
    col.filter = {};
  }
  col.filter[key] = value;
};
const FilterEditor = {
  title: '筛选',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea);
    return item && [ContentTypeEnum.Text, ContentTypeEnum.SlotItem].includes(item.contentType);
  },
  items: [
    {
      title: '使用筛选',
      type: 'Switch',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.filter?.enable;
        },
        set({ data, focusArea, input, output, ...res }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          setFilterProps(item, 'enable', value);
          addFilterIO({ data, output, input });
          setDataSchema({ data, focusArea, input, output, ...res });
        }
      }
    },
    {
      title: '筛选事件',
      type: '_Event',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item.filter?.enable;
      },
      options: () => {
        return {
          outputId: OutputIds.FILTER
        };
      }
    },
    {
      title: '筛选类型',
      type: 'Select',
      options: [
        { label: '多选', value: FilterTypeEnum.Multiple },
        { label: '单选', value: FilterTypeEnum.Single }
      ],
      description: '筛选支持单选或多选',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item && item.filter?.enable;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return (item && item.filter?.filterType) || FilterTypeEnum.Multiple;
        },
        set({ data, focusArea }: EditorResult<Data>, value: FilterTypeEnum) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          setFilterProps(item, 'filterType', value);
        }
      }
    },
    {
      title: '筛选项来源',
      type: 'Select',
      options: [
        { label: '本地定义', value: FilterTypeEnum.Local },
        { label: '接口获取', value: FilterTypeEnum.Request }
      ],
      description: '定义筛选项数据的来源方式',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item && item.filter?.enable;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return (item && item.filter?.filterSource) || FilterTypeEnum.Local;
        },
        set({ data, focusArea, input, output, ...res }: EditorResult<Data>, value: FilterTypeEnum) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          setFilterProps(item, 'filterSource', value);
          addFilterIO({ data, output, input });
          setDataSchema({ data, focusArea, input, output, ...res });
        }
      }
    },
    {
      title: '自定义筛选项',
      type: 'Map',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item && item.filter?.enable && item.filter?.filterSource !== FilterTypeEnum.Request;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          let opts = {};
          if (item && item.filter?.options) {
            opts = item.filter?.options.reduce((pre, curr) => {
              return {
                ...pre,
                [curr.text]: curr.value
              };
            }, {});
          }
          return opts;
        },
        set({ data, focusArea }: EditorResult<Data>, value: any) {
          if (!focusArea) return;
          const options = Object.keys(value).map((k) => ({
            text: k,
            value: value[k]
          }));
          const item = getColumnItem(data, focusArea);
          setFilterProps(item, 'options', options);
        }
      }
    },
    {
      title: '筛选方式',
      type: 'Select',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item && item.filter?.enable;
      },
      options: [
        { label: '本地筛选', value: FilterTypeEnum.Local },
        { label: '请求接口', value: FilterTypeEnum.Request }
      ],
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return (item && item.filter?.type) || FilterTypeEnum.Local;
        },
        set({ data, output, input, focusArea, ...res }: EditorResult<Data>, value: FilterTypeEnum) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          setFilterProps(item, 'type', value);
          addFilterIO({ data, input, output });
          setDataSchema({ data, focusArea, input, output, ...res });
        }
      }
    }
  ]
};

export default FilterEditor;

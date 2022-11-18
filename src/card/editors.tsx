import { Data, OutputIds, SizeOptions, SlotIds } from './constants';
import { Editor, EditorType } from '../utils/editor';

export default {
  '@init'({ style }: EditorResult<Data>) {
    style.height = 'auto';
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': ({}, cate1, cate2, cate3) => {
    cate1.title = '常规';
    const eventItems = [
      Editor<Data>('点击', EditorType.Switch, 'useClick', {
        value: {
          set({ data, output }: EditorResult<Data>, value: boolean) {
            const hasEvent = output.get(OutputIds.Click);
            if (value) {
              !hasEvent && output.add(OutputIds.Click, '点击', { type: 'string' });
            } else {
              hasEvent && output.remove(OutputIds.Click);
            }
            data.useClick = value;
          }
        }
      }),
      Editor<Data>('点击输出内容', EditorType.Text, 'outputContent', {
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.useClick;
        }
      }),
      Editor<Data>('点击卡片', EditorType.Event, null, {
        options: () => {
          return {
            outputId: OutputIds.Click
          };
        },
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.useClick;
        }
      })
    ];
    cate1.items = [
      Editor<Data>('标题内容', EditorType.Text, 'title'),
      {
        title: '开启卡片右上角操作',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useExtra;
          },
          set({ data, slot }: EditorResult<Data>, value: boolean) {
            data.useExtra = value;
            if (data.useExtra === true) {
              slot.add(SlotIds.Extra, '卡片操作容器');
            } else {
              slot.remove(SlotIds.Extra, '卡片操作容器');
            }
          }
        }
      },
      ...eventItems
    ];

    cate2.title = '样式';
    cate2.items = [
      Editor<Data>('卡片边框', EditorType.Switch, 'bordered'),
      Editor<Data>('鼠标移过时可浮起', EditorType.Switch, 'hoverable'),
      Editor<Data>('鼠标移过时可浮起', EditorType.Select, 'size', {
        options: SizeOptions
      })
    ];

    return { title: '卡片' };
  }
};

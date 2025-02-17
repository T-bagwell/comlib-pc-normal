import { Data } from '../../constants';
import { getTimelineItem } from '../utils';

const BaseEditor = [
  {
    title: '基础配置',
    ifVisible({ data }: EditorResult<Data>) {
      return !data.isDynamic;
    },
    items: [
      {
        title: '标题',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            return item.title;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            item.title = value;
          }
        }
      },
      {
        title: '副标题',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            return item.subTitle;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            item.subTitle = value;
          }
        }
      },
      {
        title: '描述',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            return item.description;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            item.description = value;
          }
        }
      },
      ,
      {
        title: '节点颜色',
        type: 'ColorPicker',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            return item.color;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            item.color = value;
          }
        }
      }
    ]
  }
];
export default BaseEditor;

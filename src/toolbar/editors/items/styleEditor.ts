import { Data, ShapeEnum, SizeEnum, TypeEnum } from '../../types';
import { getBtnItemInfo } from '../../utils';

const StyleEditor = [
  {
    title: '基础样式',
    items: [
      {
        title: '尺寸',
        type: 'Select',
        options() {
          return [
            { value: SizeEnum.Large, label: '大' },
            { value: SizeEnum.Middle, label: '中等' },
            { value: SizeEnum.Small, label: '小' }
          ];
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            return item.size || SizeEnum.Middle;
          },
          set({ data, focusArea }: EditorResult<Data>, value: SizeEnum) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            item.size = value;
          }
        }
      },
      {
        title: '风格',
        type: 'Select',
        options() {
          return [
            { value: TypeEnum.Default, label: '默认' },
            { value: TypeEnum.Primary, label: '主按钮' },
            { value: TypeEnum.Dashed, label: '虚线按钮' },
            { value: TypeEnum.Danger, label: '危险按钮' },
            { value: TypeEnum.Link, label: '链接按钮' },
            { value: TypeEnum.Text, label: '文字按钮' }
            // a标签
            // { value: TypeEnum.ALink, label: '超链接' }
          ];
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            return item.type || TypeEnum.Default;
          },
          set({ data, focusArea }: EditorResult<Data>, value: TypeEnum) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            item.type = value;
          }
        }
      },
      {
        title: '形状',
        type: 'Select',
        options() {
          return [
            { value: ShapeEnum.Default, label: '默认' },
            { value: ShapeEnum.Circle, label: '(椭)圆' },
            { value: ShapeEnum.Round, label: '圆角矩形' }
          ];
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            return item.shape || ShapeEnum.Default;
          },
          set({ data, focusArea }: EditorResult<Data>, value: ShapeEnum) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            item.shape = value;
          }
        }
      }
    ]
  }
];

export default StyleEditor;

import { InputIds, Schemas } from '../../constants';
import { Data } from '../../types';
import { getBtnItemInfo } from '../../utils';

const DynamicEventEditor = [
  {
    title: '动态设置按钮名称',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        return item.useDynamicText;
      },
      set({ data, focusArea, input }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        const eventKey = `${InputIds.SetBtnText}_${item.key}`;

        const event = input.get(eventKey);
        if (value) {
          !event && input.add(eventKey, `设置${item.text}名称`, Schemas.String);
        } else {
          event && input.remove(eventKey);
        }
        item.useDynamicText = value;
      }
    }
  },
  {
    title: '动态启用/禁用',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        return item.useDynamicDisabled;
      },
      set({ data, focusArea, input }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        const eventKey1 = `${InputIds.SetEnable}_${item.key}`;
        const eventKey2 = `${InputIds.SetDisable}_${item.key}`;

        const event1 = input.get(eventKey1);
        const event2 = input.get(eventKey2);
        if (value) {
          !event1 && input.add(eventKey1, `启用${item.text}`, Schemas.Any);
          !event2 && input.add(eventKey2, `禁用${item.text}`, Schemas.Any);
        } else {
          event1 && input.remove(eventKey1);
          event2 && input.remove(eventKey2);
        }
        item.useDynamicDisabled = value;
      }
    }
  },
  {
    title: '动态显示/隐藏',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        return item.useDynamicHidden;
      },
      set({ data, focusArea, input }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        const eventKey1 = `${InputIds.SetVisible}_${item.key}`;
        const eventKey2 = `${InputIds.SetHidden}_${item.key}`;

        const event1 = input.get(eventKey1);
        const event2 = input.get(eventKey2);
        if (value) {
          !event1 && input.add(eventKey1, `显示${item.text}`, Schemas.Any);
          !event2 && input.add(eventKey2, `隐藏${item.text}`, Schemas.Any);
        } else {
          event1 && input.remove(eventKey1);
          event2 && input.remove(eventKey2);
        }
        item.useDynamicHidden = value;
      }
    }
  }
];

export default DynamicEventEditor;

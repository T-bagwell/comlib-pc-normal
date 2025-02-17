export interface StepItem {
  id: string;
  title: string;
  description: string;
  subTitle?: string;
  index: number;
  useDynamicDisplay?: boolean;
  hide?: boolean;
  content?: any;
  render?: boolean
}

export type Btn = 'previous' | 'next' | 'submit'

type ExtraBtn = {
  id: string
  type: "link" | "text" | "ghost" | "default" | "primary" | "dashed"
  text: string
}
interface Toolbar {
  submit: boolean;
  actionAlign?: string;
  primaryBtnText?: string;
  secondBtnText?: string;
  submitText?: string;
  showActions: boolean
  btns: Array<Btn>
  extraBtns?: Array<ExtraBtn>
  fixed?: boolean
  bottom?: number
}

interface Steps {
  size: "small" | "default";
  type: "default" | "navigation" | "dotted";
  showDesc: boolean;
  direction?: 'horizontal' | 'vertical',
}


/**
 * 数据源
 */
export interface Data {
  steps: Steps
  current: number;
  stepAry: StepItem[];
  toolbar: Toolbar;
  fullSubmit: boolean;
  useSubmitBtnLoading: boolean;
  hideSlots?: boolean;
}

export const INTO = '_into';
export const LEAVE = '_leave'

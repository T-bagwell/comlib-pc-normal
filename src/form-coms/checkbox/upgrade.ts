import { Data } from './types';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    "type": "array"
  }

  if (!input.get('setInitialValue')) {

    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  /**
    * @description v1.0.3 增加全选框配置
    */
  if (!data.checkAll) {
    data.checkAll = false;
  }
  if (!data.checkAllText) {
    data.checkAllText = '全选';
  }

  return true;
}
import { Data, InputIds } from './constants';

// TODO: 调试结束清除定时器
export default function (props: RuntimeParams<Data>) {
  const { env, data, outputs, inputs } = props;
  let timer;

  if (env?.runtime && inputs) {
    inputs[InputIds.Trigger]((val) => {
      clearInterval(timer);
      if (data.immediate) {
        outputs[InputIds.Trigger](val);
      }
      timer = setInterval(() => {
        outputs[InputIds.Trigger](val);
      }, data.delay);
    });
    inputs[InputIds.Cancel]?.(() => {
      clearInterval(timer);
    });
  }
}

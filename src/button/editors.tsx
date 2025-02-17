import { Data, OutputIds } from './constants';
import { message } from 'antd';

export default {
  '@init'({ style }) {
    style.width = 64;
    style.height = 32;
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': [
    {
      title: '作为热区使用',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.asMapArea;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.asMapArea = value;
        }
      }
    },
    {
      ifVisible({ data }: EditorResult<Data>) {
        return !data.asMapArea;
      },
      items: [
        {
          title: '文字标题',
          type: 'text',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.text;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.text = value;
            }
          }
        },
        {
          title: '样式',
          type: 'style',
          options: {
            defaultOpen: true,
            plugins: ['border', 'font', 'bgcolor', 'bgimage'],
            fontProps: {
              fontFamily: false
            }
          },
          value: {
            get: ({ data }: EditorResult<Data>) => {
              return data.style;
            },
            set: ({ data }: EditorResult<Data>, value) => {
              data.style = value;
            }
          }
        }
      ]
    },
    {
      title: '单击',
      type: '_Event',
      options: {
        outputId: OutputIds.Click
      }
    },
    {
      title: '双击',
      type: '_Event',
      options: {
        outputId: OutputIds.DbClick
      }
    },
    {
      title: '触发数据',
      items: [
        {
          title: '类型',
          type: 'Select',
          options: [
            { value: 'null', label: '无' },
            { value: 'number', label: '数字' },
            { value: 'string', label: '字符' },
            { value: 'object', label: '对象' },
            { value: 'boolean', label: '布尔' },
            { value: 'external', label: '外部传入' }
          ],
          value: {
            get({ data, output }: EditorResult<Data>) {
              const click = output.get(OutputIds.Click);
              const dbClick = output.get(OutputIds.DbClick);
              if (data.dataType === 'number') {
                click.setSchema({
                  type: 'number'
                });
                dbClick.setSchema({
                  type: 'number'
                });
              }
              return data.dataType;
            },
            set(
              { data, output, input }: EditorResult<Data>,
              value: 'null' | 'number' | 'string' | 'object' | 'boolean' | 'external'
            ) {
              const click = output.get(OutputIds.Click);
              const dbClick = output.get(OutputIds.DbClick);
              click.setSchema({
                type: 'any'
              });
              dbClick.setSchema({
                type: 'any'
              });
              if (value === 'number') {
                click.setSchema({
                  type: 'number'
                });
                dbClick.setSchema({
                  type: 'number'
                });
                data.outVal = 0;
              } else if (value === 'string') {
                click.setSchema({
                  type: 'string'
                });
                dbClick.setSchema({
                  type: 'string'
                });
                data.outVal = '';
              } else if (value === 'object') {
                click.setSchema({
                  type: 'object',
                  properties: {}
                });
                dbClick.setSchema({
                  type: 'object',
                  properties: {}
                });
                data.outVal = {};
              } else if (value === 'boolean') {
                click.setSchema({
                  type: 'boolean'
                });
                dbClick.setSchema({
                  type: 'boolean'
                });
                data.outVal = false;
              } else {
                data.outVal = null;
              }

              if (value === 'external') {
                click.setSchema({
                  type: 'follow'
                });
                dbClick.setSchema({
                  type: 'follow'
                });
                input.add('external', '设置输出数据', {
                  type: 'follow'
                });
              } else {
                if (input.get('external')) {
                  input.remove('external');
                }
              }
              data.dataType = value;
            }
          }
        },
        {
          title: '输出值',
          type: 'Text',
          options: {
            type: 'number'
          },
          ifVisible({ data }: EditorResult<Data>) {
            return data.dataType === 'number';
          },
          description: '点击按钮向外输出的值，只可输入数字',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.outVal;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.outVal = Number(value) || 0;
            }
          }
        },
        {
          title: '输出值',
          type: 'Text',
          ifVisible({ data }: EditorResult<Data>) {
            return data.dataType === 'string';
          },
          description: '点击按钮向外输出的值,可以为任意字符',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.outVal;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.outVal = value;
            }
          }
        },
        {
          title: '输出值',
          type: 'Switch',
          ifVisible({ data }: EditorResult<Data>) {
            return data.dataType === 'boolean';
          },
          description: '点击按钮向外输出的值,打开输出true,关闭输出false',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.outVal;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.outVal = value;
            }
          }
        },
        {
          title: '输出值',
          type: 'TextArea',
          ifVisible({ data }: EditorResult<Data>) {
            return data.dataType === 'object';
          },
          description: '点击按钮向外输出的值, 输出值无数据即为空对象，举例: {"name": "poweros"}',
          value: {
            get({ data }: EditorResult<Data>) {
              try {
                return JSON.stringify(data.outVal) || '{}';
              } catch {
                return '{}';
              }
            },
            set({ data }: EditorResult<Data>, value: string) {
              try {
                const resValue = JSON.parse(value.replace(/\n/g, '').replace(/\r/g, ''));
                data.outVal = resValue;
              } catch {
                message.warning('输出值格式有误, 参考格式{"name": "poweros"}');
              }
            }
          }
        }
      ]
    }
  ]
};

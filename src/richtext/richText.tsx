import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ImgModal from './components/ImgModal';
import uploadimage from './plugins/uploadimage';
import { Init, getWindowVal } from './utils';
import { uuid } from '../utils';
import { loadPkg } from '../utils/loadPkg';

import { Spin } from 'antd';

import css from './richText.less';

// 自定义icon_id
const customIconsId: string = '_pcEditor_customIcons_' + uuid();
const videoIconId: string = '_pcEditor_videoIcon_' + uuid();

const tinymceCDN: string =
  'https://f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/tinymce/5.7.1/tinymce.min.js';

class Ctx {
  tinymceId!: string;
  tinymceFSId!: string;
}

export default function ({
  data,
  outputs,
  inputs,
  env,
  readonly,
}): JSX.Element {
  const tinymceId = useMemo(() => '_pceditor_tinymce_' + uuid(), []);
  const tinymceFSId = useMemo(() => '_pceditor_tinymceFS_' + uuid(), []);
  const valueRef = useRef('');
  const uploadCb = useRef<any>();

  const [modalVisible, setModalVisible] = useState(false);
  const [tinymceFSVisble, setTinymceFSVisble] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadModel, setUploadModel] = useState<any>({ title: '上传图片', type: 'image', url: '' });

  inputs['submit'](() => {
    outputs['submit'](valueRef.current);
  });

  const textareaRef = useRef(null);

  const Load: () => void = useCallback(async () => {
    await loadPkg(tinymceCDN, 'tinyMCE');
    addCustomIcons();
    TinymceInit({
      target: textareaRef.current,
      height: data.style.height,
      toolbar: data.toolbar?.join(' '),
      isFS: false,
    });
  }, []);

  const TinymceInit: (cfg: {
    selector?: string;
    height: string | number;
    isFS: boolean;
    toolbar: any;
    target: any;
  }) => void = useCallback(({ selector, height, isFS, target }) => {
    Init({
      readonly,
      target,
      toolbar: data.toolbar?.join(' '),
      selector,
      height,
      isFS,
      customIconsId,
      setUp: (editor: any) => {
        if (!uploadCb.current) {
          uploadCb.current = uploadimage({
            click: (type: string) => {
              switch (type) {
                case 'uploadimage':
                  setModalVisible(true);
                  setUploadModel({
                    title: '上传图片',
                    type: 'image',
                    url: ''
                  });
                  break;
                case 'uploadVideo':
                    setModalVisible(true);
                    setUploadModel({
                      title: '上传视频',
                      type: 'video',
                      url: ''
                    })
                    break;
                case 'customfullscreen':
                  setTinymceFSVisble(true);
                  break;
                case 'customfullscreenexit':
                  setTinymceFSVisble(false);
                  break;
                default:
                  break;
              }
            },
            editor,
          });
        }

        editor.on('blur', () => {
          update(false);
        });
      },
      initCB: (editor) => {
        inputs['dataSource']((val: any) => {
          editor.setContent(val);
          valueRef.current = val;
        });
        editor.setContent(valueRef.current)
        if (loading) {
          setTimeout(() => {
            setLoading(false);
          }, 50);
        }
      },
    });
  }, []);

  const update = useCallback((bool) => {
    const tinyMCE = getWindowVal('tinyMCE');
    if (!tinyMCE) return;

    const tinymceInstance =
      tinymceFSVisble || bool
        ? tinyMCE.editors[tinymceFSId]
        : tinyMCE.editors[tinymceId];

    const content = tinymceInstance?.getContent({ format: 't' });

    valueRef.current = content.trim() || '';
    outputs['done'](valueRef.current);
    outputs.onChange(valueRef.current);
  }, []);

  useEffect(() => {
    Load();

    return () => {
      const tinyMCE = getWindowVal('tinyMCE');
      tinyMCE &&
        [tinymceId, tinymceFSId].forEach((id) => {
          tinyMCE.editors[id]?.remove();
        });
    };
  }, [data.toolbar.join(' ')]);

  useEffect(() => {
    if (readonly) {
      const isRuntime = !!(env.runtime && !env.runtime.debug);
      const body = isRuntime
        ? document
        : document.querySelector('iframe').contentDocument;
      const container = body?.getElementById(`p${tinymceId}`);
      const iframeEle = container?.querySelector('iframe');
      const editorEle = container?.querySelector(
        '.tox-editor-container'
      ) as HTMLElement;
      if (iframeEle && editorEle) {
        editorEle.style.height =
          iframeEle.contentDocument.documentElement.offsetHeight + 'px';
      }
    }
  }, [readonly]);

  const RenderTextArea: JSX.Element = useMemo(() => {
    return (
      <Spin spinning={loading} tip='编辑器加载中...'>
        <textarea
          ref={textareaRef}
          id={tinymceId}
          hidden={!loading}
          readOnly
        />
      </Spin>
    );
  }, [loading]);

  const onModalClose = useCallback(() => {
    setModalVisible(false);
    setUploadModel({});
  }, [])

  const onModalChange = useCallback((params) => {
    setUploadModel((val: any) => ({ ...val, ...params}));
  }, []);

  const onModalOk = useCallback(() => {
    onModalClose();
    uploadCb.current?.setUrl(uploadModel);
  }, [uploadModel]);

  const RenderImgModal: JSX.Element | undefined = useMemo(() => {
    return (
      <ImgModal
        onChange={onModalChange}
        onOk={onModalOk}
        update={update}
        uploadModel={uploadModel}
        onClose={onModalClose}
        visible={modalVisible}
      />
    );
  }, [modalVisible, uploadModel]);

  const RenderFSTinyMCE: JSX.Element | null = useMemo(() => {
    return (
      tinymceFSVisble ? (
        <div>
          <textarea
            ref={(node) => {
              const tinyMCE = getWindowVal('tinyMCE');
              if (!tinyMCE) return;

              if (!tinyMCE.editors[tinymceFSId]) {
                TinymceInit({
                  target: node,
                  height: '100%',
                  toolbar: data.toolbar.join(' '),
                  isFS: true,
                });
              }
            }}
            id={tinymceFSId}
            hidden
            readOnly
          />
        </div>
      ) : null
    );
  }, [tinymceFSVisble]);

  return (
    <div
      className={`${css['editor-rich-text']} ${
        readonly ? css['editor-rich-text__readonly'] : ''
      }`}
      style={data.style}
      id={`p${tinymceId}`}
    >
      {RenderTextArea}
      {RenderImgModal}
      {RenderFSTinyMCE}
    </div>
  );
}

function addCustomIcons(): void {
  const tinyMCE = getWindowVal('tinyMCE');
  if (!tinyMCE) return;
  const { IconManager } = tinyMCE;
  if (!IconManager.has(customIconsId)) {
    IconManager.add(customIconsId, {
      icons: {
        customvideo: '<svg t="1651135949047" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2273" width="24" height="24"><path d="M912 302.3L784 376V224c0-35.3-28.7-64-64-64H128c-35.3 0-64 28.7-64 64v576c0 35.3 28.7 64 64 64h592c35.3 0 64-28.7 64-64V648l128 73.7c21.3 12.3 48-3.1 48-27.6V330c0-24.6-26.7-40-48-27.7zM712 792H136V232h576v560z m176-167l-104-59.8V458.9L888 399v226z" p-id="2274"></path><path d="M208 360h112c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H208c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z" p-id="2275"></path></svg>',
        fullscreenexit:
          '<svg t="1626167157970" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="85763" width="20" height="20"><path d="M400.595 345.365l-0.948-245.022c-0.42-18.881-16.018-30.215-34.956-30.637h-25.406c-18.88-0.42-33.874 16.018-33.457 34.881l1.061 133.251L138.772 72.417c-18.274-18.311-47.844-18.311-66.119 0-18.218 18.314-18.218 47.907 0 66.236l166.575 164.885-127.697 0.512c-18.88-0.477-36.394 12.606-39.26 34.899v24.08c0.477 18.917 16.077 34.558 34.957 34.972l243.826-1.438c0.362 0.035 0.608 0.171 0.928 0.171l17.1 0.378c9.441 0.226 17.9-3.467 23.923-9.593 6.124-6.083 8.382-14.58 8.131-24.078l-1.821-17.138c0.001-0.335 1.27-0.562 1.27-0.945zM766.211 701.451l127.524-0.512c18.88 0.421 36.357-11.183 39.26-33.474v-24.077c-0.478-18.922-16.134-34.558-34.957-35.037l-240.702 1.458c-0.378 0-0.605-0.151-0.967-0.151l-17.062-0.42c-9.441-0.226-17.95 3.469-23.98 9.611-6.159 6.03-8.361 14.559-8.173 24.057l1.881 17.1c0.033 0.42-1.234 0.661-1.234 0.986l0.986 241.248c0.477 18.863 16.078 30.162 34.957 30.576l24.017 0.037c18.827 0.433 33.874-16.055 33.403-34.941l-1.062-130.388 168.117 166.502c18.276 18.314 47.809 18.314 66.085 0 18.255-18.31 18.255-47.906 0-66.218L766.209 701.442zM392.992 618.855c-6.028-6.14-14.541-9.834-23.923-9.61l-17.104 0.42c-0.346 0-0.566 0.151-0.948 0.151l-243.81-1.458c-18.881 0.478-34.503 16.112-34.956 35.034v24.078c2.843 22.292 20.357 33.892 39.206 33.474l129.158 0.42-167.983 166.37c-18.234 18.255-18.234 47.906 0 66.218 18.256 18.314 47.845 18.314 66.102 0l168.137-165.418-1.079 131.185c-0.42 18.922 14.579 35.413 33.424 34.938h25.406c18.937-0.477 34.54-11.713 34.956-30.637l0.987-243.05c0-0.346-1.267-0.571-1.267-0.949l1.821-17.104c0.206-9.495-1.993-18.025-8.116-24.053zM615.434 387.559c6.03 6.123 14.541 9.819 23.965 9.553l17.06-0.378c0.378 0 0.608-0.132 0.986-0.19l244.19 1.457c18.88-0.434 34.482-16.078 34.956-34.994l0.058-24.078c-2.898-22.331-20.439-35.355-39.26-34.939l-129.573-0.511 166.483-164.893c18.31-18.235 18.31-47.83 0.054-66.143-18.276-18.311-47.809-18.311-66.084 0L700.152 238.89l1.079-134.276c0.454-18.863-14.598-35.355-33.424-34.939H643.79c-18.881 0.477-34.484 11.773-34.957 30.637l-0.967 245.075c0 0.378 1.251 0.608 1.251 0.948l-1.859 17.138c-0.192 9.499 2.007 17.991 8.173 24.078z" p-id="85764"></path></svg>',
      },
    });
  }
  
}

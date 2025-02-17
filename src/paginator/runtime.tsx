import React, { useEffect } from 'react';
import { Pagination } from 'antd';
import { Data, InputIds, OutputIds, SizeTypeEnum, templateRender } from './constants';

export default (props: RuntimeParams<Data>) => {
  const { data, inputs, outputs, env } = props;
  const {
    total,
    text,
    current,
    disabled,
    defaultPageSize,
    size,
    align,
    showQuickJumper,
    showSizeChanger,
    pageSizeOptions,
    hideOnSinglePage
  } = data;

  const setPageNum = (pageNum: number) => {
    if (typeof pageNum === 'number') {
      data.current = pageNum;
    }
  };

  useEffect(() => {
    if (env.runtime) {
      data.total = 0;
      inputs[InputIds.SetTotal]((val: number) => {
        if (typeof val === 'number') {
          data.total = val;
        }
      });
      inputs[InputIds.SetPageNum]((val) => {
        setPageNum(val);
      });
      inputs[InputIds.GetPageInfo]((val, relOutputs) => {
        relOutputs[OutputIds.GetPageInfo](data.currentPage);
      });

      inputs[InputIds.SetDisable] &&
        inputs[InputIds.SetDisable](() => {
          data.disabled = true;
        });
      inputs[InputIds.SetEnable] &&
        inputs[InputIds.SetEnable](() => {
          data.disabled = false;
        });
    }
  }, []);

  const onChange = (pageNum: number, pageSize: number) => {
    data.currentPage = {
      pageNum,
      pageSize
    };
    setPageNum(pageNum);
    outputs[OutputIds.PageChange](data.currentPage);
  };

  const totalText = (total: number, range: number[]) => {
    return templateRender(text, { total, start: range[0], end: range[1] });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: align
      }}
    >
      <Pagination
        total={total}
        showTotal={totalText}
        current={current}
        defaultPageSize={defaultPageSize}
        size={size === SizeTypeEnum.Simple ? SizeTypeEnum.Default : size}
        simple={size === SizeTypeEnum.Simple}
        showQuickJumper={showQuickJumper}
        showSizeChanger={showSizeChanger}
        pageSizeOptions={pageSizeOptions}
        hideOnSinglePage={env.edit || showSizeChanger ? false : hideOnSinglePage}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

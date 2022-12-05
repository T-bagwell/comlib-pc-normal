import { uuid } from '../../utils';
import { Data, BtnItem } from '../types';

export const getNewBtn = (): BtnItem => {
  const key = uuid();
  return {
    key,
    text: '按钮',
    showText: true,
    dataType: "number",
    outVal: 0,
    inVal: '',
    isCustom: false,
    src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik05NDIgOTE2LjZIODMuOWE3OS4xIDc5LjEgMCAwIDEtNzktNzlWMTg2YTc5LjEgNzkuMSAwIDAgMSA3OS03OUg5NDJhNzkuMSA3OS4xIDAgMCAxIDc5IDc5djY1MS42YTc5LjEgNzkuMSAwIDAgMS03OSA3OXpNODMuOSAxNjguNjVBMTcuNTcgMTcuNTcgMCAwIDAgNjYuNTYgMTg2djY1MS42YTE3LjU3IDE3LjU3IDAgMCAwIDE3LjM0IDE3LjMzSDk0MmExNy41NyAxNy41NyAwIDAgMCAxNy4zNC0xNy4zNFYxODZBMTcuNTcgMTcuNTcgMCAwIDAgOTQyIDE2OC42NXoiIGZpbGw9IiM1NTU1NTUiLz48cGF0aCBkPSJNMjEyLjcyIDQxMi43M2E5MiA5MiAwIDEgMSA5Mi05MiA5Mi4xIDkyLjEgMCAwIDEtOTIgOTJ6IG0wLTEyMGEyOCAyOCAwIDEgMCAyOCAyOCAyOCAyOCAwIDAgMC0yOC0yOHpNNDQuNjkgNzQxLjIzQTMyIDMyIDAgMCAxIDI1IDY4NGwyMzYuMjMtMTg0LjU5YzM0LjQ0LTI2LjkyIDg1Ljk0LTI0LjEgMTE3LjI0IDYuNDJMNTIwLjcgNjQ0LjUxYTMyIDMyIDAgMSAxLTQ0LjcgNDUuODJMMzMzLjc5IDU1MS42NmMtOC4yNi04LjA2LTI0LjA2LTguOTMtMzMuMTYtMS44Mkw2NC4zNyA3MzQuNDVhMzEuODQgMzEuODQgMCAwIDEtMTkuNjggNi43OHoiIGZpbGw9IiM1NTU1NTUiLz48cGF0aCBkPSJNOTg2LjMyIDgxMi4xMmEzMiAzMiAwIDAgMS0yOC40Ny0xNy4zNkw3ODIuNDEgNDU0LjE4bC0wLjE3LTAuMzZhMjIgMjIgMCAwIDAtMzQuMi03LjA3bC0yMjYuMjkgMjQyLjVBMzIgMzIgMCAxIDEgNDc1IDY0NS41OWwyMjcuOS0yNDQuMjcgMC44LTAuNzVhODYgODYgMCAwIDEgMTM1Ljk1IDI1bDE3NS4wOSAzMzkuOTJhMzIgMzIgMCAwIDEtMjguNDIgNDYuNjZ6IiBmaWxsPSIjNTU1NTU1Ii8+PC9zdmc+",
    contentSize: [14, 14],
    iconDistance: 8
  };
};

export const getBtnItemInfo = (
  data: Data,
  focusArea,
  datasetKey = 'btnIdx'
): { item: BtnItem; index: number } => {
  const key = focusArea?.dataset?.[datasetKey];
  const index = data.btnList.findIndex((item) => key && item.key === key);
  const res = index === -1 ? undefined : data.btnList[index];
  return { item: res || getNewBtn(), index };
};

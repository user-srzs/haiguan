import { ElMessage } from 'element-plus';
import request from "@/utils/request.ts";
import type { AxiosResponse } from 'axios';
/**
 * 文件下载
 */
export async function downloadByUrl(url: string, params?: any, filename?: string): Promise<void> {
  const response: AxiosResponse = await request.get(url, {
    params,
    responseType: 'blob'
  })
  const blob = new Blob([response.data]);
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

/**
 * 下载文件
 * @param data 二进制数据
 * @param name 文件名
 * @param type 文件类型
 */
export function downloadByData(
  data: Blob | ArrayBuffer | string,
  name: string,
  type?: string
) {
  const blob = new Blob([data], { type: type || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 下载文件方法
export const handleDownload = (url: string, fileName?: string) => {
  // headers: new Headers({
  //   Origin: location.origin
  // }),
  try {
    fetch(url, {
      mode: 'cors'
    })
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        }
        ElMessage.error(`下载失败`);
        throw new Error(`[Exception] Download threw an error, ${res.status}`);
      })
      .then((blob) => {
        downloadFile(blob, fileName || '下载文件');
      });
  } catch (err) {
    ElMessage.error(`下载失败`);
    console.log(`[Exception] Download threw an error`);
  }
}

// 辅助函数---下载文件方法
export const downloadFile = (blob: Blob, filename: string) => {
  const a = document.createElement('a');
  a.download = filename;
  const blobUrl = URL.createObjectURL(blob);
  a.href = blobUrl;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
}
export const loop = (t: number) => new Promise((resolve) => setTimeout(resolve, t));
export const toastErrorMessage = (message: any) => {
  if (typeof message !== 'string') return 'Đã xảy ra lỗi! Vui lòng thử lại';
  return message;
};

export const makeid = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random()
* charactersLength));
  }
  return result;
};
export const fileSize = (size: number) => {
  if (size === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return (size / Math.pow(k, i)).toFixed(2) + ` ${sizes[i]}`;
};
export const getImage = (file: File): Promise<{ width: string, height: string, size: string }> => new Promise(resolve => {
  const img = new Image();
  const objectUrl = URL.createObjectURL(file);
  img.onload = function () {
    resolve({ width: '' + img.width, height: '' + img.height, size: fileSize(file.size) });
    URL.revokeObjectURL(objectUrl);
  };
  img.src = objectUrl;
});

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

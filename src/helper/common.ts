export const loop = (t: number) => new Promise((resolve) => setTimeout(resolve, t));
export const toastErrorMessage = (message: any) => {
  if (typeof message !== 'string') return 'Đã xảy ra lỗi! Vui lòng thử lại';
  return message;
};

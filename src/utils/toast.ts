import { toast, ToastOptions } from "react-hot-toast";

import { MetamaskError } from "../types/error";

export const toastError = (error: Error | null, options?: ToastOptions): void => {
  if (error) {
    toast.error(((error as MetamaskError)?.reason || error?.message) ?? "Unkown error occured.", options);
  }
};

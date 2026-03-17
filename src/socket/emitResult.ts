
type EmitResultParams<T = any> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
};

export const emitResult = <T = any>({
  statusCode,
  success,
  message,
  data,
}: EmitResultParams<T>) => {
  return {
    statusCode,
    success,
    message,
    ...(data !== undefined && { data }),
  };
};



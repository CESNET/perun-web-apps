export interface RPCError extends Error {
  errorId: string;
  message: string;
  name: string;
  type: string;
  status: number;
  call?: string;
  payload?: object;
  urlWithParams?: string;
}

export interface RPCError extends Error {
  errorId: string;
  message: string;
  name: string;
  type: string;
  call?: string;
  payload?: object;
  urlWithParams?: string;
}

import { YeetpostResponse } from "./YeetpostResponse";

export type YeetpostErrorResponse =
  | (YeetpostResponse & {
      status: 400 | 401 | 403 | 415 | 422 | 500;
    })
  | {
      status: number;
      body: Record<string, unknown> | string | null;
    };

export class YeetpostError extends Error {
  public response: YeetpostErrorResponse;

  constructor(message: string, response: YeetpostErrorResponse) {
    super(message);
    this.response = response;
  }
}

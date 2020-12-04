import { RequestUserType } from "../user/user.dto";
export {};

declare global {
  interface Func extends Function {
    new (...args: any[]): any;
  }

  namespace Express {
    interface Request {
      user: RequestUserType
    }
  }
}
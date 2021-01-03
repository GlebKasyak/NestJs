import { UserEntity } from "../user/user.entity";
export {};

declare global {
  interface Func extends Function {
    new (...args: any[]): any;
  }

  namespace Express {
    export interface Request {
      user: UserEntity;
    }
  }
}

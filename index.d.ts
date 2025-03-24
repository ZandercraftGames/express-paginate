// index.d.ts

declare module '@zandercraftgames/express-paginate' {
  import { Request, Response, NextFunction } from 'express';

  export function href(req: Request): (args?: boolean | object, params?: object) => string;

  export function hasNextPages(req: Request): (pageCount: number) => boolean;

  export function getArrayPages(req: Request): (limit: number, pageCount: number, currentPage: number) => { number: number, url: string }[];

  export function middleware(limit?: number, maxLimit?: number): (req: Request, res: Response, next: NextFunction) => void;

  // Declare the interfaces inside the module
  interface Paginate {
    page: number;
    limit: number;
    skip: number;
  }

  interface PaginateLocals {
    page: number;
    limit: number;
    href: (args?: boolean | object, params?: object) => string;
    hasPreviousPages: boolean;
    hasNextPages: (pageCount: number) => boolean;
    getArrayPages: (limit: number, pageCount: number, currentPage: number) => { number: number, url: string }[];
  }

  // Augment Express interfaces within the module
  namespace Express {
    interface Request {
      paginate: Paginate;
      skip: number;
      offset: number;
    }

    interface Response {
      locals: {
        paginate: PaginateLocals;
      };
    }
  }
}

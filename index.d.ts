// index.d.ts

declare module '@zandercraftgames/express-paginate' {
  import { Request, Response, NextFunction } from 'express';

  export function href(req: Request): (args?: boolean | object, params?: object) => string;

  export function hasNextPages(req: Request): (pageCount: number) => boolean;

  export function getArrayPages(req: Request): (limit: number, pageCount: number, currentPage: number) => { number: number, url: string }[];

  /**
   * Middleware function for handling pagination in Express requests.
   *
   * This middleware adds pagination metadata to the request and response objects.
   * It uses the provided `limit` and `maxLimit` values to control the page size and enforce maximum limits.
   *
   * @param {number} [limit=10] - The default number of items per page
   * @param {number} [maxLimit=50] - The maximum allowed number of items per page.
   *
   * @returns {Function} A middleware function that can be used in an Express route.
   * It adds pagination metadata to the `req` object and makes it available for use in other middleware or route handlers.
   *
   * @example
   * app.use(middleware(20, 50));
   */
  export function middleware(limit?: number, maxLimit?: number): (req: Request, res: Response, next: NextFunction) => void;

  // Declare the interfaces inside the module
  interface Paginate {
    // Current page number
    page: number;
    // Maximum number of records to return
    limit: number;
    // Number of records to skip before starting to return (a.k.a. offset)
    skip: number;
  }

  interface PaginateLocals {
    // Current page number
    page: number;
    // Maximum number of records to return
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

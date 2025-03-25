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
   * @param {number} [minLimit=0] - The minimum requestable number of items per page.
   *
   * @returns {Function} A middleware function that can be used in an Express route.
   * It adds pagination metadata to the `req` object and makes it available for use in other middleware or route handlers.
   *
   * @example
   * app.use(middleware(20, 50));
   */
  export function middleware(limit?: number, maxLimit?: number, minLimit?: number): (req: Request, res: Response, next: NextFunction) => void;

  /**
   * Pagination properties accessible from `req.paginate`
   */
  export interface Paginate {
    // Current page number
    page: number;
    // Maximum number of records to return
    limit: number;
    // Number of records to skip before starting to return (a.k.a. offset)
    skip: number;
    // (Alias of skip) Number of records to skip before starting to return
    offset: number;
  }

  /**
   * Utilities for use in views, allowing for paginated hyperlinks.
   *
   * Accessible from `res.locals.paginate`
   */
  export interface PaginateLocals {
    // Current page number
    page: number;
    // Maximum number of records to return
    limit: number;
    href: (args?: boolean | object, params?: object) => string;
    // Whether there are previous pages to go back to
    hasPreviousPages: boolean;
    // Function to determine if there are more pages to go to
    hasNextPages: (pageCount: number) => boolean;
    // Function to retrieve a list of links for each page
    getArrayPages: (limit: number, pageCount: number, currentPage: number) => { number: number, url: string }[];
  }

  /**
   * Express interfaces augmented with pagination properties added by middleware
   */
  export namespace Express {
    interface Request {
      paginate?: Paginate;
      // Number of records to skip before starting to return (a.k.a. offset)
      skip?: number;
      // (Alias of skip) Number of records to skip before starting to return
      offset?: number;
      // Maximum number of records to return
      limit?: number;
    }

    interface Response {
      locals: {
        paginate?: PaginateLocals;
      };
    }
  }
}

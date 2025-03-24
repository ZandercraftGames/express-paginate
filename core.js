
//     express-paginate
//     Copyright (c) 2014- Nick Baugh <niftylettuce@gmail.com> (http://niftylettuce.com)
//     MIT Licensed

// Node.js pagination middleware and view helpers.

// * Author: [@niftylettuce](https://twitter.com/#!/niftylettuce)
// * Source: <https://github.com/niftylettuce/express-paginate>
"use strict";

import qs from 'qs';
import { URL } from 'url';
import cloneDeep from 'lodash.clonedeep';
import assign from 'lodash.assign';

function href(req) {
  return function(...args) {
    let query = cloneDeep(req.query);
    let params = {};

    if (args.length === 1 && typeof args[0] === 'object') {
      // Called with an object: use it as the parameters.
      params = args[0];
    } else if (args.length > 0) {
      // Called with a boolean flag as the first argument.
      const isPrev = Boolean(args[0]);
      query.page = parseInt(query.page, 10) || 1;
      query.page += isPrev ? -1 : 1;
      query.page = Math.max(query.page, 1);
      params = args[1] || {};
    }

    // Merge additional query parameters (useful for sorting and filtering)
    query = assign(query, params);

    // Use req.protocol if available (with fallback to 'http') for better HTTPS/proxy support
    const protocol = req.protocol || 'http';
    const host = req.headers.host;
    const url = new URL(req.originalUrl, `${protocol}://${host}`);
    url.search = qs.stringify(query);

    return url.pathname + url.search;
  };
}

function hasNextPages(req) {
  return function(pageCount) {
    if (typeof pageCount !== 'number' || pageCount < 0) {
      throw new Error('express-paginate: `pageCount` is not a number >= 0');
    }
    return req.query.page < pageCount;
  };
}

function getArrayPages(req) {
  return function(limit, pageCount, currentPage) {
    // Default limit is 3 if not provided
    limit = typeof limit === 'number' ? limit : 3;

    if (typeof limit !== 'number' || limit < 0) {
      throw new Error('express-paginate: `limit` is not a number >= 0');
    }

    if (typeof pageCount !== 'number' || pageCount < 0) {
      throw new Error('express-paginate: `pageCount` is not a number >= 0');
    }

    currentPage = parseInt(currentPage, 10) || 1;

    if (currentPage < 1 || currentPage > pageCount) {
      throw new Error('express-paginate: `currentPage` is not within valid range');
    }

    const pages = [];
    const halfLimit = Math.floor(limit / 2);
    const start = Math.max(1, currentPage - halfLimit);
    const end = Math.min(pageCount, currentPage + halfLimit);

    for (let i = start; i <= end; i++) {
      pages.push({
        number: i,
        url: href(req)(false, { page: i })
      });
    }

    return pages;
  };
}

function middleware(limit, maxLimit) {
  const _limit = parseInt(limit, 10) || 10;
  const _maxLimit = parseInt(maxLimit, 10) || 50;

  return function _middleware(req, res, next) {
    req.paginate = {};
    req.paginate.page = req.page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    req.paginate.limit = req.limit = Math.min(Math.max(parseInt(req.query.limit, 10) || _limit, 0), _maxLimit);
    req.paginate.skip = req.skip = req.offset = (req.paginate.page - 1) * req.paginate.limit;

    res.locals.paginate = {
      page: req.paginate.page,
      limit: req.paginate.limit,
      href: href(req),
      hasPreviousPages: req.paginate.page > 1,
      hasNextPages: hasNextPages(req),
      getArrayPages: getArrayPages(req)
    };

    next();
  };
}

export { href, hasNextPages, getArrayPages, middleware };

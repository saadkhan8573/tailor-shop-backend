import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Pagination } from 'utils';

export const Paginate = createParamDecorator(
  (data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();

    const paginationParams: Pagination = {
      skip: 0,
      limit: 1000,
      sort: [],
      search: [],
    };

    paginationParams.skip = req.query.skip
      ? parseInt(req.query.skip.toString(), 10)
      : 0;
    paginationParams.limit = req.query.limit
      ? parseInt(req.query.limit.toString(), 10)
      : 1000;

    // create array of sort
    if (req.query.sort) {
      const sortArray = req.query.sort.toString().split(',');
      paginationParams.sort = sortArray.map((sortItem) => {
        const sortBy = sortItem[0];
        switch (sortBy) {
          case '-':
            return {
              field: sortItem.slice(1),
              by: 'DESC',
            };
          case '+':
            return {
              field: sortItem.slice(1),
              by: 'ASC',
            };
          default:
            return {
              field: sortItem.trim(),
              by: 'DESC',
            };
        }
      });
    }

    // create array of search
    if (req.query.search) {
      const field = req.query.search.toString().split(',');
      paginationParams.search = field.map((searchItem) => {
        const splitSearchItem = searchItem.split(':');
        const field = splitSearchItem[0];
        const value = splitSearchItem[1];

        return {
          field,
          value,
        };
      });
    }

    return paginationParams;
  },
);

export interface Pagination {
  skip?: number;
  limit?: number;
  sort?: { field: string; by: 'ASC' | 'DESC' }[];
  search?: { field: string; value: string }[];
}

export const PaginateResult = <ListType>(
  skip: number,
  limit: number,
  totalResult: number,
  list: ListType[],
) => {
  const currentPage = skip / limit + 1;
  const totalPage = Math.ceil(totalResult / limit);
  const hasNext = totalResult > skip + limit;
  const hasPrevious = currentPage > 1;
  return {
    data: list,
    pagination: {
      currentPage,
      totalResult,
      totalPage,
      itemPerPage: limit,
      hasNext,
      hasPrevious,
    },
  };
};

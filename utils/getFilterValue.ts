import { Pagination } from './pagination';
import { Raw } from 'typeorm';
export const getFilterValues = (pagination: Pagination) => {
  const filter: any = {};

  pagination.search.forEach(
    (p) =>
      (filter[p.field] = Raw(
        (value) => `LOWER(${value}) ILike '%${p.value}%'`,
      )),
  );
  console.log('filter', filter);
  //   pagination.search.forEach((p) =>
  //     p.field === 'status'
  //       ? (filter[p.field] = p.value as UserStatus)
  //       : p.field === 'currentStatus'
  //       ? (filter[p.field] = p.value as WorkPlaceRequestStatus)
  //       : p.field === 'appointmentFor'
  //       ? (filter[p.field] = p.value as UserType)
  //       : p.field === 'rtoId'
  //       ? (filter[p.field] = Number(p.value))
  //       : p.field === 'subAdminId'
  //       ? (filter[p.field] = Number(p.value))
  //       : p.field === 'result'
  //       ? (filter[p.field] = p.value)
  //       : p.field === 'industryId'
  //       ? (filter[p.field] = Number(p.value))
  //       : p.field === 'courseId'
  //       ? (filter[p.field] = Number(p.value))
  //       : p.field === 'phone'
  //       ? (filter[p.field] = Raw(
  //           (value) =>
  //             `REPLACE(${value},' ','') Like '%${p.value.toLowerCase()}%'`,
  //         ))
  //       : (filter[p.field] = Raw(
  //           (value) => `LOWER(${value}) Like '%${p.value.toLowerCase()}%'`,
  //         )),
  //   );
  return filter;
};

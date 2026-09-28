export const getTotalPages = (totalItems: number, itemsPerPage: number) =>
  Math.max(1, Math.ceil(totalItems / itemsPerPage));

export const paginate = <T>(items: T[], currentPage: number, itemsPerPage: number) =>
  items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

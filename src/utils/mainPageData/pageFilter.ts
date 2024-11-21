export const pageSlice = 10;

export const startDataNumber = (pageNumber: number) => {
  return (pageNumber - 1) * pageSlice;
};

export const endDataNumber = (pageNumber: number) => {
  return pageNumber * pageSlice - 1;
};

export const platformConversion = (filter: string) => {
  return filter === '전체' ? 'name' : filter;
};

export const nowTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 9);
  return now.toISOString();
};

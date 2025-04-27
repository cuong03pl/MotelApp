export const getLastDate = (date) => {
  const now = new Date();
  const postDate = new Date(date);
  const diffTime = Math.abs(now - postDate);

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default getLastDate;

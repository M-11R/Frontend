
export const limitTitle = (title: string, limit: number): string => {
  if (title.length > limit) {
    return title.slice(0, limit) + " ...";
  }
  return title;
};
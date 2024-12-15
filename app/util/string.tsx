
export const limitTitle = (title: string, limit: number): string => {
    const newTitle: string[] = [];
  
    if (title.length > limit) {
      title.split(' ').reduce((acc, cur) => {
        if (acc + cur.length + (newTitle.length > 0 ? 1 : 0) <= limit) {
          newTitle.push(cur);
          return acc + cur.length + 1;
        }
        return acc;
      }, 0);
  
      if (newTitle.length === 0) {return `${title.slice(0, limit)} ...`;}
  
      return `${newTitle.join(' ')} ...`;
    }
  
    return title;
  };
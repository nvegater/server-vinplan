export const arrayAreEquals = (a: Array<any>, b: Array<any>) => {
  return (
    Array.isArray(a) &&
    Array.isArray(a) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
};

export const getDifferentsElements = (a: Array<any>, b: Array<any>) => {
  return a.filter((object) => b.indexOf(object) == -1);
};

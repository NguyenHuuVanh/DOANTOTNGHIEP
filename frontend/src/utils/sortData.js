const sortedData = (data) => {
  const dataSorted = data.sort((a, b) => {
    if (a.date > b.date) return 1;
    if (a.date < b.date) return -1;

    if (a.time > b.time) return 1;
    if (a.time < b.time) return -1;

    return 0;
  });
  return dataSorted;
};

export default sortedData;

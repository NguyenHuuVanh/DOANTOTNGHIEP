const Delayed = (promise, delay = 3000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      promise.then((module) => resolve(module));
    }, delay);
  });
};

export default Delayed;

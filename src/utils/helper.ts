function msleep(ms: number) {
  return new Promise((resolve, reject) => {
    if (isNaN(ms) || ms < 0) {
      reject("invalid_ms");
      return;
    }
    setTimeout(resolve, ms);
  });
}

export { msleep };

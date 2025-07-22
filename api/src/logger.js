const logger = {
  info: (message) => {
    if (process.env.NODE_ENV !== 'test') {
      console.info(`[INFO] ${message}`);
    }
  },
  error: (message) => {
    console.error(`[ERROR] ${message}`);
  },
  warn: (message) => {
    console.warn(`[WARN] ${message}`);
  }
};

module.exports = logger;

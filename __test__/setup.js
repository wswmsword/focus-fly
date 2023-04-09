global.console = {
  ...console,
  // uncomment to ignore a specific log level
  warn: () => {},
  // error: jest.fn(),
};
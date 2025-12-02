// globally mock logger
jest.mock('./src/common/utils/logger');
// globally mock loki logger
jest.mock('./src/common/utils/loki-logger');
// mock convex client
jest.mock('./src/common/config/convex.config.ts');
jest.mock('convex/browser');

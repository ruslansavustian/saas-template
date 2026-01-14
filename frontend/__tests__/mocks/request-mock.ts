const mockRequest = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

jest.mock("@/utils/request", () => ({
  request: mockRequest,
}));

export { mockRequest };

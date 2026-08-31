import { describe, it, expect, vi } from "vitest";
import { z } from "zod/v4";
import { validate } from "../validate.js";

function createMockReqRes(body: unknown) {
  const req = { body } as any;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
  const next = vi.fn();
  return { req, res, next };
}

const schema = z.object({
  name: z.string().min(1),
  age: z.number().int().min(0),
});

describe("validate middleware", () => {
  it("should call next() when body is valid", () => {
    const { req, res, next } = createMockReqRes({ name: "John", age: 25 });
    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({ name: "John", age: 25 });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 400 when body is invalid", () => {
    const { req, res, next } = createMockReqRes({ name: "", age: -1 });
    validate(schema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Validation failed" })
    );
  });

  it("should return 400 when body has wrong types", () => {
    const { req, res, next } = createMockReqRes({ name: 123, age: "not a number" });
    validate(schema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should strip unknown keys from body", () => {
    const { req, res, next } = createMockReqRes({ name: "John", age: 25, extra: "should be stripped" });
    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({ name: "John", age: 25 });
  });
});

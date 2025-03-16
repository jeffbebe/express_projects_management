import { plainToInstance, ClassConstructor } from "class-transformer";
import { validate } from "class-validator";
import { Request } from "express";
import { BadRequestException } from "../errors/bad-request.error";

export const validateRequestPayload = async <T extends object>(
  dtoClass: ClassConstructor<T>,
  source: "body" | "query",
  req: Request
): Promise<T> => {
  const payloadSource = source === "body" ? req.body : req.query;
  const dtoInstance = plainToInstance(dtoClass, payloadSource, {
    excludeExtraneousValues: true,
  });
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    throw new BadRequestException({
      message: "Validation failed",
      errors: errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      })),
    });
  }

  return dtoInstance;
};

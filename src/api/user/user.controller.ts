import { NextFunction, Request, Response } from "express";
import { isMongoId } from "class-validator";
import { validateRequestPayload } from "../../common/middleware/validate-body.validator";
import { BadRequestException } from "../../common/errors/bad-request.error";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { userService } from "./user.service";

export class UserController {
  async patchUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      if (!userId?.length || !isMongoId(userId)) {
        throw new BadRequestException({
          message: "User id is missing or has incorrect format.",
        });
      }

      const payload = await validateRequestPayload(PatchUserDto, "body", req);

      await userService.updateUser(payload, userId);

      res.status(200).send().end();
    } catch (err) {
      next(err);
    }
  }
}

import { PatchUserDto } from "./dtos/patch-user.dto";
import { UserDocument, UserModel } from "../../database/schema/user.schema";
import { NotFoundException } from "../../common/errors/not-found.error";

export class UserService {
  public async updateUser({ name, surname }: PatchUserDto, userId: string) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new NotFoundException({
        message: "User with such id does not exist.",
      });
    }

    user.name = name ?? user.name;
    user.surname = surname ?? user.surname;
    user.updatedAt = new Date();

    await user.save();
  }

  public async findManyByIds(ids: string[]): Promise<UserDocument[]> {
    if (!ids.length) {
      return [];
    }

    return UserModel.find({ _id: { $in: [ids] } });
  }
}

export const userService = new UserService();

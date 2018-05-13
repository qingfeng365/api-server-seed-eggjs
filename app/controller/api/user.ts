import { Controller } from "egg";

export default class UserController extends Controller {
  public async count() {
    const { ctx } = this;

    const userCount = await this.ctx.model.User.getCount();

    ctx.body = { userCount };
  }
}

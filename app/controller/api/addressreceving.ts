import { Controller } from 'egg';
import { Sequelize } from 'sequelize';
export default class AddressRecevingController extends Controller {
  public async count() {
    const { ctx } = this;
    ctx.logger.debug('-----------ctx.model----------');
    ctx.logger.debug('ctx.model:', ctx.model);
    ctx.logger.debug('-----------ctx.model.models----------');
    ctx.logger.debug('ctx.model.models:', ctx.model.models);

    const sequelize: Sequelize = ctx.model;
    ctx.logger.debug('sequelize.models:', sequelize.models);

    const addressRecevingCount = await ctx.model.AddressReceving.getCount();
    const addressRecevingData = await ctx.model.AddressReceving.fetch();
    ctx.body = { addressRecevingCount, addressRecevingData };
  }
}

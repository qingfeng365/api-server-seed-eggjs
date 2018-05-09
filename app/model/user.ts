import { Application } from 'egg';
import { DataTypes} from 'sequelize';

export default (app: Application) => {

  const DataTypes: DataTypes = app.Sequelize.DataTypes;

  const User = app.model.define('User', {
    alias: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'user',
      unique: true,
      comment: '昵称',
      validate: {
        notEmpty: {
          msg: '不允许为空'
        },
        len: {
          args: [1, 30],
          msg: '长度在1-30之间'
        }
      }
    },
    mobile: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: '13900000000',
      unique: true,
      comment: '手机号',
      validate: {
        notEmpty: {
          msg: '不允许为空',
        },
        len: {
          args: [11, 11],
          msg: '长度为11',
        }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      // defaultValue: '@',
      unique: true,
      comment: '邮箱',
      validate: {
        // isEmail: {
        //   msg: '邮箱格式不正确'
        // },
        len: {
          args: [0, 100],
          msg: '长度不允许超过100'
        },
      }
    },
  });

  User.getCount = function getCount(s) {
    if (s) {
      return this
        .count({
          where: {
            $and: [{
              userType: 9,
              $or: [{
                alias: {
                  $like: '%' + s + '%'
                },
              }, {
                mobile: {
                  $like: '%' + s + '%'
                },
              }],

            }],
          },
        });
    } else {
      return this.count();
    }
  };

  return User;
};

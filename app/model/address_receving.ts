import { Application } from 'egg';
import { DataTypes } from 'sequelize';

export default (app: Application) => {
  const DataTypes: DataTypes = app.Sequelize.DataTypes;

  // tslint:disable-next-line:variable-name
  const AddressReceving = app.model.define(
    'AddressReceving',
    {
      consignee: {
        type: DataTypes.STRING(20),
        comment: '收货人',
        validate: {
          notEmpty: {
            msg: '不允许为空'
          },
          len: {
            args: [1, 20],
            msg: '收货人长度不允许超过20'
          }
        }
      },
      contactMobile: {
        type: DataTypes.STRING(20),
        comment: '联系手机',
        validate: {
          notEmpty: {
            msg: '不允许为空'
          },
          len: {
            args: [1, 20],
            msg: '联系手机长度不允许超过20'
          }
        }
      },
      province: {
        type: DataTypes.STRING(200),
        comment: '省',
        validate: {
          len: {
            args: [1, 200],
            msg: '长度不允许超过200'
          }
        }
      },
      city: {
        type: DataTypes.STRING(200),
        comment: '市',
        validate: {
          len: {
            args: [1, 200],
            msg: '长度不允许超过200'
          }
        }
      },
      area: {
        type: DataTypes.STRING(200),
        comment: '区',
        validate: {
          len: {
            args: [1, 200],
            msg: '长度不允许超过200'
          }
        }
      },
      street: {
        type: DataTypes.STRING(200),
        comment: '街道',
        validate: {
          len: {
            args: [0, 200],
            msg: '长度不允许超过200'
          }
        }
      },
      address: {
        type: DataTypes.STRING(500),
        comment: '详细地址',
        validate: {
          notEmpty: {
            msg: '不允许为空'
          },
          len: {
            args: [0, 500],
            msg: '长度不允许超过500'
          }
        }
      },
      postCode: {
        type: DataTypes.STRING(6),
        comment: '邮政编码',
        validate: {
          len: {
            args: [0, 6],
            msg: '长度不允许超过200'
          }
        }
      },
      defaultAdd: {
        type: DataTypes.BOOLEAN,
        comment: '默认地址',
        defaultValue: 0
      }
    },
    {
      freezeTableName: true,
      tableName: 'addressrecevings',
      underscored: false
    }
  );

  AddressReceving.getCount = function getCount(s) {
    let selfWhere: {};
    if (s) {
      selfWhere = Object.assign(selfWhere, {
        $and: [
          {
            userType: 9,
            $or: [
              {
                alias: {
                  $like: '%' + s + '%'
                }
              },
              {
                mobile: {
                  $like: '%' + s + '%'
                }
              }
            ]
          }
        ]
      });
    }
    if (s) {
      return this.count({ where: selfWhere });
    } else {
      return this.count();
    }
  };

  AddressReceving.fetch = function fetch(op) {
    const orderBy = { order: ['createdAt'] };
    return this.findAll(Object.assign(orderBy, op || {}));
  };

  return AddressReceving;
};

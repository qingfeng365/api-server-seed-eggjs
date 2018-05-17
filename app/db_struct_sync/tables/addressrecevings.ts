import { CreateTableOption, FieldType } from '../db_struct_model';

// tslint:disable-next-line:variable-name
const addressrecevings: CreateTableOption = {
  tableName: 'addressrecevings',
  tableComment: '收货地址',
  fields: [
    {
      name: 'consignee',
      type: FieldType.VARCHAR,
      length: 20,
      comment: '收货人'
    },
    {
      name: 'contactMobile',
      type: FieldType.VARCHAR,
      length: 20,
      comment: '联系手机'
    },
    {
      name: 'province',
      type: FieldType.VARCHAR,
      length: 200,
      comment: '省'
    },
    {
      name: 'city',
      type: FieldType.VARCHAR,
      length: 200,
      comment: '市'
    },

    {
      name: 'area',
      type: FieldType.VARCHAR,
      length: 200,
      comment: '区'
    },
    {
      name: 'street',
      type: FieldType.VARCHAR,
      length: 200,
      comment: '街道'
    },
    {
      name: 'address',
      type: FieldType.VARCHAR,
      length: 500,
      comment: '详细地址'
    },
    {
      name: 'postCode',
      type: FieldType.VARCHAR,
      length: 6,
      comment: '邮政编码'
    },
    {
      name: 'defaultAdd',
      type: FieldType.BOOLEAN,
      comment: '默认地址'
    }
  ]
};

export { addressrecevings };

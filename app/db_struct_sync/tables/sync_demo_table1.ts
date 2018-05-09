import { CreateTableOption, FieldType } from '../db_struct_model';

// tslint:disable-next-line:variable-name
const sync_demo_table1: CreateTableOption = {
  tableName: 'sync_demo_table1',
  fields: [
    {
      name: 'CHAR',
      type: FieldType.CHAR,
      comment: 'CHAR字段,无其它指定',
    },
    {
      name: 'VARCHAR',
      type: FieldType.VARCHAR,
      comment: 'VARCHAR字段,无其它指定',
    },
    {
      name: 'INT',
      type: FieldType.INT,
      comment: 'INT字段,无其它指定',
    },
    {
      name: 'BIGINT',
      type: FieldType.BIGINT,
      comment: 'VARCHAR字段,无其它指定',
    },

    {
      name: 'FLOAT',
      type: FieldType.FLOAT,
      comment: 'FLOAT字段,无其它指定',
    },
    {
      name: 'DECIMAL',
      type: FieldType.DECIMAL,
      comment: 'DECIMAL字段,无其它指定',
    },
    {
      name: 'BOOLEAN',
      type: FieldType.BOOLEAN,
      comment: 'BOOLEAN字段,无其它指定',
    },
    {
      name: 'TEXT',
      type: FieldType.TEXT,
      comment: 'TEXT字段,无其它指定',
    },
    {
      name: 'DATETIME',
      type: FieldType.DATETIME,
      comment: 'DATETIME字段,无其它指定',
    },
    {
      name: 'DATEONLY',
      type: FieldType.DATEONLY,
      comment: 'DATEONLY字段,无其它指定',
    },
  ],
}

export { sync_demo_table1 }


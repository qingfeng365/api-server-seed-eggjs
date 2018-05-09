import { CreateTableOption, FieldType } from '../db_struct_model';

// tslint:disable-next-line:variable-name
const sync_demo_table2: CreateTableOption = {
  tableName: 'sync_demo_table2',
  fields: [
    {
      name: 'CHAR',
      type: FieldType.CHAR,
      length: 50,
      notNull: true,
      comment: 'CHAR字段,notNull,50',
    },
    {
      name: 'VARCHAR',
      type: FieldType.VARCHAR,
      defaultValue: `'varchar...'`,
      comment: 'VARCHAR字段,defaultValue',
    },
    {
      name: 'INT',
      type: FieldType.INT,
      comment: 'INT字段',
    },
    {
      name: 'BIGINT',
      type: FieldType.BIGINT,
      comment: 'VARCHAR字段',
    },

    {
      name: 'FLOAT',
      type: FieldType.FLOAT,
      decimals: 4,
      defaultValue: '100.10',
      comment: 'FLOAT字段,defaultValue,decimals',
    },
    {
      name: 'DECIMAL',
      type: FieldType.DECIMAL,
      length: 20,
      decimals: 4,
      comment: 'DECIMAL字段,length,decimals',
    },
    {
      name: 'BOOLEAN',
      type: FieldType.BOOLEAN,
      comment: 'BOOLEAN字段',
    },
    {
      name: 'TEXT',
      type: FieldType.TEXT,
      comment: 'TEXT字段,无其它指定',
    },
    {
      name: 'DATETIME',
      type: FieldType.DATETIME,
      comment: 'DATETIME字段',
    },
    {
      name: 'DATEONLY',
      type: FieldType.DATEONLY,
      comment: 'DATEONLY字段',
    },
  ],
}

export { sync_demo_table2 }


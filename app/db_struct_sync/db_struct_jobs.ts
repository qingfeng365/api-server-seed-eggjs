import { FieldType } from './db_struct_model';
import { dbStructSync } from './db_struct_sync';
import { sync_demo_table1 } from './tables/sync_demo_table1';
import { sync_demo_table2 } from './tables/sync_demo_table2';
import { addressrecevings } from './tables/addressrecevings';
export function buildSyncJobs() {
  // 增加表 sync_demo_table1
  dbStructSync.addJobByCreateTable(
    sync_demo_table1.tableName,
    sync_demo_table1.fields
  );

  // 增加表字段 sync_demo_table1.addFieldVarchar
  dbStructSync.addJobByAddField('sync_demo_table1', {
    name: 'addFieldVarchar',
    type: FieldType.VARCHAR,
    length: 100,
    notNull: true
  });

  // 增加表字段 sync_demo_table1.addFieldFloat_20_4
  dbStructSync.addJobByAddField('sync_demo_table1', {
    name: 'addFieldFloat_20_4',
    type: FieldType.FLOAT,
    length: 20,
    decimals: 4
  });

  // 调整字符字段大小 sync_demo_table1.addFieldVarchar
  dbStructSync.addJobByAdjustFieldSize(
    'sync_demo_table1',
    'addFieldVarchar',
    FieldType.VARCHAR,
    {
      length: 200
    }
  );

  // 调整数值字段大小 sync_demo_table1.DECIMAL
  dbStructSync.addJobByAdjustFieldSize(
    'sync_demo_table1',
    'DECIMAL',
    FieldType.DECIMAL,
    {
      length: 20,
      decimals: 4
    }
  );

  dbStructSync.addJobByAddField('sync_demo_table1', {
    name: 'addFieldIntToVarChar',
    type: FieldType.INT
  });

  dbStructSync.addJobByAdjustFieldType(
    'sync_demo_table1',
    'addFieldIntToVarChar',
    FieldType.INT,
    {
      type: FieldType.VARCHAR,
      length: 100,
      comment: 'IntToVarChar',
      defaultValue: `'...test...'`,
      notNull: true
    }
  );

  dbStructSync.addJobByChangeFieldName(
    'sync_demo_table1',
    'DECIMAL',
    'DECIMALNewName'
  );

  // 增加表 sync_demo_table2
  dbStructSync.addJobByCreateTable(
    sync_demo_table2.tableName,
    sync_demo_table2.fields,
    sync_demo_table2.tableComment
  );

  // 增加表 addressrecevings
  dbStructSync.addJobByCreateTable(
    addressrecevings.tableName,
    addressrecevings.fields,
    addressrecevings.tableComment
  );
}

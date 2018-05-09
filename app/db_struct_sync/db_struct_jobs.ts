import { dbStructSync } from './db_struct_sync';
import { sync_demo_table1 } from './tables/sync_demo_table1';
import { sync_demo_table2 } from './tables/sync_demo_table2';
import { FieldType } from './db_struct_model';
export function buildSyncJobs() {
  dbStructSync.addJobByCreateTable(
    sync_demo_table1.tableName,
    sync_demo_table1.fields);

  dbStructSync.addJobByCreateTable(
    sync_demo_table2.tableName,
    sync_demo_table2.fields);

  dbStructSync.addJobByAddField('sync_demo_table1', {
    name: 'addFieldVarchar',
    type: FieldType.VARCHAR,
    length: 100,
    notNull: true,
  });
  dbStructSync.addJobByAddField('sync_demo_table1', {
    name: 'addFieldFloat_20_4',
    type: FieldType.FLOAT,
    length: 20,
    decimals: 4,
  });

  dbStructSync.addJobByAdjustFieldSize('sync_demo_table1',
    'addFieldVarchar', FieldType.VARCHAR,
    {
      length: 200,
    });

};


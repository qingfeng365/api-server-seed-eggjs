import { buildSyncJobs } from './db_struct_jobs';
import { SyncJob, JobType, CreateTableOption, FieldDefine, FieldType, AddFieldOption, AdjustFieldSizeOption } from './db_struct_model';

/**
 * 数据库结构同步工具
 *
 * @class DbStructSync
 */
class DbStructSync {


  syncJobs: SyncJob[];
  dbName: string;
  db: any;
  logger: any;
  constructor() {
    this.syncJobs = [];
  }

  public async syncDb(dbName: string, db: any, logger: any) {
    this.db = db;
    this.logger = logger;
    this.dbName = dbName;

    logger.info('准备开始同步数据库结构:', dbName);
    buildSyncJobs();
    await this.execJobs();
    logger.info('同步数据库结构任务已完成.');
  }
  /**
   * 增加表 ;
   * 跳过条件: 表已存在
   * @param {string} tableName 表名
   * @param {*} tableFields 字段列表
   * @memberof DbStructSync
   */
  public addJobByCreateTable(tableName: string, tableFields: FieldDefine[]): void {
    const job: SyncJob = {
      jobType: JobType.createTable,
      jobOption: {
        tableName,
        fields: tableFields,
      } as CreateTableOption,
    };
    this.addJob(job);
  }

  /**
   * 增加字段 ;
   * 跳过条件: 字段已存在
   * @param {string} tableName
   * @param {FieldDefine} field
   * @memberof DbStructSync
   */
  public addJobByAddField(tableName: string, field: FieldDefine): void {
    const job: SyncJob = {
      jobType: JobType.addField,
      jobOption: {
        tableName,
        field,
      } as AddFieldOption,
    };
    this.addJob(job);
  }
  /**
   * 调整字段大小(增大), 只能对 CHAR VARCHAR DECIMAL 字段调整 ;
   * 可执行条件: 当前字段存在, 类型相同, CHAR VARCHAR: 当前小于设置,  DECIMAL:精度或小数不等 ;
   * 跳过条件: 不符合 可执行条件 时 跳过 ;
   * 报错条件:
   * 1) 对非 CHAR VARCHAR DECIMAL 字段调整 ;
   * 
   * @param {string} tableName
   * @param {string} fieldName
   * @param {FieldType} fieldtype
   * @param {FieldDefine} newFieldDef
   * @memberof DbStructSync
   */
  public addJobByAdjustFieldSize(tableName: string, fieldName: string,
    fieldtype: FieldType, newFieldDef: FieldDefine): void {
    const job: SyncJob = {
      jobType: JobType.adjustFieldSize,
      jobOption: {
        tableName,
        fieldName,
        fieldtype,
        newFieldDef,
      } as AdjustFieldSizeOption,
    };
    this.addJob(job);
  }

  public async execJobs() {
    if (this.syncJobs.length === 0) {

      return true;
    }

    const lastJob = this.syncJobs[this.syncJobs.length - 1];
    const lastJobNeedExec = await this.checkJobNeedExec(lastJob);

    this.logger.info('检查是否需要执行同步结构任务:', lastJobNeedExec);
    if (lastJobNeedExec) {
      const conn = await this.db.beginTransaction();
      try {
        for (const job of this.syncJobs) {
          await this.runJob(job);
        }
        await conn.commit();
        this.logger.info('数据库事务已提交.');
      } catch (error) {
        await conn.rollback();
        this.logger.info('数据库事务已回滚.');
        throw error;
      }

    }
    return true;
  }
  private addJob(job: SyncJob) {
    this.syncJobs.push(job);
  }
  private async runJob(job: SyncJob): Promise<boolean> {
    let result = false;
    const needExec = await this.checkJobNeedExec(job);
    if (needExec) {
      switch (job.jobType) {
        case JobType.createTable:
          result = await this.execCreateTable(job.jobOption as CreateTableOption);
          break;
        case JobType.addField:
          result = await this.execAddField(job.jobOption as AddFieldOption);
          break;
        case JobType.adjustFieldSize:
          result = await this.execAdjustFieldSize(job.jobOption as AdjustFieldSizeOption);
          break;
        default:

      }
    }
    return result;
  }
  private async checkJobNeedExec(job: SyncJob): Promise<boolean> {
    let result = false;
    switch (job.jobType) {
      case JobType.createTable:
        result = !(await this.isTableExist(job.jobOption.tableName));
        break;
      case JobType.addField:
        {
          const op = job.jobOption as AddFieldOption;
          result = !(await this.isTableFieldExistForName(
            op.tableName,
            op.field.name));
        }
        break;
      case JobType.adjustFieldSize:
        {
          const op = job.jobOption as AdjustFieldSizeOption;
          // 如果字段存在,且类型相同,且大小小于设置,才需要执行,否则跳过
          result = (await this.isTableFieldExistForNameTypeLessSize(
            op.tableName, op.fieldtype, op.newFieldDef));
        }
        break;

      default:

    }

    return result;
  }

  private async isTableExist(tableName: string): Promise<boolean> {
    const checkSQL = this.getCheckTableExistSQL(tableName);

    const result = await this.db.queryOne(checkSQL);
    this.logger.debug('\nquery SQL:\n', checkSQL, '\nquery result:\n', result);
    return result.isExist;
  }
  private async isTableFieldExistForName(tableName: string, fieldName: string): Promise<boolean> {
    const checkSQL = this.getCheckTableFieldExistForNameSQL(tableName, fieldName);

    const result = await this.db.queryOne(checkSQL);
    this.logger.debug('\nquery SQL:\n', checkSQL, '\nquery result:\n', result);
    return result.isExist;
  }

  private async isTableFieldExistForNameTypeLessSize(
    tableName: string, fieldType: FieldType,
    fieldDef: FieldDefine): Promise<boolean> {
    const querySQL = this.getQueryTableFieldSchemaSQL(tableName, field.name);

    const query = await this.db.queryOne(querySQL);
    /*
 {
  TABLE_CATALOG: 'def',
  TABLE_SCHEMA: 'apiserver_seed_dev',
  TABLE_NAME: 'sync_demo_table1',
  COLUMN_NAME: 'addFieldVarchar',
  ORDINAL_POSITION: 14,
  COLUMN_DEFAULT: '',
  IS_NULLABLE: 'NO',
  DATA_TYPE: 'varchar',
  CHARACTER_MAXIMUM_LENGTH: 100,
  CHARACTER_OCTET_LENGTH: 400,
  NUMERIC_PRECISION: null,
  NUMERIC_SCALE: null,
  DATETIME_PRECISION: null,
  CHARACTER_SET_NAME: 'utf8mb4',
  COLLATION_NAME: 'utf8mb4_general_ci',
  COLUMN_TYPE: 'varchar(100)',
  COLUMN_KEY: '',
  EXTRA: '',
  PRIVILEGES: 'select,insert,update,references',
  COLUMN_COMMENT: '',
  GENERATION_EXPRESSION: '' }
    */

    this.logger.debug('\nquery SQL:\n', querySQL, '\nquery result:\n', query);

    let result = false;
    if (query) {
      const dataType = (query.DATA_TYPE as string).toUpperCase();
      const defType: string = (FieldType[fieldType]).toUpperCase();
      this.logger.debug('dataType:', dataType, ' defType:', defType);
      if (dataType === defType) {

        if (dataType === 'CHAR' || dataType === 'VARCHAR') {
          const dataLength: number = query.CHARACTER_MAXIMUM_LENGTH || 0;
          const defLength: number = fieldDef.length || 0;
          this.logger.debug('dataLength:', dataLength, ' defLength:', defLength);
          result = (defLength > dataLength);
        } else if (dataType === 'DECIMAL') {

        }
      } else {
        result = false;
      }
    }
    return result;
  }
  private async execCreateTable(op: CreateTableOption): Promise<boolean> {
    this.logger.info('开始创建表:', op.tableName);
    const fieldDefSQLs: string[] = [];
    let fields = op.fields;
    if (!this.isInFields('id', fields)) {
      fields = this.insertIdFieldToFields(fields);
    }
    if (!this.isInFields('createdAt', fields)) {
      fields = this.appendCreatedAtFieldToFields(fields);
    }
    if (!this.isInFields('updatedAt', fields)) {
      fields = this.appendUpdatedAtFieldToFields(fields);
    }
    if (fields.length > 0) {

      for (const fieldDefine of fields) {
        const fieldSql = this.getFieldDefineSQL(fieldDefine);
        fieldDefSQLs.push(fieldSql);
      }

      const fieldsSQL = fieldDefSQLs.join(',');
      const execSQL =
        // tslint:disable-next-line:max-line-length
        `CREATE TABLE IF NOT EXISTS ${this.db.escapeId(op.tableName)} (${fieldsSQL}) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`;
      this.logger.info('\nexec SQL:\n', execSQL);
      const result = await this.db.query(execSQL);
      this.logger.debug('\nexec result:\n', result);
      this.logger.info('表:', op.tableName, ' 创建结束.');
    }
    return true;
  }

  private async execAddField(op: AddFieldOption): Promise<boolean> {
    this.logger.info('开始向表增加字段:', op.tableName, ' : ', op.field.name);
    const fieldSql = this.getFieldDefineSQL(op.field);
    const execSQL =
      `ALTER TABLE ${this.db.escapeId(op.tableName)} ADD COLUMN ${fieldSql}`;
    this.logger.info('\nexec SQL:\n', execSQL);
    const result = await this.db.query(execSQL);
    this.logger.debug('\nexec result:\n', result);
    this.logger.info('表字段:', op.tableName, ' : ', op.field.name, ' 创建结束.');
    return true;
  }

  private async execAdjustFieldSize(op: AdjustFieldSizeOption): Promise<boolean> {
    return true;
  }
  private getCheckTableExistSQL(tableName: string): string {
    const _tableName = this.db.escape(tableName);
    const _dbName = this.db.escape(this.dbName);
    return `
    SELECT COUNT(1) as isExist FROM information_schema.tables 
    WHERE table_schema=${_dbName} AND 
    table_name = ${_tableName}`;
  }
  private getCheckTableFieldExistForNameSQL(tableName: string, fieldName: string): string {
    const _tableName = this.db.escape(tableName);
    const _dbName = this.db.escape(this.dbName);
    const _fieldName = this.db.escape(fieldName);

    return `
    SELECT COUNT(1) as isExist FROM information_schema.columns 
    WHERE table_schema=${_dbName} AND 
    table_name = ${_tableName} AND
    column_name = ${_fieldName}`;
  }
  private getQueryTableFieldSchemaSQL(tableName: string, fieldName: string): string {
    const _tableName = this.db.escape(tableName);
    const _dbName = this.db.escape(this.dbName);
    const _fieldName = this.db.escape(fieldName);

    return `
    SELECT * FROM information_schema.columns 
    WHERE table_schema=${_dbName} AND 
    table_name = ${_tableName} AND
    column_name = ${_fieldName}`;
  }

  private getFieldDefineSQL(field: FieldDefine): string {
    let result = '';
    let typeText = '';
    const isDefLength = (field.length !== undefined && field.length !== null);
    const isDefDecimals = (field.decimals !== undefined && field.decimals !== null);
    const notNull = field.notNull || field.primaryKey || false;
    const nullText = notNull ? 'NOT NULL' : 'NULL';

    let defaultValueText = '';
    const isDefDefaultValue = (field.defaultValue !== undefined && field.defaultValue !== null);

    const notAutoDefDefaultValue =
      field.notAutoDefDefaultValue || false;

    let _defaultValueText = '';

    switch (field.type) {
      case FieldType.CHAR:
        if (isDefLength) {
          typeText = `CHAR(${field.length})`;
        } else {
          typeText = `CHAR(255)`;
        }
        _defaultValueText = `''`;
        break;
      case FieldType.VARCHAR:
        if (isDefLength) {
          typeText = `VARCHAR(${field.length})`;
        } else {
          typeText = `VARCHAR(255)`;
        }
        _defaultValueText = `''`;
        break;
      case FieldType.INT:
        typeText = `INT`;
        _defaultValueText = `0`;
        break;
      case FieldType.BIGINT:
        typeText = `BIGINT`;
        _defaultValueText = `0`;
        break;
      case FieldType.FLOAT:
        // if (isDefLength && isDefDecimals) {
        //   typeText = `FLOAT(${field.length},${field.decimals})`;
        // } else {
        //   if (isDefLength) {
        //     typeText = `FLOAT(${field.length},2)`;
        //   } else if (isDefDecimals) {
        //     typeText = `FLOAT(15,${field.decimals})`;
        //   } else {
        //     typeText = `FLOAT`;
        //   }
        // }

        /** FLOAT 改为不可指定精度, 主要因为 修改字段时 判断跳过条件很麻烦
         *  FLOAT 字段 不提供 更改字段大小 的功能
         */

        typeText = `FLOAT`;
        _defaultValueText = `0`;
        break;
      case FieldType.DECIMAL:
        if (isDefLength && isDefDecimals) {
          typeText = `DECIMAL(${field.length},${field.decimals})`;
        } else {
          if (isDefLength) {
            typeText = `DECIMAL(${field.length},2)`;
          } else if (isDefDecimals) {
            typeText = `DECIMAL(15,${field.decimals})`;
          } else {
            typeText = `DECIMAL(15,2)`;
          }
        }
        _defaultValueText = `0`;
        break;
      case FieldType.BOOLEAN:
        typeText = `TINYINT(1)`;
        _defaultValueText = `0`;
        break;
      case FieldType.TEXT:
        typeText = `TEXT`;
        break;
      case FieldType.DATETIME:
        typeText = `DATETIME`;
        break;
      case FieldType.DATEONLY:
        typeText = `DATE`;
        break;
      default:
        typeText = `VARCHAR(255)`;
        _defaultValueText = `''`;
        break;
    }

    if (isDefDefaultValue) {
      defaultValueText = `DEFAULT ${field.defaultValue}`;
    } else {
      // 禁止自动处理 DEFAULT
      if (notAutoDefDefaultValue || field.autoIncrement) {
        defaultValueText = '';
      } else {
        if (_defaultValueText) {
          defaultValueText = `DEFAULT ${_defaultValueText}`;
        }
      }
    }

    const autoIncrementText = field.autoIncrement ? 'AUTO_INCREMENT' : '';
    const primaryKeyText = field.primaryKey ? 'PRIMARY KEY' : '';
    const commentText = field.comment ? `COMMENT ${this.db.escape(field.comment)}` : '';

    result =
      // tslint:disable-next-line:max-line-length
      `${this.db.escapeId(field.name)} ${typeText} ${nullText} ${defaultValueText} ${autoIncrementText} ${primaryKeyText} ${commentText}`;

    return result;
  }
  private isInFields(fieldName: string, fields: FieldDefine[]): boolean {
    let result = false;
    const field = fields.find((item) => item.name === fieldName)
    result = !!field;
    return result;
  }
  private insertIdFieldToFields(fields: FieldDefine[]): FieldDefine[] {
    const idField: FieldDefine = {
      name: 'id',
      type: FieldType.INT,
      primaryKey: true,
      autoIncrement: true,
    };
    return [idField, ...fields];
  }
  private appendCreatedAtFieldToFields(fields: FieldDefine[]): FieldDefine[] {
    const createdAtField: FieldDefine = {
      name: 'createdAt',
      type: FieldType.DATETIME,
    };
    return [...fields, createdAtField];
  }
  private appendUpdatedAtFieldToFields(fields: FieldDefine[]): FieldDefine[] {
    const updatedAtField: FieldDefine = {
      name: 'updatedAt',
      type: FieldType.DATETIME,
    };
    return [...fields, updatedAtField];
  }
}

const dbStructSync = new DbStructSync();

export { dbStructSync };

/*
select * from INFORMATION_SCHEMA.columns where COLUMN_NAME Like '%placement%';

 SELECT  COLUMN_NAME as '列名' ,DATA_TYPE as '字段类型' ,COLUMN_TYPE as '长度加类型' FROM information_schema.`COLUMNS` where TABLE_SCHEMA like 'MONITOR' and TABLE_NAME like 'liudi';
// tslint:disable-next-line:eofline

-- ----------------------------
-- 判断 vrv_paw_rule 表是否存在 thresholdMin 字段，不存在则添加; 存在则修改字段类型
DELIMITER ??
DROP PROCEDURE IF EXISTS schema_change??
CREATE PROCEDURE schema_change()
BEGIN
IF NOT EXISTS (SELECT * FROM information_schema.columns WHERE table_schema = DATABASE()  AND table_name = 'vrv_paw_rule' AND column_name = 'thresholdMin') THEN
    ALTER TABLE vrv_paw_rule ADD COLUMN thresholdMin  BIGINT;
ELSE
    ALTER TABLE vrv_paw_rule MODIFY COLUMN thresholdMin BIGINT ;
END IF;
END??
DELIMITER ;

CALL schema_change();


    SELECT COUNT(1) as isExist FROM information_schema.columns
    WHERE table_schema='apiserver_seed_dev' AND
    table_name = 'sync_demo_table1' AND
    column_name = 'addFieldVarchar'
*/

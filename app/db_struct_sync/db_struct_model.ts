
export interface SyncJob {
  jobType: JobType;
  // jobOption: JobOption;
  jobOption: CreateTableOption | AddFieldOption | AdjustFieldSizeOption | 
  AdjustFieldTypeOption | ChangeFieldNameOption;

};

export enum JobType {
  createTable,
  addField,
  adjustFieldSize,
  adjustFieldType,
  changeFieldName,
}

export interface JobOption {
  tableName: string;
}

export interface CreateTableOption extends JobOption {
  fields: FieldDefine[];
  tableComment?: string;
}
export interface AddFieldOption extends JobOption {
  field: FieldDefine;
}
export interface AdjustFieldSizeOption extends JobOption {
  fieldName: string;
  fieldtype: FieldType;
  newFieldDef: FieldDefine;
}
export interface AdjustFieldTypeOption extends JobOption {
  fieldName: string;
  oldFieldtype: FieldType;
  newFieldDef: FieldDefine;
}
export interface ChangeFieldNameOption extends JobOption {
  oldFieldName: string;
  newFieldName: string;

}
/**
 * 字段属性定义
 * 
 * @export
 * @interface FieldDefine
 */
export interface FieldDefine {
  /**
   * 字段名
   * 
   * @type {string}
   * @memberof FieldDefine
   */
  name?: string;
  type?: FieldType;
  /**
   * 字符字段大小, 默认 255 ; 
   * DECIMAL 字段精度,默认 15
   * 
   * @type {number}
   * @memberof FieldDefine
   */
  length?: number;
  /**
   * DECIMAL 字段小数位数,默认 2
   * 
   * @type {number}
   * @memberof FieldDefine
   */
  decimals?: number;
  /**
   * 不为空
   * 
   * @type {boolean}
   * @memberof FieldDefine
   */
  notNull?: boolean;
  defaultValue?: string;
  /**
   * 字段注释
   * 
   * @type {string}
   * @memberof FieldDefine
   */
  comment?: string;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  /**
   * 不自动生成 defaultValue ,
   * 数值/boolean/字段会自动生成 0
   * 字符字段 会自动生成 ''
   * @type {boolean}
   * @memberof FieldDefine
   */
  notAutoDefDefaultValue?: boolean;
  /**
   * 不要自动包括 NULL 或 NOT NULL , 用于调整字段时,不要更改原来的 NULL 设置
   */
  notAutoIncludeNullDef?: boolean;
}


export enum FieldType {
  CHAR,
  VARCHAR,
  INT,
  BIGINT,
  FLOAT,
  DECIMAL,
  BOOLEAN,
  TEXT,
  DATETIME,
  DATEONLY,
}
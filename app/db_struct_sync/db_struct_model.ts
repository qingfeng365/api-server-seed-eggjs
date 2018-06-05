
export interface SyncJob {
  jobType: JobType;
  // jobOption: JobOption;
  jobOption: CreateTableOption | AddFieldOption | AdjustFieldSizeOption |
  AdjustFieldTypeOption | ChangeFieldNameOption | CreateIndexOption;

};

export enum JobType {
  createTable,
  addField,
  adjustFieldSize,
  adjustFieldType,
  changeFieldName,
  createIndex,
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

export interface CreateIndexOption extends JobOption {
  /** 索引名建议格式:
   * index_<字段名1>_<字段名...> ;
   * index_unique_<字段名1>_<字段名...> ;
   */
  indexName: string;
  /** 是唯一索引 */
  isUnique?: boolean;
  /** 索引字段定义列表 */
  fields: IndexFieldDefine[];
}

/**
 * 索引字段属性定义
 *
 * @export
 * @interface IndexFieldDefine
 */
export interface IndexFieldDefine {
  /** 索引字段名 */
  fieldName: string;
  /**  创建索引时，使用col_name(length)语法，对前缀编制索引;
   * 对于CHAR和VARCHAR列，只用一列的一部分就可创建索引 ;
   * BLOB和TEXT列也可以编制索引，但是必须给出前缀长度 ;
   * 使用列的一部分创建索引可以使索引文件大大减小，从而节省了大量的磁盘空间，
   * 有可能提高INSERT操作的速度
   */
  length?: number;

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
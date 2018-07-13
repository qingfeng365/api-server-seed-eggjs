# Changelog 更新日志

### 2018-07-13

- 缓存工具命名改为 RedisCacheTool, 原名拼错单词
- RedisCacheGroup set get 增加 对 json 对象的支持

### 2018-06-12

- validator 增加 queryBoolean queryInt 验证规则 
  - 原因: validator 对 query 非字符型支持不太好, 因为 query 参数全部为字符型
  - queryBoolean 可用参数: required, 有效值: 1 0 true false
  - queryInt 可用参数: required max min
- 用法示例

```ts
    const { ctx } = this;
    const paramRule = {
      testboolean: {
        type: 'queryBoolean',
        required: true,
      },
      testint: {
        type: 'queryInt',
        required: false,
        max: 100,
        min: 1,
      }
    };
    (ctx as any).validate(paramRule, ctx.request.query); 
```

- 增加工具函数 toBoolean
  - 将 '1' 1 '0' 0 false 'false' true 'true' 转换成 Boolean
  - 用法示例

```ts
import { toBoolean } from '../../util/toBoolean';

// ...
const testboolean: boolean = toBoolean(ctx.request.query.testboolean);
```
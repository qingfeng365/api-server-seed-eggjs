# 项目基本说明

## 项目用途

用来作为纯 api 服务端, 也可做为门户网站的后端

该项目是种子项目, 在新建项目时, 用来参考

##　项目创建

本项目是基于　eggjs 创建

使用 egg-init 工具生成并运行

### 全局安装 egg-init


```
npm i egg-init -g --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist --sass-binary-site=http://npm.taobao.org/mirrors/node-sass


```


### 生成基于 TypeScript 的项目

```
npx egg-init --type=ts <项目名>


```

如:
`npx egg-init --type=ts api-server-seed-eggjs`

>　npx　是　npm 中的命令, 新版 npm 才有, 表示要运行 二进制文件
>　

创建项目后, 可用 npm 安装

```
npm install --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist --sass-binary-site=http://npm.taobao.org/mirrors/node-sass


```



# egg-init 创建项目时的说明

# hackernews-async-ts

[Hacker News](https://news.ycombinator.com/) showcase using typescript && egg

## QuickStart

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### Deploy

```bash
$ npm run tsc
$ npm start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.x
- Typescript 2.8+

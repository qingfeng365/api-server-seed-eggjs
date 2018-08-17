module.exports = {

  /**
   * 返回错误:用户不存在
   * @param userFieldName 用户字段名称,默认为 user
   */
  throwByUserNotFound(userFieldName?: string) {
    this.throw(401, '身份验证错误', {
      code: 'unauthorized',
      errors: [{
        message: '用户不存在',
        field: userFieldName || 'user',
        code: 'user_not_found',
      }],
    });
  },

  /**
   * 返回错误:密码不正确
   * @param passwordFieldName 密码字段名称,默认为 password
   */
  throwByPasswordInvalid(passwordFieldName?: string) {
    this.throw(401, '身份验证错误', {
      code: 'unauthorized',
      errors: [{
        message: '密码不正确',
        field: passwordFieldName || 'password',
        code: 'invalid_password',
      }],
    });
  },

  throwByTokenMissing(tokenFieldName?: string) {
    this.throw(401, '身份验证错误', {
      code: 'unauthorized',
      errors: [{
        message: '没有提供 token ',
        field: tokenFieldName || 'token',
        code: 'missing_token',
      }],
    });
  },
};

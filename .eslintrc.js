// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    // 原有
    browser: true,
    // 添加
    jquery: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 函数名与括号之间，不加空格
    'space-before-function-paren': 0,
    // 强制加分号
    'semi': ['error', 'always'],
    // 'semi': 0,
    // 忽略缩进,因为很多编辑器会自带缩进
    'indent': 0,
    // 允许多行空格
    'no-multiple-empty-lines': 0,
    // 允许多余的括号
    'no-extra-parens': 0
  }
}

/* eslint-disable no-unused-vars*/
/* eslint-disable no-new*/

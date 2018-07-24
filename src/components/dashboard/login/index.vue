<template>
  <div class="login-container">
    <div class="title">
      gsp音乐
    </div>
    <div class="container">
      <div class="input-container">
        <div class="input">
          <input type="text" placeholder="请输入用户名" v-model="username">
        </div>
      </div>
      <div class="input-container">
        <div class="input">
          <input type="password" placeholder="请输入密码" v-model="password">
        </div>
      </div>
      <div class="input login-button" @click="login">
        登录
      </div>
      <el-button type="primary" icon="el-icon-edit"></el-button>
      <middle-tip ref="middleTip" :textTitle="tipTitle" :textContent="tipContent"></middle-tip>
      <div class="loading-container" v-show="loadingShow">
        <loading :title="'拼命加载中...'"></loading>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import MiddleTip from '@VBase/middle-tip';
import Loading from '@VBase/loading';
import { loginMixin } from '@js/mixin';
export default {
  name: 'Login',
  mixins: [loginMixin],
  components: {
    MiddleTip,
    Loading
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/mixin.scss';

.login-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .loading-container {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10000;
    background-color: rgba(0, 0, 0, 0.8);
  }
  .title {
    margin: 70px auto 20px;
    font-size: 20px;
    color: #ffcd32;
    text-align: center;
    line-height: 40px;
    letter-spacing: 4px;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 50px;
    .input-container {
      width: 100%;
      height: 50px;
      display: flex;
      margin-bottom: 30px;
      .input {
        flex: 1;
        height: 50px;
        box-sizing: border-box;
        border: 1px solid #fff;
        border-radius: 25px;
        input {
          text-align: center;
          width: 100%;
          height: 100%;
          background-color: transparent;
          box-sizing: border-box;
          border: none;
          outline: none;
          border-radius: 25px;
          color: #ffcd32;
          font-size: 14px;
        }
      }
    }
    .login-button {
      margin-top: 30px;
      letter-spacing: 4px;
      line-height: 50px;
      text-align: center;
      border-radius: 25px;
      color: #fff;
      font-size: 14px;
      background-color: #ffcd32;
      width: 100%;
      height: 50px;
    }
  }
}
</style>

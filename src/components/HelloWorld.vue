/*
 * @Author: John.Guan
 * @Date: 2018-06-06 15:37:28
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-06-06 17:20:36
 */
<template>
  <div class="hello">
    <h1 class="one">{{ msg }}</h1>
    <h1 class="two" @click="doSomeThing">{{ msg }}</h1>
    <input type="text" v-model.trim="inputV">
    {{inputV}}
    <p v-text="inputV" :class="obj1.name" v-if="!myBol()"></p>
    <p v-html="inputV"></p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: '红色',
      obj: {
        name: 'sex'
      },
      obj1: {
        one: true,
        two: false,
        name: 'one'
      },
      inputV: '222'
    };
  },
  methods: {
    doSomeThing() {
      // console.log(11)
      this.doWhat();
      this.msg += '11';
      this.obj.name += '11';
      console.log(this.$data);
      var watch = this.$watch(
        function() {
          return this.msg;
        },
        function(newValue) {
          console.log('newValue:', newValue);
        },
        {
          immediate: true,
          deep: true
        }
      );

      watch();
    },

    doWhat() {},

    myBol() {
      return true;
    }
  },
  watch: {
    msg(oldValue, newValue) {
      // console.log('gengxinle')
    },

    obj: {
      handler: function(newValue, oldValue) {
        console.log(newValue);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped rel="stylesheet/scss" lang="scss">
.hello {
  .one {
    color: red;
  }

  .two {
    color: green;
  }
}
</style>

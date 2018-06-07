<template>
  <div>
    {{seller.name}}
  </div>
</template>

<script type='text/ecmascript-6'>
export default {
  name: 'GoodsComponent',
  props: {
    seller: {
      type: Object,
      default() {
        return {
          name: '111'
        };
      }
    }
  },
  data() {
    return {};
  },
  beforeCreate() {
    console.log('beforeCreate');
    console.log(process.env.NODE_ENV); //development
  },
  created() {
    console.log('created');
  },
  beforeMount() {
    console.log('beforeMount');
  },
  mounted() {
    console.log('mounted');
  },
  beforeUpdate() {
    console.log('beforeUpdate');
  },
  activated() {
    console.log('activated');
  },
  deactivated() {
    console.log('deactivated');
  },
  errorCaptured() {
    console.log('errorCaptured');
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
</style>

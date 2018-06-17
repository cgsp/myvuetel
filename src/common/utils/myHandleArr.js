// 返回0与100之间，的任意的整数，同时可以包括0或者100
const myGetRandomInt = (min, max) => {
  const temp = Math.random() * (max - min + 1) + min;
  return Math.floor(temp);
};

// 洗牌函数--即使是对象型的数组，也能改变
const myShuffle = (arr) => {
  // 为了避免对原来的数组产生副作用
  let _arr = arr.slice();

  for (let i = 0; i < _arr.length; i++) {
    let j = myGetRandomInt(0, i);
    let temp = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = temp;
  }
  return _arr;
};

export { myGetRandomInt, myShuffle };

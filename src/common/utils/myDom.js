// 给某个dom元素添加class
function addClass(ele, className) {
  if (hasClass(ele, className)) {
    return;
  }

  let newClassName = ele.className.split(' ');
  newClassName.push(className);
  ele.className = newClassName.join(' ');
}

// 判断某个dom元素，是否有对应的class

function hasClass(ele, className) {
  // 以这个className开头，或者，以空格开头+这个className
  // 以这个className结尾，或者，className+空格结尾
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(ele.className);
}

// 自定义属性的增删改查
function handleMyDataAttr(ele, name, val) {
  const prefix = 'data-';
  name = prefix + name;
  if (val) {
    return ele.setAttribute(name, val);
  } else {
    return ele.getAttribute(name);
  }
}

export { addClass, hasClass, handleMyDataAttr };

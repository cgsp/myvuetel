function addClass(ele, className) {
  if (hasClass(ele, className)) {
    return;
  }

  let newClassName = ele.className.split(' ');
  newClassName.push(className);
  ele.className = newClassName.join(' ');
}

function hasClass(ele, className) {
  // 以这个className开头，或者，以空格开头+这个className
  // 以这个className结尾，或者，className+空格结尾
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(ele.className);
}

export { addClass, hasClass };

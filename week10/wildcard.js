function find(source, pattern) {
  let startCount = 0;
  // 计算*号个数
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "*") {
      startCount++;
    }
  }
  // 如果没有*号
  if (startCount === 0) {
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== source[i] && pattern[i] != "?") {
        return false;
      }
    }
    return;
  }

  // 如果有星号
  let i = 0;
  let lastIndex = 0;
  for (i = 0; pattern[i] !== "*"; i++) {
    if (pattern[i] !== source[i] && pattern[i] !== "?") {
      return false;
    }
  }

  lastIndex = i;

  // 处理pattern被星号分隔出来的字符串，除去开头个结尾，一共有(startCount-1)个字符串
  for (let p = 0; p < startCount - 1; p++) {
    i++;
    let subPattern = "";
    
    while (pattern[i] !== "*") {
      // 把每一段pattern取出来赋值给subPattern
      subPattern += pattern[i];
      i++;
    }
    // --?匹配前一个字符零或一次
    // \s 匹配空白字符，\S 匹配任一非空白字符，\s\S匹配所有
    let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g");
    reg.lastIndex = lastIndex;

    console.log(reg.exec(source));
    if (!reg.exec(source)) {
      return false;
    }
    lastIndex = reg.lastIndex;
  }

  for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {
    if (pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - j] !== "?") {
      return false;
    }
  }
  return true;

}

console.log(find("ababcabdcc", "ab*c*ab?c"))
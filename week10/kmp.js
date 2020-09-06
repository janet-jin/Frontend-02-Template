function kmp(source, pattern) {
  let table = new Array(pattern.length).fill(0); 
  {
    // 循环模式串
    //  i--模式串的长度
    // j--记录有重复的字符串的位置
    // table--其实是next数组，数组的下标代表了“已匹配前缀的下一个位置”，元素的值则是“最长可匹配前缀子串的下一个位置”。
    let i = 1,j = 0;
    while (i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        ++i, ++j;
        table[i] = j;
      } else {
        // 关键的一步，如果不相等，并且j>0.即有重复的字符串，使j回到‘最长可匹配前缀子串的下一个位置’
        if (j > 0) {
          j = table[j];
        } else {
          ++i;
        }
      }
    }
  }
  {
    // 匹配
    let i = 0,j = 0;
    while (i < source.length) {
      if (pattern[j] === source[i]) {
        ++i, ++j;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          ++i;
        }
      }
      // 如果j等于模式串的长度，说明已比对完毕
      if(j === pattern.length){
        return true;
      }
    }
    return false;
  }
}

console.log(kmp("hello","ll"))


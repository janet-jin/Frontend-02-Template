let $ = Symbol("$");
class Trie {
  constructor(){
    this.root = Object.create(null);
  }
  insert(word){
    let node = this.root;
    for(let c of word){
      if(!node[c]){
        node[c] = Object.create(null);
      }
      node = node[c]
    }
    if(!($ in node)){
      node[$] = 0
    }
    node[$] ++
  }
  most(){
    let max = 0;
    let maxWord = null;
    let visit = (node,word) =>{
      if(node[$] && node[$] > max){
        max = node[$];
        maxWord = word
      }
      for(let p in node){
        visit(node[p],word + p)
      }
    }
    visit(this.root,"");
    console.log(maxWord)
  }
}

// fromCharCode---将 Unicode 编码转为一个字符
// charCodeAt---返回指定位置的字符的 Unicode 编码
// "a".charCodeAt(0) === 97
// randomWord()---随机出指定长度的小写字母字符串
function randomWord(length){
  var s = "";
  for(let i = 0; i < length ;i++){
    // 随机出一位小写字母
    s += String.fromCharCode(Math.random() * 26 + "a".charCodeAt(0));
  }
  return s;
}

let trie = new Trie();

for(let i = 0 ; i < 2; i++){
  trie.insert(randomWord(4));
}
console.log(trie)
// trie.most()
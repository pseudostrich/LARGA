(function(){
 const values=new Map();
 Object.defineProperty(window,'localStorage',{value:{
  getItem:key=>values.get(String(key))??null,
  setItem:(key,value)=>values.set(String(key),String(value)),
  removeItem:key=>values.delete(String(key)),
  clear:()=>values.clear()
 }});
})();

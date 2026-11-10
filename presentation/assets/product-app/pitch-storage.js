(function(){
 const data=new Map();
 const storage={getItem:k=>data.get(String(k))??null,setItem:(k,v)=>data.set(String(k),String(v)),removeItem:k=>data.delete(String(k)),clear:()=>data.clear()};
 Object.defineProperty(window,'localStorage',{value:storage});
})();

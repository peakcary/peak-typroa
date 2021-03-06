## 一、关于取值的吐槽

取值在程序中非常常见，比如从对象`obj`中取值。

```
const obj = {
    a:1,
    b:2,
    c:3,
    d:4,
    e:5,
}

```

**改进**：

```
const {a,b,c,d,e} = obj;
const f = a + d;
const g = c + e;

```

如果想创建的变量名和对象的属性名不一致，可以这么写：

```
const {a:a1} = obj;
console.log(a1);// 1

```

**补充**

ES6的解构赋值虽然好用。但是要注意解构的对象不能为`undefined`、`null`。否则会报错，故要给被解构的对象一个默认值。

```
const {a,b,c,d,e} = obj || {};

```

## 二、关于合并数据的吐槽

比如合并两个数组，合并两个对象。

```
const a = [1,2,3];
const b = [1,5,6];
const c = a.concat(b);//[1,2,3,1,5,6]

const obj1 = {
  a:1,
}
const obj1 = {
  b:1,
}
const obj = Object.assgin({}, obj1, obj2);//{a:1,b:1}

```

**改进**

```
const a = [1,2,3];
const b = [1,5,6];
const c = [...new Set([...a,...b])];//[1,2,3,5,6]

const obj1 = {
  a:1,
}
const obj2 = {
  b:1,
}
const obj = {...obj1,...obj2};//{a:1,b:1}

```

## 三、关于拼接字符串的吐槽

```
const name = '小明';
const score = 59;
const result = '';
if(score > 60){
  result = `${name}的考试成绩及格`; 
}else{
  result = `${name}的考试成绩不及格`; 
}

```

在`${}`中可以放入任意的JavaScript表达式，可以进行运算，以及引用对象属性。

**改进**

```
const name = '小明';
const score = 59;
const result = `${name}${score > 60?'的考试成绩及格':'的考试成绩不及格'}`;

```

## 四、关于if中判断条件的吐槽

```
if(
    type == 1 ||
    type == 2 ||
    type == 3 ||
    type == 4 ||
){
   //...
}

```

**改进**

```
const condition = [1,2,3,4];

if( condition.includes(type) ){
   //...
}

```

## 五、关于列表搜索的吐槽

在项目中，一些没分页的列表的搜索功能由前端来实现，搜索一般分为精确搜索和模糊搜索。搜索也要叫过滤，一般用`filter`来实现。

```
const a = [1,2,3,4,5];
const result = a.filter( 
  item =>{
    return item === 3
  }
)

```

**吐槽**

`find`方法中找到符合条件的项，就不会继续遍历数组。

**改进**

```
const a = [1,2,3,4,5];
const result = a.find( 
  item =>{
    return item === 3
  }
)

```

## 六、关于获取对象属性值的吐槽

```
const name = obj && obj.name;

```

**改进**

```
const name = obj?.name;

```

## 七、关于添加对象属性的吐槽

当给对象添加属性时，如果属性名是动态变化的，该怎么处理。

```
let obj = {};
let index = 1;
let key = `topic${index}`;
obj[key] = '话题内容';

```

**改进**

```
let obj = {};
let index = 1;
obj[`topic${index}`] = '话题内容';

```

## 八、关于输入框非空的判断

在处理输入框相关业务时，往往会判断输入框未输入值的场景。

```
if(value !== null && value !== undefined && value !== ''){
    //...
}

```

**改进**

```
if(value??'' !== ''){
  //...
}

```

## 九、关于异步函数的吐槽

异步函数很常见，经常是用 Promise 来实现。

```
const fn1 = () =>{
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 300);
  });
}
const fn2 = () =>{
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(2);
    }, 600);
  });
}
const fn = () =>{
   fn1().then(res1 =>{
      console.log(res1);// 1
      fn2().then(res2 =>{
        console.log(res2)
      })
   })
}

```

**改进**

```
const fn = async () =>{
  const res1 = await fn1();
  const res2 = await fn2();
  console.log(res1);// 1
  console.log(res2);// 2
}

```

**补充**

但是要做并发请求时，还是要用到`Promise.all()`。

```
const fn = () =>{
   Promise.all([fn1(),fn2()]).then(res =>{
       console.log(res);// [1,2]
   }) 
}

```

如果并发请求时，只要其中一个异步函数处理完成，就返回结果，要用到`Promise.race()`。

 
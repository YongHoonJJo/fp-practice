const _ = Symbol("parameter");
const ___ = Symbol("rest parameters");

const reduce = function _reduce(f, acc, iter) {
  if(!iter) {
    iter = acc[Symbol.iterator]()
    acc = iter.next().value
    return _reduce(f, acc, iter)
  }
  for(const a of iter)
    acc = f(acc, a)
  return acc
};

const map = (f, iter) => reduce((acc, item) => (acc.push(f(item)), acc), [], iter)

const filter = (f, iter) => reduce((acc, item) => (f(item) && acc.push(item), acc), [], iter)

// keyF 에는 prop(key) 가 전달되는데, 
// prop(key) 가 리턴하는  함수는 객체를 전달받아 그 객체의 key 에 해당하는 value 를 리턴
// 즉, keyF(item) 은 item 객체의 이미 전달받은 키값에 대한 value 를 리턴한다.
// _baseBy(f) 는 keyF 와 iter 를 받아 f(acc, item, keyF(item)) 의 결과를 누적시킨고 결과는 { ... } 이다.
const _baseBy = f => (keyF, iter) => reduce((acc, item) => f(acc, item, keyF(item)), {}, iter)

// groupBy 는 _baseBy(f) 를 실행시킨 결과 리턴하며, 그 결과는 함수이다. 
// 여기서 f 는 acc, newItem, newKey 값을 전달 받아,
// { [key1]: [item1, item2, ...], [key2]: [item1, item2, ...]} 의 형태의 결과를 리턴하는 함수이다. 
// 여기서 인자로 받는 key 는 실제로는 어떤 key 값에 대한 value 가 들어 오는데, 그 value 가 여기에서의 key 값이 된다.
const groupBy = _baseBy((acc, item, key) => Object.assign(acc, {
  [key]: (acc[key] || []).concat(item) // 누적되는 결과의 모양
}))

const countBy = _baseBy((acc, item, key) => Object.assign(acc, {
  [key]: (acc[key] || 0) + 1 // 누적되는 결과의 모양
}))

const indexBy = _baseBy((acc, item, key) => Object.assign(acc, {
  [key]: item // 누적되는 결과의 모양
}))

const pipe = (f1, ...fns) =>
  (...args) => reduce((acc, f) => f(acc), f1(...args), fns);

const go = (a, ...fns) => pipe(...fns)(a);
// const go = (...args) => reduce((acc, f) => f(acc), args);

const curry = function(f, len = f.length - 1) {
  return function _recur(...args1) {
    if (args1.length > len) return f(...args1);
    return (...args2) => _recur(...args1, ...args2);
  };
};

const reverseIter = function* (iter) {
  const arr = [...iter];
  for (let i = arr.length - 1; i >= 0; i--) yield arr[i];
};

// 원리는 동일. reverseIter 를 만들어서 활용한 점이 인상깊다. 
const partial = function(f, ...args1) {
  return function (...args2) {
    const left = [], right = [];
    const args1Iter = args1[Symbol.iterator]();
    const args2Iter = args2[Symbol.iterator]();
    for (const arg of args1Iter) {
      if (arg === ___) break;
      left.push(arg === _ ? args2Iter.next().value : arg);
    }
    const args2RverseIter = reverseIter(args2Iter);
    for (const arg of reverseIter(args1Iter)) {
      right.unshift(arg === _ ? args2RverseIter.next().value : arg);
    }
    return f(...left, ...reverseIter(args2RverseIter), ...right);
  }
};


export {
  reduce,
  map,
  filter,
  groupBy,
  countBy,
  indexBy,
  pipe,
  go,
  curry,
  partial,
  _,
  ___,
}
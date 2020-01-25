const _ = Symbol("parameter");
const ___ = Symbol("rest parameters");

const reduce = curry(function (f, acc, iter) {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const item of iter) {
    acc = f(acc, item);
  }
  return acc;
}, 1);

// const map = curry((f, iter) => reduce((acc, item) => (acc.push(f(item)), acc), [], iter));

// const filter = curry((f, iter) => reduce((acc, item) => (f(item) && acc.push(item), acc), [], iter));

const _baseBy = f => curry((keyF, iter) =>
  reduce((acc, item) => f(acc, item, keyF(item)), {}, iter));

const groupBy = _baseBy((acc, item, key) => Object.assign(acc, {
  [key]: (acc[key] || []).concat(item)
}));

const countBy = _baseBy((acc, item, key) => Object.assign(acc, {
  [key]: (acc[key] || 0) + 1
}));

const indexBy = _baseBy((acc, item, key) => Object.assign(acc, {
  [key]: item
}));

const pipe = (f1, ...fns) =>
  (...args) => reduce((acc, f) => f(acc), f1(...args), fns);

const go = (a, ...fns) => pipe(...fns)(a);
// const go = (...args) => reduce((acc, f) => f(acc), args);

function curry(f, len = f.length - 1) {
  return function _recur(...args1) {
    if (args1.length > len) return f(...args1);
    return (...args2) => _recur(...args1, ...args2);
  };
};

const reverseIter = function* (iter) {
  const arr = [...iter];
  for (let i = arr.length - 1; i >= 0; i--) yield arr[i];
};

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

const takeWhile = curry(function (f, iter) {
  const list = []
  for(const a of iter) {
    if(!f(a)) break
    list.push(a)
  }
  return list
}, 1);

const take = curry(function(l, iter) {
  const list = []
  for(const a of iter) {
    if(l-- <= 0) break;
    list.push(a)
  }
  return list
}, 1);

const takeAll = take(Infinity) 

const L = {};

L.map = curry(function *(f, iter) {
  for(const a of iter)
    yield f(a)
}, 1);
const map = curry(pipe(L.map, takeAll), 1)

L.filter = curry(function *(f, iter) {
  for(const a of iter)
    if(f(a)) yield a
}, 1);
const filter = curry(pipe(L.filter, takeAll), 1)

L.range = function *(l) {
  for(let i=0; i<l; i++)
    yield i
};

const range = function(l) {
  return [...L.range(l)]
};

const find = curry(pipe(
  L.filter,
  take(1),
  ([a]) => a
), 1);

const isIterable = a => a && a[Symbol.iterator]
const isString = a => typeof a === 'string'

L.flat = function *(iter) {
  for(const a of iter) {
    !isString(a) && isIterable(a) ? yield *a : yield a;
  }
};

const flat = iter => [...L.flat(iter)]

L.deepFlat = function *f(iter) {
  for(const a of iter)
    !isString(a) && isIterable(a) ? yield *f(a) : yield a;
};

const deepFlat = iter => [...L.deepFlat(iter)]

L.flatMap = curry(pipe(
  L.map,
  L.flat
), 1)

// const flatMap = curry(pipe(
//   L.map,
//   L.flat,
//   takeAll
// ), 1)
const flatMap = curry((f, iter) => [...L.flatMap(f, iter)], 1)


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
  take,
  takeWhile,
  takeAll,
  L,
  range,
  find,
  flat,
  deepFlat,
  flatMap
}
const _ = Symbol("parameter");
const ___ = Symbol("rest parameters");

const reduce = function(f, acc, iter) {
  if(!iter) {
    iter = acc[Symbol.iterator]()
    acc = iter.next().value
  }
  for(const a of iter)
    acc = f(acc, a)
  return acc
};

const map = function(f, iter) {
  const list = []
  for(const a of iter)
    list.push(f(a))
  return list
};

const filter = function(f, iter) {
  const list = []
  for(const a of iter)
    if(f(a)) list.push(a)
  return list
};

const groupBy = function(f, iter) {
  const obj = {}
  for(const a of iter) {
    if(!obj[f(a)]) obj[f(a)] = []
    obj[f(a)].push(a)
  }
  return obj
};

const countBy = function(f, iter) {
  const obj = {}
  for(const a of iter) {
    if(!obj[f(a)]) obj[f(a)] = 0
    obj[f(a)]++
  }
  return obj
};

const indexBy = function(f, iter) {
  const obj = {}
  for(const a of iter)
    obj[f(a)] = a
  return obj
};

const pipe = (f, ...fs) => (...as) => reduce((acc, f) => f(acc), f(...as), fs)

const go = (a, ...fs) => pipe(...fs)(a)

const curry = (f, l = f.length-1) => {
  return function recur(a, ...as) {
    return l - as.length > 0 ? (..._) => recur(a, ...as, ..._) : f(a, ...as)
  }
}

const partial = (f, ...as) => {
  return function (...as1) {
    let i=0, restIdx = -1
    while(i < as.length) {
      if(as[i] === ___) {
        restIdx = i
        break
      }
      i++
    }
    const a1 = []
    for(i=0; i<restIdx; i++) {
      a1.push((as[i] === _) ? as1.shift() : as[i])
    }
    const a2 = []
    for(i=as.length-1; i>restIdx; i--) {
      a2.unshift((as[i] === _) ? as1.pop() : as[i])
    }
    
    return f(...a1, ...as1, ...a2)
  }
}

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
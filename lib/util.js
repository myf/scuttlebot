var isDomain = require('is-valid-domain')
var rx = require('ip-regex')({exact: true})
var isIP = rx.test.bind(rx)

var ref = require('ssb-ref')

function isObject(o) {
  return o && 'object' === typeof o
}
var DEFAULT_PORT = 8008

var isArray = Array.isArray

var isInteger = Number.isInteger

function isString (s) {
  return 'string' === typeof s
}

var find = exports.find = function find(ary, test) {
  for(var i in ary)
    if(test(ary[i], i, ary)) return ary[i]
}

var clone = exports.clone = function clone (obj, mapper) {
  function map(v, k) {
    return isObject(v) ? clone(v, mapper) : mapper(v, k)
  }
  if(isArray(obj))
    return obj.map(map)
  else if(isObject(obj)) {
    var o = {}
    for(var k in obj)
      o[k] = map(obj[k], k)
    return o
  }
  else
    return map(obj)
}

var mergeKeys = exports.mergeKeys = function (a, b, iter) {
  var o = {}
  for(var k in a) {
    if(!isUndefined(a[k]))
      o[k] = iter(v[k], b[k], k)
  }
  for(var k in b) {
    if(isUndefined(a[a]))
      o[k] = iter(undefined, b[k], k)
  }
  return o
}

exports.merge = function (a, b) {

  //merge a and b objects

  if(isArray(a) != isArray(b))
    throw new Error('cannot merge array with non-array')
  if(isObject(a) != isObject(b))
    throw new Error('cannot merge object with non-object')

  a = clone(a)

  var keys

  if(isObject(b)) {
    for(var k in b)
      a[k] = b
  }
}

exports.parseAddress = function (e) {
  if(isString(e)) {
    var parts = e.split(':')
    var id = parts.pop(), port = parts.pop(), host = parts.join(':')
    var e = {
      host: host,
      port: +(port || DEFAULT_PORT),
      key: id
    }
    return e
  }
  return e
}

exports.isAddress = function (addr) {
  return (
    ref.isFeedId(addr.key || addr.link)
    && isInteger(addr.port)
    && (
      isIP(addr.host)
      || isDomain(addr.host)
      || addr.host === 'localhost'
    )
  )
}

exports.toAddress = function (e) {
  e = exports.parseAddress(e)
  e.port = e.port || DEFAULT_PORT
  e.host = e.host || 'localhost'
  return e
}

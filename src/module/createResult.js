const createResult = ({resource, callback, promise} = {}) => {
  return {
    resource,
    callback,
    promise,
    [Symbol.iterator]: function* () {
      yield this['resource']
      yield this['callback']
      yield this['promise']
    }
  }
}

export default createResult
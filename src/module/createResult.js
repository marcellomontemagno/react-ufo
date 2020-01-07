const createResult = ({resource, promise, callback} = {}) => {
  return {
    resource,
    promise,
    callback,
    [Symbol.iterator]: function* () {
      yield this['resource']
      yield this['promise']
      yield this['callback']
    }
  }
}

export default createResult
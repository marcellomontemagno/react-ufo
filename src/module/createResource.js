const createResource = ({loading, error, data, callback, promise}) => {
  return {
    loading,
    error,
    data,
    callback,
    promise,
    [Symbol.iterator]: function* () {
      yield this['loading']
      yield this['error']
      yield this['data']
      yield this['callback']
      yield this['promise']
    }
  }
}

export default createResource
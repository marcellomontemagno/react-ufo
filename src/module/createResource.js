const createResource = ({loading, error, data, callback}) => {
  return {
    loading,
    error,
    data,
    callback,
    [Symbol.iterator]: function* () {
      yield this['loading']
      yield this['error']
      yield this['data']
      yield this['callback']
    }
  }
}

export default createResource
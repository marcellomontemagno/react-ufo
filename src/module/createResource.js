const createResource = ({loading, error, data, promise}) => {
  return {
    loading,
    error,
    data,
    promise,
    [Symbol.iterator]: function* () {
      yield this['loading']
      yield this['error']
      yield this['data']
      yield this['promise']
    }
  }
}

export default createResource
const createResource = ({loading, error, data}) => {
  return {
    loading,
    error,
    data,
    [Symbol.iterator]: function* () {
      yield this['loading']
      yield this['error']
      yield this['data']
    }
  }
}

export default createResource
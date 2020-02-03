const createIterableResult = ({callback, requestState, setRequestState} = {}) => {
  return {
    callback,
    requestState,
    setRequestState,
    [Symbol.iterator]: function* () {
      yield this['callback']
      yield this['requestState']
      yield this['setRequestState']
    }
  }
}

export default createIterableResult
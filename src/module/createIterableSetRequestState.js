import createIterableRequestState from "./createIterableRequestState"

const createIterableSetRequestState = (setRequestState) => {
  const result = (valueOrFn) => delegateSetRequestState(valueOrFn)
  result.setLoading = (valueOrFn) => delegateSetRequestState(valueOrFn, 'loading')
  result.setError = (valueOrFn) => delegateSetRequestState(valueOrFn, 'error')
  result.setData = (valueOrFn) => delegateSetRequestState(valueOrFn, 'data')
  const delegateSetRequestState = (valueOrFn, key) => {
    return setRequestState((requestState) => {
      let requestStateOrValue = valueOrFn
      if (typeof valueOrFn === 'function') {
        requestStateOrValue = valueOrFn(key ? requestState[key] : requestState)
      }
      let newRequestState = {...requestState}
      if (key) {
        newRequestState[key] = requestStateOrValue
      } else {
        newRequestState = requestStateOrValue
      }
      return createIterableRequestState(newRequestState)
    })
  }
  result[Symbol.iterator] = function* () {
    yield result['setLoading']
    yield result['setError']
    yield result['setData']
  }
  return result
}

export default createIterableSetRequestState
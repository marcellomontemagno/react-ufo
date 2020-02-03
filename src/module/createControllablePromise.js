const createControllablePromise = () => {
  const result = {}
  result.promise = new Promise((rs, rj) => {
    result.resolve = rs
    result.reject = rj
  })
  return result
}

export default createControllablePromise
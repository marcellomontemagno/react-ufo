import {useState, useCallback} from 'react'

const defaultError = null
const defaultData = null

const useFetcher = (fetcher) => {

  //todo sometimes I still see the warning of set state on unmounted component

  //todo this default can be problematic (in cascading example user is null when loadingUser is false resulting in errors)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(defaultError)
  const [data, setData] = useState(defaultData)

  //todo handle `this`
  const fetch = useCallback(async (...args) => {
    setLoading(true)
    setData(defaultData)
    setError(defaultError)
    let data = defaultData
    try {
      data = await fetcher(...args)
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setError(error)
        setLoading(false)
      }
    }
    setData(data)
    setLoading(false)
  }, [fetcher])

  const result = {
    loading,
    error,
    data,
    fetch,
    [Symbol.iterator]: function* () {
      yield ['loading', result['loading']]
      yield ['error', result['error']]
      yield ['data', result['data']]
      yield ['fetch', result['fetch']]
    }
  }

  return result

}

export default useFetcher
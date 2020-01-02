import {useState, useCallback} from 'react'
import useSemanticMemo from "./useSemanticMemo"

const defaultError = null
const defaultData = null

const useFetchCallback = (fetcher, {defaultLoading = false} = {}) => {

  const [loading, setLoading] = useState(defaultLoading)
  const [error, setError] = useState(defaultError)
  const [data, setData] = useState(defaultData)

  const callback = useCallback(async (...args) => {
    setLoading(true)
    setData(defaultData)
    setError(defaultError)
    const abortController = getAbortController()
    callback.abort = () => {
      //tempting to move but needs to happen here to be in the same tick
      setLoading(false)
      setData(defaultData)
      setError(defaultError)
      abortController.abort()
    }
    try {
      const data = await fetcher(...args, abortController.signal)
      setData(data)
      setLoading(false)
    } catch (error) {
      const name = error?.name
      const cause = error?.cause
      if (name !== 'AbortError' && name !== 'Suspend') {
        setError(error)
        setLoading(false)
        setData(defaultData)
      }
      if (name === 'Suspend' && cause === 'error') {
        setData(defaultData)
        setLoading(false)
        setError('A parent resource failed to fetch')
      }
    }
  }, [fetcher])

  //prevents error if aborting before fetching
  if (!callback.abort) {
    callback.abort = () => {
      if (!window.AbortController) {
        warnAbortNotInEnv()
      }
    }
  }

  return useSemanticMemo(() => {
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
  }, [loading, error, data, callback])

}

const getAbortController = () => {
  let abortController
  if (window.AbortController) {
    abortController = new window.AbortController()
  } else {
    abortController = {abort: warnAbortNotInEnv}
  }
  return abortController
}

// eslint-disable-next-line no-console
const warnAbortNotInEnv = () => console.warn('react-ufo: you invocation of `.abort()` will do nothing because no `window.AbortController` was detected in your environment')

export default useFetchCallback
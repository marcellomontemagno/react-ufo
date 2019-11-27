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
      setData(defaultData)
      setLoading(false)
      abortController.abort()
    }
    try {
      const data = await fetcher(...args, abortController.signal)
      setData(data)
      setLoading(false)
    } catch (error) {
      const name = error?.name
      if (name !== 'AbortError' && name !== 'Suspend') {
        setData(defaultData)
        setLoading(false)
        setError(error)
      }
    }
  }, [fetcher])

  //prevents error if aborting before fetching
  if (!callback.abort) {
    callback.abort = () => {
    }
  }

  return useSemanticMemo(() => [loading, error, data, callback], [loading, error, data, callback])

}

const getAbortController = () => {
  let abortController
  if (window.AbortController) {
    abortController = new window.AbortController()
  } else {
    // eslint-disable-next-line no-console
    abortController = {abort: () => console.warn('react-ufo: you invocation of `.abort()` will do nothing because no `window.AbortController` was detected in your environment')}
  }
  return abortController
}

export default useFetchCallback
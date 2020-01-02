import {useState, useCallback} from 'react'
import createResource from "./createResource"

const useFetchCallback = (fetcher, {defaultLoading = false} = {}) => {

  const callback = useCallback(async (...args) => {
    setResult(createResource({loading: true, error: null, data: null, callback}))
    const abortController = getAbortController()
    callback.abort = () => {
      //tempting to move but needs to happen here to be in the same tick
      setResult(createResource({loading: false, error: null, data: null, callback}))
      abortController.abort()
    }
    try {
      const data = await fetcher(...args, abortController.signal)
      setResult(createResource({loading: false, error: null, data, callback}))
    } catch (error) {
      const name = error?.name
      const cause = error?.cause
      if (name !== 'AbortError' && name !== 'Suspend') {
        setResult(createResource({loading: false, error, data: null, callback}))
      }
      if (name === 'Suspend' && cause === 'error') {
        setResult(createResource({loading: false, error: 'A parent resource failed to fetch', data: null, callback}))
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

  const [result, setResult] = useState(createResource({loading: defaultLoading, error: null, data: null, callback}))

  // makes callback change on result if fetcher changes (useEffect in useFetchEffect has only callback as dependency)
  result.callback = callback

  return result

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
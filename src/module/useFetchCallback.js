import {useCallback, useState} from 'react'
import createResource from "./createResource"

const useFetchCallback = (fetcher, {defaultLoading = false} = {}) => {

  let abortController = createAbortController()

  let callback = async (...args) => {
    abortController = createAbortController()
    setResult((s) => createResource({...s, loading: true, error: null, data: null}))
    try {
      const data = await fetcher(...args, abortController.signal)
      setResult((s) => createResource({...s, loading: false, error: null, data}))
    } catch (error) {
      const name = error?.name
      const cause = error?.cause
      if (name !== 'AbortError' && name !== 'Suspend') {
        setResult((s) => createResource({...s, loading: false, error, data: null}))
      }
      if (name === 'Suspend' && cause === 'error') {
        setResult((s) => createResource({...s, loading: false, error: 'A parent resource failed to fetch', data: null}))
      }
    }
  }

  callback.abort = () => {
    setResult((s) => createResource({...s, loading: false, error: null, data: null}))
    abortController.abort()
  }

  callback = useCallback(callback, [fetcher])

  let [result, setResult] = useState(createResource({loading: defaultLoading, error: null, data: null, callback}))
  result.callback = callback

  return result

}

const createAbortController = () => {
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
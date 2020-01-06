import {useCallback, useRef, useState} from 'react'
import createResource from "./createResource"

const useFetchCallback = (fetcher, {defaultLoading = false} = {}) => {

  let abortController = createAbortController()
  let resolve
  let reject
  let promise = new Promise((rs, rj) => {
    resolve = rs
    reject = rj
  })

  let callback = async (...args) => {
    abortController = createAbortController()
    setResource((s) => createResource({...s, loading: true, error: null, data: null}))
    try {
      const data = await fetcher(...args, abortController.signal)
      setResource((s) => createResource({...s, loading: false, error: null, data}))
      resolve(data)
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setResource((s) => createResource({...s, loading: false, error, data: null}))
        reject(error)
      }
    }
  }

  callback.abort = () => {
    setResource((s) => createResource({...s, loading: false, error: null, data: null}))
    abortController.abort()
  }

  callback = useCallback(callback, [fetcher])

  let [resource, setResource] = useState(createResource({
    loading: defaultLoading,
    error: null,
    data: null,
    promise
  }))

  let result = useRef([]).current
  result[0] = resource
  result[1] = callback

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
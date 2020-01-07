import {useCallback, useRef, useState} from 'react'
import createResource from "./createResource"
import createResult from "./createResult"

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
    setRequestState({
      resource: createResource({loading: true, error: null, data: null}),
      promise
    })
    try {
      const data = await fetcher(...args, abortController.signal)
      setRequestState((s) => ({...s, resource: createResource({loading: false, error: null, data})}))
      resolve(data)
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setRequestState((s) => ({...s, resource: createResource({...s, loading: false, error, data: null})}))
        reject(error)
      }
    }
  }

  callback.abort = () => {
    setRequestState((s) => ({...s, resource: createResource({...s, loading: false, error: null, data: null})}))
    abortController.abort()
  }

  callback = useCallback(callback, [fetcher])

  let [requestState, setRequestState] = useState({
    resource: createResource({
      loading: defaultLoading,
      error: null,
      data: null
    }),
    promise
  })

  let result = useRef(createResult()).current
  result.resource = requestState.resource
  result.callback = callback
  result.promise = requestState.promise

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
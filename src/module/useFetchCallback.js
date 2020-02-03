import {useCallback, useEffect, useRef} from 'react'
import createIterableResult from "./createIterableResult"
import useRequestState from "./useRequestState"
import createControllablePromise from "./createControllablePromise"
import createAbortController from "./createAbortController"

const useFetchCallback = (fetcher, initialState = {}) => {

  let abortController = createAbortController()
  const [requestState, setRequestState] = useRequestState(initialState)

  let callback = (...args) => {
    abortController = createAbortController()
    const {promise, resolve, reject} = createControllablePromise()
    const {signal} = abortController
    setRequestState({loading: true, error: null, data: null})
    fetcher(...args, signal).then((data) => {
      resolve(data)
      //gives the ability to set some state before loading is changed (useful in pessimistic update example)
      promise.then(() => {
        if (!signal.aborted) {
          setRequestState({loading: false, error: null, data})
        }
      })
    }).catch((error) => {
      reject(error)
      if (error?.name !== 'AbortError') {
        setRequestState({loading: false, error, data: null})
      }
    })
    return promise
  }

  callback.abort = () => {
    setRequestState({loading: false, error: null, data: null})
    abortController.abort()
  }

  const memoCallback = useCallback(callback, [fetcher])

  useEffect(() => {
    return () => {
      memoCallback.abort()
    }
  }, [memoCallback])

  let resultRef = useRef(createIterableResult())
  resultRef.current.callback = memoCallback
  resultRef.current.requestState = requestState
  resultRef.current.setRequestState = setRequestState

  return resultRef.current

}

export default useFetchCallback
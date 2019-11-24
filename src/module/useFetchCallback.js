import {useState, useCallback} from 'react'
import useSemanticMemo from "./useSemanticMemo"

const defaultError = null
const defaultData = null

//todo sometimes I still see the warning of set state on unmounted component
const useFetchCallback = (fetcher, {defaultLoading = false} = {}) => {

  const [loading, setLoading] = useState(defaultLoading)
  const [error, setError] = useState(defaultError)
  const [data, setData] = useState(defaultData)

  //todo abortion before fetch?
  //todo handle `this`
  const callback = useCallback(async (...args) => {
    const abortController = getAbortController()
    callback.abort = () => {
      abortController.abort()
    }
    setLoading(true)
    setData(defaultData)
    setError(defaultError)
    let data = defaultData
    let errorAbortionOrSuspension = false
    try {
      data = await fetcher(...args, abortController.signal)
    } catch (error) {
      const name = error?.name
      if (name !== 'AbortError' && name !== 'Suspend') {
        setError(error)
        setLoading(false)
      }
      errorAbortionOrSuspension = true
    }
    if (!errorAbortionOrSuspension) {
      setData(data)
      setLoading(false)
    }
  }, [fetcher])

  return useSemanticMemo(() => [loading, error, data, callback], [loading, error, data, callback])

}

/*
const isThenable = (thenable) => {
  if (!thenable?.then) {
    throw "react-ufo: your function needs to return a promise, did you forget to add a return statement?"
  }
}
*/

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
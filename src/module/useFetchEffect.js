import {useEffect} from 'react'
import useFetchCallback from "./useFetchCallback"

const useFetchEffect = (fn) => {

  const result = useFetchCallback(fn, {defaultLoading: true})

  const [, callback] = result

  useEffect(() => {
    callback()
    return () => {
      callback.abort()
    }
  }, [callback])

  return result

}

export default useFetchEffect
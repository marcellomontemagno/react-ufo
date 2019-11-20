import {useEffect} from 'react'
import useFetchCallback from "./useFetchCallback"

const useFetchEffect = (fn) => {

  const [loading, error, data, callback] = useFetchCallback(fn, {defaultLoading: true})

  useEffect(() => {
    callback()
    return () => {
      callback.abort()
    }
  }, [callback])

  return [loading, error, data]

}


export default useFetchEffect
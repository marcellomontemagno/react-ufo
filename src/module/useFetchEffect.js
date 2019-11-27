import {useEffect} from 'react'
import useFetchCallback from "./useFetchCallback"

const useFetchEffect = (fn) => {

  const resource = useFetchCallback(fn, {defaultLoading: true})

  const [, , , callback] = resource

  useEffect(() => {
    callback()
    return () => {
      callback.abort()
    }
  }, [callback])

  return resource

}

export default useFetchEffect
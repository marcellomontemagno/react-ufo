import {useState, useRef} from "react"
import createResource from "./createResource"

const useResource = (state = {}) => {

  const defaultState = {loading: false, error: null, data: null, ...state}

  const [resource, _setResource] = useState(createResource(defaultState))

  const setResource = (resource) => {
    _setResource(createResource(resource))
  }

  const listen = (promise) => {
    setResource({loading: true, error: null, data: null, promise})
    promise.then((data) => {
      setResource({loading: false, error: null, data})
    })
    promise.catch((error) => {
      setResource({loading: false, error, data: null})
      throw error
    })
  }

  const result = useRef([null, listen, _setResource])
  result.current[0] = resource

  return result.current

}

export default useResource
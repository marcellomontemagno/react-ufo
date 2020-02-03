import {useCallback, useRef, useState} from 'react'
import createIterableRequestState from "./createIterableRequestState"
import createIterableSetRequestState from "./createIterableSetRequestState"

const useRequestState = (state = {}) => {
  const [requestState, setRequestState] = useState(createIterableRequestState({
    loading: false,
    error: null,
    data: null,
    ...state
  }))
  const result = useRef([])
  result.current[0] = requestState
  result.current[1] = useCallback(
    createIterableSetRequestState(setRequestState),
    [setRequestState]
  )
  return result.current
}

export default useRequestState
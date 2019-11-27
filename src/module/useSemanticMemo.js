import {useRef} from 'react'

//todo refactor a bit (prevDepsRef.current = deps in many places is error prone)
const useAreDependenciesChanged = (deps) => {

  const prevDepsRef = useRef(null)

  if (prevDepsRef.current === null) {
    prevDepsRef.current = deps
    return true
  }

  //todo not needed yet but should it handle if args length changes?
  for (let i = 0; i < deps.length; i++) {
    const prev = prevDepsRef.current[i]
    const current = deps[i]
    if (!Object.is(prev, current)) {
      prevDepsRef.current = deps
      return true
    }
  }

  prevDepsRef.current = deps

  return false

}

//todo can I implement the same with useEffect but executing on first render and skipping the mount?
const useSemanticMemo = (fn, deps = []) => {
  const memo = useRef()
  if (useAreDependenciesChanged(deps)) {
    memo.current = fn()
  }
  return memo.current
}

export default useSemanticMemo
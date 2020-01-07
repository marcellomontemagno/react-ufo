import React, {useState, useRef, useEffect} from 'react'
import debounce from 'lodash.debounce'
import {useFetchCallback} from "react-ufo"

//A fetcher function knows nothing about react, it fetches some data and returns a promise
export const getTodo = async (id, signal) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/' + id, {signal})
  return response.json()
}

const useRacingDebounce = (fn) => {

  const prevFnRef = useRef(null)
  const fnRef = useRef(null)

  useEffect(() => {

    const fnWrapper = (...args) => {
      prevFnRef.current && prevFnRef.current.abort()
      fn(...args)
      prevFnRef.current = fn
    }

    fnRef.current = debounce(fnWrapper, 300)

  }, [fn])

  return fnRef

}

const DebounceFetchExample = () => {

  const [searchTerm, setSearchTerm] = useState("")

  //useFetchCallback gets a fetcher function and returns its state and a function to trigger the fetch
  const [[loading, error, todo], fetchTodo] = useFetchCallback(getTodo)

  const debouncedFetchTodoRef = useRacingDebounce(fetchTodo)

  const onSearchTermChange = (event) => {
    const searchTerm = event.target.value
    setSearchTerm(searchTerm)
    debouncedFetchTodoRef.current(searchTerm)
  }

  return <>
    <input value={searchTerm} onChange={onSearchTermChange}/>
    <br/>
    {loading && "⏳ Loading..."}
    {error && "😵 An error occurred"}
    {todo && `🥂 Here your data: ${JSON.stringify(todo)}`}
    <br/>
    - Disable the network in your dev tools to check what happens in case of an error
  </>

}

export default DebounceFetchExample
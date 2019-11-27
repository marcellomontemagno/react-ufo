import React from 'react'
import {useFetchCallback} from "react-ufo"

//A fetcher function knows nothing about react, it fetches some data and returns a promise
export const getTodo = async (id, signal) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/' + id, {signal})
  return response.json()
}

const FetchCallbackExample = ({id = 1}) => {

  //useFetchCallback gets a fetcher function and returns its state and a function to trigger the fetch
  const [loading, error, todo, fetchTodo] = useFetchCallback(getTodo)

  /*
  by default the abort signal is passed as last argument but you are free to adapt the api if needed:
  const [loading, error, todo, fetchTodo] = useFetchCallback(useCallback((id, signal) => {
    return getTodo(id, signal)
  }, []))
  */

  const onFetchClick = () => {
    //you decide when to invoke the fetch
    fetchTodo(id)
  }

  const onAbortClick = () => {
    //you decide when to abort the fetch
    fetchTodo.abort()
  }

  return <>
    <button onClick={onFetchClick}>Fetch</button>
    <button onClick={onAbortClick}>Abort</button>
    <br/>
    {loading && "⏳ Loading..."}
    {error && "😵 An error occurred"}
    {todo && `🥂 Here your data: ${JSON.stringify(todo)}`}
    <br/>
    - You can play with your dev tools to check what happens when you have a network error or a slow connection
  </>

}

export default FetchCallbackExample
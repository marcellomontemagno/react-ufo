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

  const onButtonClick = () => {
    //you decide when to invoke the fetch
    fetchTodo(id)
  }

  return <>
    <button onClick={onButtonClick}>Fetch</button>
    <br/>
    {loading && "⏳ Loading..."}
    {error && "😵 An error occurred"}
    {todo && `🥂 Here your data: ${JSON.stringify(todo)}`}
    <br/>
    - You can play with your dev tools to check what happens when you have a network error or a slow connection
  </>

}

export default FetchCallbackExample
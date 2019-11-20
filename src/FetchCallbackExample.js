import React from 'react'
import useFetchCallback from "./module/useFetchCallback"

//A fetcher function knows nothing about react, it fetches some data and returns a promise
export const getTodo = async (id, signal) => {
  const response = await fetch('http://slowwly.robertomurray.co.uk/delay/1000/url/https://jsonplaceholder.typicode.com/todos/' + id, {signal})
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
    - Disable the network in your dev tools to check what happens in case of an error
  </>

}

export default FetchCallbackExample
import React, {useState, useCallback} from 'react'
import {useFetchEffect} from "react-ufo"

//A fetcher function knows nothing about react, it fetches some data and returns a promise
export const getTodo = async (id, signal) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/' + id, {signal})
  return response.json()
}

const Todo = ({id}) => {

  //useFetch invokes a fetcher on mount/update, furthermore it aborts the signal on unmount
  const [loadingTodo, todoError, todo] = useFetchEffect(useCallback((signal) => {
    return getTodo(id, signal)
  }, [id]))

  if (loadingTodo) {
    return "⏳ Loading..."
  }

  if (todoError) {
    return "😵 An error occurred"
  }

  return <>
    🥂 Here your data: {JSON.stringify(todo)}
  </>

}

//this code is not needed it allows you to mount/unmount the example so you can see how the library handles it
const FetchEffectExample = () => {

  const [todoVisible, setTodoVisible] = useState(false)

  const toggleTodoVisibility = useCallback(() => {
    setTodoVisible((visible) => !visible)
  }, [])

  return <>
    <button onClick={toggleTodoVisibility}>Mount/unmount todo</button>
    <br/>
    {todoVisible && <Todo id={1}/>}
    <br/>
    - Disable the network in your dev tools to check what happens in case of an error
    <br/>
    - Slow down your connection in the dev tools and unmount the todo component before the request is completed to see that the api call is aborted in your dev tools
  </>

}

export default FetchEffectExample
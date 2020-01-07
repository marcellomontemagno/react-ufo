import React, {useState, useCallback} from 'react'
import {useFetchEffect} from "react-ufo"

export const getTodo = async (id, signal) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/' + id, {signal})
  return response.json()
}

const Todo = ({id}) => {

  const [[loadingTodo, todoError, todo]] = useFetchEffect(useCallback((signal) => {
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
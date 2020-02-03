import React, {useState, useCallback, useEffect} from 'react'
import {useFetcher} from "react-ufo"

const api = {
  getTodo: async (id, signal) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/' + id, {signal})
    return response.json()
  }
}

const Todo = ({id}) => {

  const [getTodo, [loadingTodo, todoError, todo]] = useFetcher(api.getTodo)

  useEffect(() => {
    getTodo(id).then(() => undefined)
  }, [id, getTodo])

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
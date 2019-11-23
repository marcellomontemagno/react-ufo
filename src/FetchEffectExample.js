import React, {useState, useCallback} from 'react'
import useFetchEffect from "./module/useFetchEffect"

//A fetcher function knows nothing about react, it fetches some data and returns a promise
export const getTodo = async (id, signal) => {
  const response = await fetch('http://slowwly.robertomurray.co.uk/delay/1000/url/https://jsonplaceholder.typicode.com/todos/' + id, {signal})
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
    - Unmount the todo component before the request is completed to see that the api call is aborted in your dev tools
  </>

}

export default FetchEffectExample
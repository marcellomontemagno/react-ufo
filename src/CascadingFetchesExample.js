import React, {useState, useCallback} from 'react'
import {awaitResource, useFetchEffect} from "react-ufo"

//A fetcher function knows nothing about react, it fetches some data and returns a promise
const getTodo = async (id, signal) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/' + id, {signal})
  return response.json()
}

//A fetcher function knows nothing about react, it fetches some data and returns a promise
const getUser = async (id, signal) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users/' + id, {signal})
  return response.json()
}

const Container = ({todoId}) => {

  const todoResource = useFetchEffect(useCallback((signal) => getTodo(todoId, signal), [todoId]))
  const userResource = useFetchEffect(useCallback((signal) => {
      //we need to tell this useFetchEffect that it needs to await for the todo so that user will appear as loading while todo is not ready
      //omitting `awaitResource(todoResource)` would result in an invocation of getUser before we can retrieve userId from the todo
      const todo = awaitResource(todoResource)
      return getUser(todo.userId, signal)
    }, [todoResource]
  ))

  return <Todo
    todoResource={todoResource}
    CreatedBy={<CreatedBy userResource={userResource}/>}
  />

}

//this code is completely unaware of the fetch logic and the dependencies between remote resources
const Todo = ({todoResource, CreatedBy}) => {
  const [loading, error, todo] = todoResource
  const {completed, title} = todo || {}
  if (error) {
    return <div>😵 An error occurred</div>
  }
  return <div style={{border: '1px solid green', padding: '0.25rem'}}>
    Todo: <br/>
    {loading ? '⏳ LoadingTodo...' : ((completed ? '[✔] ' : '[ ] ') + title)}<br/>
    {CreatedBy}
  </div>
}

//this code is completely unaware of the fetch logic and the dependencies between remote resources
const CreatedBy = ({userResource}) => {
  const [loading, error, user] = userResource
  const {email} = user || {}
  if (error) {
    return <div>😵 An error occurred</div>
  }
  return <>
    {"Created by: "}{loading ? '⏳ LoadingEmail...' : email}
  </>
}

//this code is not needed it allows you to mount/unmount the example so you can see how the library handles it
const CascadingFetchesExample = () => {

  const [todoVisible, setTodoVisible] = useState(false)

  const toggleTodoVisibility = useCallback(() => {
    setTodoVisible((visible) => !visible)
  }, [])

  return <>
    <button onClick={toggleTodoVisibility}>Mount/unmount todo</button>
    <br/>
    {todoVisible && <Container todoId={10}/>}
    - You can play with your dev tools to check what happens when you have a network error or a slow connection <br/>
    - You can try to unmount the component before a request is completed to see what happens
  </>

}

export default CascadingFetchesExample
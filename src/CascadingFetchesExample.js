import React, {useState, useCallback} from 'react'
import {awaitResource, useFetchEffect} from "./module"

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
      //we need to tell useFetchEffect retrieving the user that it needs to await for the todo so that user will appear as loading the whole time
      //if we dont write `awaitResource(todoResource)` useFetchEffect will invoke getUser with userId = undefined
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

const CascadingFetchesExample = () => {

  const [todoVisible, setTodoVisible] = useState(false)

  const toggleTodoVisibility = useCallback(() => {
    setTodoVisible((visible) => !visible)
  }, [])

  return <>
    <button onClick={toggleTodoVisibility}>Mount/unmount todo</button>
    <br/>
    {todoVisible && <Container todoId={10}/>}
    - Disable the network in your dev tools to check what happens in case of an error
    <br/>
    - Unmount the todo component before the request is completed to see that the api call is aborted in your dev tools
  </>

}

export default CascadingFetchesExample
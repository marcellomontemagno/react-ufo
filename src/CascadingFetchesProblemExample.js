import React, {useState, useCallback} from 'react'
import {useFetchEffect} from "./module"

const Todo = ({todoId}) => {

  const getTodo = async (id, signal) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/' + id, {signal})
    return response.json()
  }

  const [loading, error, todo] = useFetchEffect(useCallback((signal) => getTodo(todoId, signal), [todoId]))

  if (error) {
    return <div> 😵 An error occurred </div>
  }

  const {completed, title, userId} = todo || {}

  return <div style={{border: '1px solid green', padding: '0.25rem'}}>
    Todo: <br/>
    {loading ? '⏳ LoadingTodo...' : ((completed ? '[✔] ' : '[ ] ') + title)}<br/>
    <CreatedBy userId={userId}/>
  </div>

}

const CreatedBy = ({userId}) => {

  const getUser = async (id, signal) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users/' + id, {signal})
    return response.json()
  }

  let [loading, error, user] = useFetchEffect(useCallback((signal) => {
    /*
    //this kinda works but useFetchEffect would think that getUser has been resolved with value undefined
    if (userId === undefined) {
      return undefined
    }
    */
    //this works but leaves a task waiting for a promise that will never me resolved?
    if (userId === undefined) {
      return new Promise(() => {
      })
    }
    return getUser(userId, signal)
  }, [userId]))

  if (error) {
    return <div> 😵 An error occurred </div>
  }

  return <>
    {'Created by: '} {loading ? '⏳ LoadingEmail...' : user.email}
  </>

}

const CascadingFetchesProblemExample = () => {

  const [todoVisible, setTodoVisible] = useState(false)

  const toggleTodoVisibility = useCallback(() => {
    setTodoVisible((visible) => !visible)
  }, [])

  return <>
    <button onClick={toggleTodoVisibility}>Mount/unmount todo</button>
    <br/>
    {todoVisible && <Todo todoId={10}/>}
    - Disable the network in your dev tools to check what happens in case of an error
    <br/>
    - Unmount the todo component before the request is completed to see that the api call is aborted in your dev tools
  </>

}

export default CascadingFetchesProblemExample
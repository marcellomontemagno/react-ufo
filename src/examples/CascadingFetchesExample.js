import React, {useState, useCallback} from 'react'
import {useFetchEffect} from "react-ufo"

export const getTodo = async (id, signal) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/' + id, {signal})
  return response.json()
}

export const getUser = async (id, signal) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users/' + id, {signal})
  return response.json()
}

const Container = ({todoId}) => {

  const [todoResource, , todoPromise] = useFetchEffect(useCallback((signal) => getTodo(todoId, signal), [todoId]))
  const [userResource] = useFetchEffect(useCallback(async (signal) => {
      const todo = await todoPromise
      return getUser(todo.userId, signal)
    }, [todoPromise]
  ))

  return <Todo
    todoResource={todoResource}
    CreatedBy={<CreatedBy userResource={userResource}/>}
  />

}

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
    - You can play with your dev tools to check what happens when you have a network error or a slow connection <br/>
    - You can try to unmount the component before a request is completed to see what happens
  </>

}

export default CascadingFetchesExample
[![Actions Status](https://github.com/marcellomontemagno/react-ufo/workflows/CI/badge.svg)](https://github.com/marcellomontemagno/react-ufo/actions)

<p align="center">
  <img alt="ufo" src='ufo.png'/>
  <br/>
  UFO - Use fetch orderly
  <br/>
  react-ufo helps you handle data fetching in react with no fuss
</p>

## Introduction

When updating a UI with data retrieved form a remote server a lot of things can go wrong

- you will need to handle `loading` and `error` state
- you might have two or more requests depending on each others
- you might want to abort pending requests in certain conditions
- you might have to handle race conditions

At a first sight these problem seems no big deal but things get out of control quite easily.

Taking advantage of react hooks `react-ufo` helps you dealing with all this complexity.
 
## Installation

`npm install --save react-ufo`

`import {useFetcher} from "react-ufo"`

## How to use

### Basic usage

`useFetcher` handles the state of a request for you and much more.

The minimal usage of `useFetcher` looks like the following:

`const [callback, [loading, error, data]] = useFetcher(fetcher)`

A `fetcher` function is a normal function that fetches some data and returns a promise.

Here an example of `fetcher` function: 

```
const getTodo = async (id) => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/" + id);
  return response.json();
};
```
  
When you want your request to start, all you need to do is to invoke `callback`, after doing so, `loading`, `error`, and `data` will be updated in accordance with the status of your request. 

Any argument you pass to `callback` will be passed to your `fetcher`.

> **Note:**
> Do not create a new `fetcher` function on every render, `useFetcher` will create a new `callback` anytime a new `fetcher` instance is received. In case your `fetcher` depends on props simply pass them to `callback` and your fetcher will receive them.

Here a basic example showing how to use `useFetcher` in an event callback such as `onClick` [![Edit 1basicFetchInEventCallbackExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/1basicfetchineventcallbackexample-ocu87?fontsize=14&hidenavigation=1&theme=dark)

### Fetching on mount/update

By default, before a request is started, `useFetcher` will return `loading=false`, `error=null`, `data=null`.

Sometimes you might want your initial request state to be different.

One example is if you plan to request your data on the component mount/update, in this case you might want your initial request state to have `loading=true`.
    
`useFetcher` can receive a second argument indicating the initial state before your request starts.

Here how you override the default `loading` state to be `true`

`const [callback, [loading, error, data]] = useFetcher(fetcher, {loading:true})`

Now if you want your request to start on mount all you need to do is

```
useEffect(()=>{
  callback()
},[callback])
```

You don't have to worry about passing `callback` as a dependency of `useEffect`, `callback` will only change if your `fetcher` changes.

### Fetching on mount/update with props

Sometimes a `fetcher` might need some data in order to retrieve data, for example the `getTodo` presented earlier needs an `id` argument.

Assuming `id` is a prop of your component all you need to do is

```
useEffect(()=>{
  callback(id)
},[id,callback])
```

this ensure that your `fetcher` will be invoked on mount and anytime `id` updates, which is usually what you want. 

Here a basic example showing how to use `useFetcher` during mount/update [![Edit 2basicFetchOnMountAndUpdateExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/2basicfetchonmountandupdateexample-k7e1q?fontsize=14&hidenavigation=1&theme=dark)
 
### Ignoring a pending request

If your component is unmounted while one of its requests is still pending `useFetcher` will take care of ignoring its result avoiding an attempt to perform a `setState` on an unmounted component.

Sometimes you might want to ignore the result of a request for other reasons too.

`callback.ignore()` can be invoked if you need to ignore the result of a pending request.

If a pending request is marked as ignored `loading`, `error` and `data` will not be updated once the request is completed.
 
### Aborting a pending request

`callback.abort()` can be invoked anytime you want to abort a pending request.

Unfortunately in order for `callback.abort()` to work properly there is some little more wiring that you'll need to do.

`useFetcher` will take care of passing an [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) to your `fetcher` as its last argument.

In order for `callback.abort()` to work you'll need to pass the abort signal to your [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

Here an example showing how to enable fetch abortion on the `getTodo` `fetcher` presented earlier

```
const getTodo = async (id, signal) => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/" + id, {signal});
  return response.json();
};
```

If your fetcher is not passing the `abort signal` to `fetch API` invoking `callback.abort()` will not abort the request but the request will still be marked as ignored.
 
If a request is marked as ignored `loading`, `error` and `data` will not be updated once the request is completed. 
 
Here an example showing how to abort a request [![Edit 3basicAbortFetchExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/3basicabortfetchexample-kf591?fontsize=14&hidenavigation=1&theme=dark)

Aborting a pending request is quite easy when using [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) but it can also be achieved if you are using other libraries such as [axios](https://www.npmjs.com/package/axios)

If you are wondering how to abort a request started by [axios](https://www.npmjs.com/package/axios) instead of [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) you can find an example here [![Edit abortRequestIfUsingAxiosExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/abortrequestifusingaxiosexample-fg8de?fontsize=14&hidenavigation=1&theme=dark) 

### Cascading fetches

Sometimes 2 requests depend on each other.

Let's say that you fetched a `todo` object containing a `userId` field and you want to use `userId` to fetch a `user` object.

Here how you can handle this use case with `useFetcher`:

```

...

const [fetchTodo, [loadingTodo, todoError, todo]] = useFetcher(todoFetcher)
const [fetchUser, [loadingUser, userError, user]] = useFetcher(userFetcher)

useEffect(()=>{
  fetchTodo(todoId).then((todo)=>{
    fetchUser(todo.userId)
  })
},[todoId, fetchTodo, fetchUser])

...

```

Here the full example showing this use case [![Edit 4cascadingFetchesExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/4cascadingfetchesexample-1148s?fontsize=14&hidenavigation=1&theme=dark)

### Keeping state between fetches

By default `useFetcher` erases the `data` of a request anytime a new one is started.

Most of the times this is what you want but there are cases where you want to keep the `data` visible to the user until new `data` are retrieved.  

If you need to keep `data` between fetches you can simply use `useState` from react.

Here an example showing how to keep `data` while multiple request are pending:

```
const [data, setData] = useState()
const [callback, [loading, error, _data]] = useFetcher(fetcher)

...

const myEventCallback = ()=>{
  callback(1).then((data)=>{
    setData(data)
    callback(2).then((data)=>{
        setData(data)
    })
  })
} 

``` 

in the previous example `_data` is set to null anytime a new request is started while `data` is only valued when a request is completed.

### Debouncing requests

Here an example showing one simple way to debounce requests [![Edit 5debounceFetchExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/5debouncefetchexample-mo18d?fontsize=14&hidenavigation=1&theme=dark)

### Mutating state

Sometimes you might want to change your request state manually.

One common scenario when this can happen is if your user decides to ignore and remove a request error message displayed on the screen.

`useFetcher` provides you `setLoading`, `setError`, `setData` and `setRequestState` for you to handle these use cases.

Here the full signature of `useFetcher`:

```
const [callback, [loading, error, data], setRequestState] = useFetcher(fetcher)
const [setLoading, setError, setData] = setRequestState
```

`setLoading`, `setError`, `setData` and `setRequestState` should be self explanatory, they work exactly like the setState in `const [state, setState] = useState()`

### Putting all together

Here an example showing how `useFetcher` can be used to implement a simple CRUD application [![Edit 6crudExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/6crudexample-ggp4o?fontsize=14&hidenavigation=1&theme=dark)

### useFetcher API

Here the full useFetcher API

```
const initialRequestState = {loading:false, error:null, data:false} //these are the default values if initialRequestState is not provided
const [callback, requestState, setRequestState] = useFetcher(fetcher, initialRequestState)
const [loading, error, data] = requestState
const [setLoading, setError, setData] = setRequestState
```
 
### What exactly is useFetcher returning?

`useFetcher` returns a `result` object shaped as follow:

```
{
  callback,
  requestState: {
    loading,
    error,
    data
  },
  setRequestState: {
    setLoading,
    setError,
    setData
  }
}
``` 

`result`, `requestState` and `setRequestState` are also iterable, therefore, if you find it convenient for renaming, you can destructure them into an array as follow:

```
const [callback, [loading, error, data], [setLoading, setError, setData]] = result
```

When destructuring into an array you obviously need to rely on the order we specified for each key, therefore, in case you don't want to extract all the fields from `result`, you might need to write something like the following:

```
const [callback, [loading, , data], [, setError]] = result
```

Because `result` is an object, accessing its fields by key (e.g `const data = result.requestState.data`) is going to work as expected too.

Because `result` is an object, doing object destructuring is going to work as expected too. 

Note that even though `setRequestState` contains `setLoading`, `setError`, `setData` it is a function and can be used to update `loading`, `error` and `data` in a single render.

> **Note:**
> Even though `result`, `requestState` and `setRequestState` are iterable they are not arrays, therefore something like `result[0]` or `result.requestState[0]` is not going to work.   

## Examples

1) basic fetch in event callback [![Edit 1basicFetchInEventCallbackExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/1basicfetchineventcallbackexample-ocu87?fontsize=14&hidenavigation=1&theme=dark)
2) basic fetch on mount/update [![Edit 2basicFetchOnMountAndUpdateExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/2basicfetchonmountandupdateexample-k7e1q?fontsize=14&hidenavigation=1&theme=dark)
3) aborting a pending request [![Edit 3basicAbortFetchExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/3basicabortfetchexample-kf591?fontsize=14&hidenavigation=1&theme=dark)
4) handling requests depending on each others [![Edit 4cascadingFetchesExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/4cascadingfetchesexample-1148s?fontsize=14&hidenavigation=1&theme=dark)
5) debouncing requests [![Edit 5debounceFetchExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/5debouncefetchexample-mo18d?fontsize=14&hidenavigation=1&theme=dark)
6) simple CRUD application [![Edit 6crudExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/6crudexample-ggp4o?fontsize=14&hidenavigation=1&theme=dark)
7) aborting a pending request started with [axios](https://www.npmjs.com/package/axios) [![Edit abortRequestIfUsingAxiosExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/abortrequestifusingaxiosexample-fg8de?fontsize=14&hidenavigation=1&theme=dark)

## Package versioning

Breaking changes might be made between 0.x.x versions.
Starting from version 1.0.0 every breaking changes will result in a major version update.
The [changelog](https://github.com/marcellomontemagno/react-ufo/releases) will give you details about every change between versions.
  
## Dependencies

This package has zero dependencies but in order to support fetches abortion you will need <a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank">AbortController</a> (or a polyfill such as <a href="https://www.npmjs.com/package/abortcontroller-polyfill" target="_blank">abortcontroller-polyfill</a>) in your environment
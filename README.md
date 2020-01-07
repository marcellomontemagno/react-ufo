[![Actions Status](https://github.com/marcellomontemagno/react-ufo/workflows/CI/badge.svg)](https://github.com/marcellomontemagno/react-ufo/actions)

<p align="center">
  <img alt="ufo" src='ufo.png'/>
  <br/>
  UFO - Use fetch orderly
  <br/>
  react-ufo is a collection of react hooks to help you handle data fetching with no fuss
</p>

## Installation

`npm install --save react-ufo`

`import {useFetchCallback, useFetchEffect} from "react-ufo"`

## Examples

If you want to invoke a remote API inside an event callback: [![Edit FetchCallbackExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/fetchcallbackexample-bezg7?fontsize=14&hidenavigation=1&theme=dark)

If you want to invoke a single API on mount/update: [![Edit FetchEffectExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/fetcheffectexample-hnnp8?fontsize=14&hidenavigation=1&theme=dark)

If you want to invoke multiple APIs depending on each other: [![Edit CascadingFetchesExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ancient-frost-n9oyk?fontsize=14&hidenavigation=1&theme=dark)

## APIs

### useFetchCallback

`useFetchCallback` hook is handy when you need to start a request in an event callback such as `onClick`.

You can declare `const [[loading, error, data], callback] = useFetchCallback(fetcher)` within your functional component and then invoke `callback` within your event callback to start the `fetcher`. 

A `fetcher` function is a normal function returning a promise.

This hook handles the UI state of a request for you (loading, error...), all you need to do is tell what to fetch providing a `fetcher` function.

Any argument passed to `callback` will be passed to your `fetcher`.

`useFetchCallback` also helps you to abort a pending request if needed.

Your `fetcher` function will automatically receive an [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) as the last argument, passing this signal to your [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) will enable you to abort the request when `callback.abort()` is invoked. 

> **Note:**
> do not create a new `fetcher` function on every render, `useFetchCallback` will re-initialize itself when a new `fetcher` instance is received. In case your `fetcher` depends on props you can use the `useCallback` hook to create a new `fetcher` only when the input props change. 

For further info about this API check this example: [![Edit FetchCallbackExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/fetchcallbackexample-bezg7?fontsize=14&hidenavigation=1&theme=dark)

### useFetchEffect

`useFetchEffect` hook is handy when you need to start a request on `componentDidMount`, and abort it on `componentWillUnmount`.

`const [[loading, error, data], callback] = useFetchEffect(fetcher)`

This hook works exactly as `useFetchCallback` but also invokes `callback` on `componentDidMount` and `callback.abort()` on `componentWillUnmount` for you.

> **Note:**
> do not create a new `fetcher` function on every render, `useFetchEffect` would detect that the `fetcher` is changed and invoke your `fetcher` on every render causing a loop.
> In case your `fetcher` depends on props you can use the `useCallback` hook to create a new `fetcher` only when the input props change, this will enable you to fetch again on `componentDidUpdate` if needed.  

For further info about this API check this example: [![Edit FetchEffectExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/fetcheffectexample-hnnp8?fontsize=14&hidenavigation=1&theme=dark)

### Cascading fetches

Let's say that you fetched a `todo` object containing a `userId` field and you want to use `userId` to fetch a `user` object.

You would probably try to write something like this:

```

...

const [[loadingTodo, todoError, todo]] = useFetchEffect(useCallback((signal) => getTodo(todoId, signal), [todoId]))

const userId = todo && todo.userId

const [[loadingUser, userError, user]] = useFetchEffect(useCallback((signal) => {
    return getUser(userId, signal)
}, [userId]))

...

```

This seems to be fine but there are quite a few missing pieces:

1) until `todo` is loaded `userId` will be undefined, the `useFetchEffect` fetching the `user` is not aware of the loading state of the `todo`, all it knows is that it needs to trigger `getUser` anytime `userId` changes. This code would result in 2 invocations of `getUser` one with `userId` undefined and one with `userId` valued properly when the `todo` is loaded.
2) what if the `useFetchEffect` fetching the `todo` fails? 

You might think that fixing these 2 problems is as easy as putting an `if(!loadingTodo){return ...}` and `if(todoError){return ...}` within your fetcher function, but what value would you return? `useFetchEffect` expects the `fetcher` to return a promises so it can handle your ui state accordingly.
 
Here how `react-ufo` allows you to solve the the problems previously mentioned:

```

...

const todoFetch = useFetchEffect(useCallback((signal) => getTodo(todoId, signal), [todoId])) 

const [[loadingUser, userError, user]] = useFetchEffect(useCallback(async (signal) => {
    const todo = await todoFetch.promise
    return getUser(todo.userId, signal)
}, [todoFetch.promise]))

...

```

The Following will automatically happen for you:

- `return getUser(todo.userId, signal)` will not be invoked until `todo` is loaded
- `loadingUser` will not be `true` until both the `todo` and the `user` are loaded
- if `todo` fails `user` will fail too (`userError` will be valued)

For further info about this API check this example:  [![Edit CascadingFetchesExample](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ancient-frost-n9oyk?fontsize=14&hidenavigation=1&theme=dark)

### What exactly are useFetchCallback and useFetchEffect returning?

Both `useFetchCallback` and `useFetchEffect` return a `result` object shaped as follow:

```
{
  resource: {
    loading,
    error,
    data
  },
  callback,
  promise
}
``` 

both `result` and `resource` are also iterable, therefore, you can also destructure them in an array like follow

```
const [[loading, error, data], callback, promise] = result
```

if you find it convenient for renaming.

When destructuring into an array you obviously need to rely on the order we specified, therefore you might need to write something like the following

```
const [[loading, , data], , promise] = result
```

in case you don't want to extract all the fields from `result`.

Because `result` is an object accessing its fields by key or doing object destructuring is going to work as expected too. 

> **Note:**
> Even though `result` and `resource` are iterable they are not arrays, therefore something like `result[0]` or `result.resource[0]` is not going to work.   

## Package versioning

Some breaking changes might be made between 0.x.x versions.
Starting from version 1.0.0 every breaking changes will result in a major version update.
The [changelog](https://github.com/marcellomontemagno/react-ufo/releases) will give you details about the changes.
  
## Dependencies

This package has zero dependencies but in order to support fetches abortion you will need  <a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank">AbortController</a> (or a polyfill such as <a href="https://www.npmjs.com/package/abortcontroller-polyfill" target="_blank">abortcontroller-polyfill</a>) in your environment
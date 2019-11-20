import React from 'react'
import FetchEffectExample from './FetchEffectExample'
import FetchCallbackExample from "./FetchCallbackExample"
import CascadingFetchesExample from "./CascadingFetchesExample"
import CascadingFetchesProblemExample from "./CascadingFetchesProblemExample"

const Root = () => {
  return <>
    Basic example:
    <br/>
    <FetchCallbackExample/>
    <br/><br/><br/>
    Lifecycle example:
    <br/>
    <FetchEffectExample/>
    <br/><br/><br/>
    Cascading fetches problem example:
    <br/>
    <CascadingFetchesProblemExample/>
    <br/><br/><br/>
    Cascading fetches example:
    <br/>
    <CascadingFetchesExample/>
  </>
}

export default Root

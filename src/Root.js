import React from 'react'
import FetchEffectExample from './examples/FetchEffectExample'
import FetchCallbackExample from "./examples/FetchCallbackExample"
import CascadingFetchesExample from "./examples/CascadingFetchesExample"
import DebounceFetchExample from "./examples/DebounceFetchExample"

const Root = () => {
  return <>
    Fetch callback example:
    <br/>
    <FetchCallbackExample/>
    <br/><br/><br/>
    Fetch effect example:
    <br/>
    <FetchEffectExample/>
    <br/><br/><br/>
    Cascading fetches example:
    <br/>
    <CascadingFetchesExample/>
    <br/><br/><br/>
    Debounce fetch example:
    <br/>
    <DebounceFetchExample/>
    <br/><br/><br/>
  </>
}

export default Root

import React from 'react'
import FetchEffectExample from './examples/FetchEffectExample'
import FetchCallbackExample from "./examples/FetchCallbackExample"
import CascadingFetchesExample from "./examples/CascadingFetchesExample"
import DebounceFetchExample from "./examples/DebounceFetchExample"
import PessimisticAndUpdatesExample from "./examples/PessimisticUpdatesExample"
import CrudExample2 from "./examples/CrudExample"

const Root = () => {
  return <>
    crud:
    <br/>
    <CrudExample2/>
    <br/><br/><br/>
    Pessimistic update example:
    <br/>
    <PessimisticAndUpdatesExample/>
    <br/><br/><br/>
    Debounce fetch example:
    <br/>
    <DebounceFetchExample/>
    <br/><br/><br/>
    Cascading fetches example:
    <br/>
    <CascadingFetchesExample/>
    <br/><br/><br/>
    Fetch callback example in effect:
    <br/>
    <FetchEffectExample/>
    <br/><br/><br/>
    Fetch callback example:
    <br/>
    <FetchCallbackExample/>
    <br/><br/><br/>
  </>
}

export default Root

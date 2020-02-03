import React, {useRef, useEffect, useState, useCallback} from 'react'
import debounce from 'lodash.debounce'
import {useFetcher} from "react-ufo"

export const getBooks = async (title, signal) => {
  if (!title) return
  const response = await fetch('http://openlibrary.org/search.json?title=' + title + '&limit=5', {signal})
  return response.json()
}

const useDebounce = (fn, mills = 500) => {
  const ref = useRef(debounce(fn, mills))
  useEffect(() => {
    ref.current = debounce(fn, mills)
  }, [fn, mills])
  return ref.current
}

const DebounceFetchExample = () => {

  const [books, setBooks] = useState()
  const [fetchBooks, [loading, error]] = useFetcher(getBooks)

  const debouncedFetchBooks = useDebounce(
    useCallback(async (bookTitle) => {
      fetchBooks.abort()
      const books = await fetchBooks(bookTitle)
      setBooks(books)
    }, [fetchBooks])
  )

  const onSearchTermChange = (event) => {
    const bookTitle = event.target.value
    debouncedFetchBooks(bookTitle)
  }

  return <>
    Search books by name: <br/>
    <input placeholder="Book title" onChange={onSearchTermChange}/> {loading && " ⏳ Loading..."}
    <br/>
    {error && "😵 An error occurred"}
    {books?.docs.map((book => <div key={book.key}> - {book.title} by {book.author_name?.[0]}</div>))}
    {books?.docs?.length === 0 && "😮 No result found"}
    <br/>
    - Disable the network in your dev tools to check what happens in case of an error
  </>

}

export default DebounceFetchExample
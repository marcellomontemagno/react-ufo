import React, { useState, useCallback } from "react";
import { useFetchEffect } from "react-ufo";

import { fetchUser, fetchPosts } from "./fakeApi";

function getNextId(id) {
  return id === 3 ? 0 : id + 1;
}

function StaleRequestsExample() {
  const [id, setId] = useState(0);
  const [userResource] = useFetchEffect(
    useCallback((s) => {
      return fetchUser(id,s);
    }, [id])
  );
  const [postResource] = useFetchEffect(
    useCallback((s) => {
      return fetchPosts(id,s);
    }, [id])
  );
  return (
    <>
      <button onClick={() => setId(getNextId(id))}>Next</button>
      <ProfilePage userResource={userResource} postResource={postResource} />
    </>
  );
}

const ProfilePage = ({ userResource, postResource }) => {
  if (userResource.loading) {
    return <h2>Loading posts...</h2>;
  }
  if (userResource.error) {
    return <h2>User error</h2>;
  }
  return (
    <>
      <h1>{userResource.data.name}</h1>
      <ProfileTimeline postResource={postResource} />
    </>
  );
};

const ProfileTimeline = ({ postResource }) => {
  if (postResource.loading) {
    return <h2>Loading posts...</h2>;
  }
  if (postResource.error) {
    return <h2>Post error</h2>;
  }
  return (
    <ul>
      {postResource.data.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
};

export default StaleRequestsExample

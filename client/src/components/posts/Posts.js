import React, { useState, useEffect } from 'react'
import SmallPost from '../small_post/SmallPost'
import axios from 'axios'
import './Posts.css'

const SERVER_URL = 'http://localhost:8888/posts'

const Posts = () => {

  const [posts, setPosts] = useState([])


  useEffect(() => {
    const fetchFromAPI = async () => {
      const response = await axios.get(SERVER_URL)
      console.log(response.data)
      setPosts(response.data)
    }

    fetchFromAPI()
  }, [])

  console.log(posts)

  return (
    <div className="postsContainer">
      {posts.map((post) => {
        return (
          <SmallPost post={post}/>
        )
      })}
    </div>
  )
}

export default Posts;
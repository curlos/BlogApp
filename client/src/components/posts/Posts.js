import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SmallPost from '../small_post/SmallPost'
import axios from 'axios'
import './Posts.css'

const SERVER_URL = 'http://localhost:8888/posts'

const Posts = () => {

  const query = new URLSearchParams(useLocation().search)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchFromAPI = async () => {
      const response = await axios.get(SERVER_URL)
      console.log(response.data)
      const newPosts = getFilteredPosts(response.data)
      setPosts(newPosts)
    }

    fetchFromAPI()
  }, [query.get('category'), query.get('search')])

  const getFilteredPosts = (allPosts) => {

    let filteredPosts = null

    console.log(query)
    console.log(query.get('category'))
    console.log(query.get('search'))

    if (query.get('category')) {
      const requiredCategory = query.get('category').toUpperCase()
      filteredPosts = allPosts.filter((post) => {
        console.log(post)
        return (
          post.categories.includes(requiredCategory)
        )
      })
    }

    if (query.get('search')) {
      const requiredSearch = query.get('search').toLowerCase()
      filteredPosts = filteredPosts.filter((post) => {
        for (let key of Object.keys(post)) {
          if (typeof post[key] === 'string' && post[key].toLowerCase().includes(requiredSearch)) {
            return post
          }
        }
      })
    }

    if (filteredPosts === null) {
      return allPosts
    }
    
    console.log(filteredPosts)

    return filteredPosts
  }

  

  return (
    <div className="postsContainer">
      {posts.map((post) => {
        return (
          <SmallPost postID={post._id}/>
        )
      })}
    </div>
  )
}

export default Posts;
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SmallPost from '../small_post/SmallPost'
import axios from 'axios'
import './Posts.css'

const SERVER_URL = 'http://localhost:8888/posts'

const Posts = () => {

  const query = new URLSearchParams(useLocation().search)
  const sortFilters = ['new', 'oldest', 'comments', 'likes']
  const [posts, setPosts] = useState([])
  const [sortFilter, setSortFilter] = useState('likes')

  useEffect(() => {
    const fetchFromAPI = async () => {
      console.log('getting new posts')
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
      return getSortedPosts(allPosts)
    }
    
    console.log(sortByNew(filteredPosts))

    return getSortedPosts(filteredPosts)
  }

  const getSortedPosts = (posts) => {
    switch (sortFilter) {
      case 'new':
        return sortByNew(posts)
      case 'oldest':
        return sortByOldest(posts)
      case 'likes':
        return sortByMostLikes(posts)
      case 'comments':
        return sortByMostComments(posts)
      default:
        return posts
    }
  }

  const sortByNew = (postsToFilter) => {
    return postsToFilter.sort((postOne, postTwo) => (postOne.createdAt > postTwo.createdAt ? -1 : 1))
  }

  const sortByOldest = (postsToFilter) => {
    return postsToFilter.sort((postOne, postTwo) => (postOne.createdAt > postTwo.createdAt ? 1 : -1))
  }

  const sortByMostLikes = (postsToFilter) => {
    return postsToFilter.sort((postOne, postTwo) => {
      const postOneTotalLikes = postOne.likes.length - postOne.dislikes.length
      const postTwoTotalLikes = postTwo.likes.length - postTwo.dislikes.length

      return (
        (postOneTotalLikes > postTwoTotalLikes ? -1 : 1)
      )
    })
  }

  const sortByMostComments = (postsToFilter) => {
    return postsToFilter.sort((postOne, postTwo) => (postOne.comments.length > postTwo.comments.length ? -1 : 1))
  }

  

  return (
    <div className="postsContainer">
      <i className="fas fa-search"></i>
      <input type="text" className="searchBar"></input>
      {posts.map((post) => {
        return (
          <SmallPost postID={post._id}/>
        )
      })}
    </div>
  )
}

export default Posts;
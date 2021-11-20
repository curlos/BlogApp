import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Pagination } from '../pagination/Pagination'
import SmallPost from '../small_post/SmallPost'
import './Posts.css'

const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}/posts`

const Posts = () => {

  const query = new URLSearchParams(useLocation().search)
  // const sortFilters = ['new', 'oldest', 'comments', 'likes']
  const [postsInfo, setPostsInfo] = useState({posts: [], allPosts: [], sortFilter: 'likes', search: ''})
  const { posts, allPosts, sortFilter } = postsInfo
  const [searchText, setSearchText] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [updatedSearchText, setUpdatedSearchText] = useState('')
  const [paginatedPosts, setPaginatedPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  // eslint-disable-next-line no-unused-vars
  const [dataLimit, setDataLimit] = useState(2)
  const [pageLimit, setPageLimit] = useState(5)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('rerender')
    const fetchFromAPI = async () => {
      console.log('getting new posts')
      const response = await axios.get(SERVER_URL)
      console.log(response.data)
      const newPosts = getFilteredPosts(response.data)
      const newPaginatedPosts = getPaginatedData(newPosts)
      setPostsInfo({...postsInfo, posts: newPosts, allPosts: newPosts})
      setPaginatedPosts(newPaginatedPosts)
      setPageLimit(Math.round(newPosts.length / dataLimit))
      console.log(newPosts.length)
      setLoading(false)
    }

    fetchFromAPI()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.get('category'), postsInfo.sortFilter])

  const getFilteredPosts = (allPosts) => {

    let filteredPosts = null

    if (query.get('category')) {
      const requiredCategory = query.get('category').toUpperCase()
      filteredPosts = allPosts.filter((post) => {
        console.log(post)
        return (
          post.categories.includes(requiredCategory)
        )
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
      case 'newest':
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

  const handleSearch = (e) => {

    e.preventDefault()

    const filteredPosts = allPosts.filter((post) => {
      for (let key of Object.keys(post)) {
        if (typeof post[key] === 'string' && post[key].toLowerCase().includes(searchText.toLowerCase())) {
          return post
        }
      }

      return null
    })

    setPostsInfo({...postsInfo, posts: filteredPosts, search: searchText})
    setPaginatedPosts(getPaginatedData(filteredPosts))
    setPageLimit(Math.round(filteredPosts.length / dataLimit))
    console.log(filteredPosts)
  }

  const getPaginatedData = (data) => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    console.log(data.slice(startIndex, endIndex))
    console.log('updating posts')
    return data.slice(startIndex, endIndex)
  }

  console.log(paginatedPosts)
  console.log(postsInfo.posts)
  console.log(updatedSearchText)

  

  return (
    loading ? 'Loading...' : (
      <div className="postsContainer">
        <div>
          <div className="sortAndSearch">
            <form onSubmit={handleSearch}>
              <i className="fas fa-search" onClick={handleSearch}></i>
              <input type="text" className="searchBar" value={searchText} onChange={(e) => setSearchText(e.target.value)}></input>
            </form>

            <div className="sortTabOptions">
              <div className={postsInfo.sortFilter === 'newest' ? 'selectedSortFilter' : ''} onClick={() => setPostsInfo({...postsInfo, sortFilter: 'newest'})}>Newest</div>
              <div className={postsInfo.sortFilter === 'oldest' ? 'selectedSortFilter' : ''} onClick={() => setPostsInfo({...postsInfo, sortFilter: 'oldest'})}>Oldest</div>
              <div className={postsInfo.sortFilter === 'comments' ? 'selectedSortFilter' : ''} onClick={() => setPostsInfo({...postsInfo, sortFilter: 'comments'})}>Comments</div>
              <div className={postsInfo.sortFilter === 'likes' ? 'selectedSortFilter' : ''} onClick={() => setPostsInfo({...postsInfo, sortFilter: 'likes'})}>Likes</div>
            </div>
          </div>

          {paginatedPosts.map((post) => {
            return (
              <SmallPost postID={post._id} category={query.get('category')} paginatedPosts={paginatedPosts}/>
            )
          })}
        </div>

        <div>
          <Pagination data={posts} setPaginatedPosts={setPaginatedPosts} currentPage={currentPage} setCurrentPage={setCurrentPage} pageLimit={pageLimit} dataLimit={dataLimit} setLoading={setLoading} category={query.get('category')} />
        </div>

      </div>
    )
    
  )
}

export default Posts;
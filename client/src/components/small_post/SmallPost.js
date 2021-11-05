import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import UserContext from '../../contexts/UserContext'
import './SmallPost.css'

const SmallPost = ({postID, category}) => {

  const { loggedInUser, setLoggedInUser } = React.useContext(UserContext)
  const IMAGES_LOCATION = 'http://localhost:8888/images/'
  const [postInfo, setPostInfo] = useState({post: {}, author: {}})
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { post, author } = postInfo

  useEffect(() => {
    setImageError(false)
    
    const fetchFromAPI = async () => {

      const postResponse = await axios.get(`http://localhost:8888/posts/post/${postID}`)
      const authorResponse = await axios.get(`http://localhost:8888/users/user/${postResponse.data.author}`)
      setPostInfo({post: postResponse.data, author: authorResponse.data})
      setIsLoading(false)
    }

    fetchFromAPI()
  }, [postID, category])

  const handleLikePost = async () => {

    if (Object.keys(loggedInUser).length === 0) {
      return
    }

    const body = { userID: loggedInUser._id}
    const response = await axios.put(`http://localhost:8888/posts/post/like/${post._id}`, body)

    setPostInfo({...postInfo, post: response.data.updatedPost})
    setLoggedInUser(response.data.updatedUser)

  }

  const handleDislikePost = async () => {

    if (Object.keys(loggedInUser).length === 0) {
      return
    }

    const body = { userID: loggedInUser._id}
    const response = await axios.put(`http://localhost:8888/posts/post/dislike/${post._id}`, body)

    setPostInfo({...postInfo, post: response.data.updatedPost})
    setLoggedInUser(response.data.updatedUser)
  }

  return (

    <div>
      {isLoading ? 'Loading...' : (
        <div className="smallPostContainer">
          <div className="postVotes">
            <div><i className={`fas fa-thumbs-up ${Object.keys(loggedInUser).length > 0 && loggedInUser.likedPosts && loggedInUser.likedPosts.includes(post._id) ? 'liked' : null}`} onClick={handleLikePost}></i></div>
            <div className="postVotesNum">{(post.likes && post.dislikes && post.likes.length - post.dislikes.length) || 0}</div>
            <div><i className={`fas fa-thumbs-down ${Object.keys(loggedInUser).length > 0 && loggedInUser.dislikedPosts && loggedInUser.dislikedPosts.includes(post._id) ? 'disliked' : null}`} onClick={handleDislikePost}></i></div>
          </div>
    
          <Link to={`/post/${post._id}`} className="linkPostContainer">
            {post.headerImage && !imageError ? (
              <div className="imageContainer">
                <img src={IMAGES_LOCATION + post.headerImage} alt={post.title} onError={() => setImageError(true)}/>
              </div>
            ) : null}
    
            <div className="smallPostInfo">
              <div>
                <div className="smallPostTitle">{post.title}</div>
              </div>
    
              <div className="additionalInfo">
                <span>by {author.firstName} {author.lastName}</span>
                <span>{moment(post.createdAt).format('MMMM Do, YYYY')}</span>
                <span><i class="far fa-comment"></i>{post.comments.length}</span>
              </div>
            </div>
          </Link>
          
        </div>
      )}
    </div>
    
  )
}

export default SmallPost;
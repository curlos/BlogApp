import React, { useState, useEffect } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment'
import './Post.css'
import axios from 'axios';
import Comment from '../comment/Comment'
import CommentContainer from '../comment_container/CommentContainer';
import UserContext from '../../contexts/UserContext'

const Post = () => {

  const { id } = useParams()
  const history = useHistory()
  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)
  const SERVER_URL = 'http://localhost:8888/posts'
  const IMAGES_LOCATION = 'http://localhost:8888/images/'

  const [postInfo, setPostInfo] = useState({post: {}, author: {}})
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddComment, setShowAddComment] = useState(false)

  const { post, author} = postInfo

  useEffect(() => {
    const fetchFromAPI = async () => {
      
      const postResponse = await axios.get(SERVER_URL + `/post/${id}`)
      const authorResponse = await axios.get(`http://localhost:8888/users/user/${postResponse.data.author}`)

      setPostInfo({post: postResponse.data, author: authorResponse.data})
      setLoading(false)
    }

    fetchFromAPI()
  }, [comments])

  const handleLikePost = async () => {

    if (Object.keys(loggedInUser).length === 0) {
      history.push('/login')
      return
    }

    const body = { userID: loggedInUser._id}
    const response = await axios.put(`http://localhost:8888/posts/post/like/${post._id}`, body)

    setPostInfo({...postInfo, post: response.data.updatedPost})
    setLoggedInUser(response.data.updatedUser)

  }

  const handleDislikePost = async () => {

    if (Object.keys(loggedInUser).length === 0) {
      history.push('/login')
      return
    }

    const body = { userID: loggedInUser._id}
    const response = await axios.put(`http://localhost:8888/posts/post/dislike/${post._id}`, body)

    setPostInfo({...postInfo, post: response.data.updatedPost})
    setLoggedInUser(response.data.updatedUser)
  }

  const handleDeletePost = async () => {
    console.log('deleting...')

    const confirmDelete = window.confirm("Are you sure? This action is irreversible!")

    if (confirmDelete && Object.keys(loggedInUser).length > 0) {
      const response = await axios.delete(`${SERVER_URL}/post/${id}`)
      console.log(response.data)
      history.push('/')
    }
  }

  console.log(author)
  console.log(loggedInUser)
  console.log(author._id === loggedInUser._id)

  return (
    <div>
      {loading ? 'Loading...' : (
        <div className="postContainer">
      
          {post.headerImage ? (
              <div className="headerImage">
                <img src={IMAGES_LOCATION + post.headerImage} alt={post.title}/>
              </div>
            ) : null}
    
            <div className="postTitle">
              {post.title}
            </div>
    
            <div className="postInfo">
              <div className="authorAndDate">
                <span className="author">{author.firstName} {author.lastName}</span>
                <span>{moment(post.createdAt).format('MMMM Do, YYYY')}</span>
              </div>

              <div className="postVotes">
                <div><i className={`fas fa-thumbs-up ${Object.keys(loggedInUser).length > 0 && loggedInUser.likedPosts && loggedInUser.likedPosts.includes(post._id) ? 'liked' : null}`} onClick={handleLikePost}></i></div>
                <div className="postVotesNum">{(post.likes && post.dislikes && post.likes.length - post.dislikes.length) || 0}</div>
                <div><i className={`fas fa-thumbs-down ${Object.keys(loggedInUser).length > 0 && loggedInUser.dislikedPosts && loggedInUser.dislikedPosts.includes(post._id) ? 'disliked' : null}`} onClick={handleDislikePost}></i></div>
              </div>  
    
              <div>
                <span className="commentsIconContainer"><i class="far fa-comments"></i> {post.comments.length}</span>
                
              </div>
            </div>
            {author._id === loggedInUser._id ? (
              <div className="postActionIcons">
              <Link to={`/edit-post/${id}`}><i class="fas fa-edit"></i></Link>
              <span onClick={handleDeletePost}><i class="fas fa-trash"></i></span>
          </div>
            ) : null}
            
          <div className="postCommentsContainer">
            <div>
              {ReactHtmlParser(post.content)}
            </div>

            <div>Comments ({post.comments.length})</div>

            {Object.keys(loggedInUser).length < 1 ? (
              <Link to="/login" className="loginToAdd">Log in to add comment</Link>
            ) : <CommentContainer post={postInfo} setComments={setComments} showAddComment={showAddComment} setShowAddComment={setShowAddComment}/>}

    
            <div href='#comments' className="commentsContainer">
              {post.comments.map((commentID) => <Comment commentID={commentID} post={postInfo}/>)}
            </div>
          </div>
          
        </div>
      )}
    </div>
    
  )
}

export default Post;
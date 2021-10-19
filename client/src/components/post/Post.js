import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment'
import './Post.css'
import axios from 'axios';
import Comment from '../comment/Comment'
import CommentContainer from '../comment_container/CommentContainer';
import UserContext from '../../contexts/UserContext'

const Post = () => {

  const { id } = useParams()
  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)
  const SERVER_URL = 'http://localhost:8888/posts'
  const IMAGES_LOCATION = 'http://localhost:8888/images/'

  const [post, setPost] = useState({post: {}, author: {}})
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddComment, setShowAddComment] = useState(false)

  useEffect(() => {
    const fetchFromAPI = async () => {
      
      const postResponse = await axios.get(SERVER_URL + `/post/${id}`)
      const authorResponse = await axios.get(`http://localhost:8888/users/user/${postResponse.data.author}`)

      setPost({post: postResponse.data, author: authorResponse.data})
      setLoading(false)
    }

    fetchFromAPI()
  }, [comments])

  console.log('COMMENSTBCHD')
  console.log(post.post.comments)

  return (
    <div>
      {loading ? 'Loading...' : (
        <div className="postContainer">
      
          {post.post.headerImage ? (
              <div className="headerImage">
                <img src={IMAGES_LOCATION + post.post.headerImage} alt={post.post.title}/>
              </div>
            ) : null}
    
            <div className="postTitle">
              {post.post.title}
            </div>
    
            <div className="postInfo">
              <div className="authorAndDate">
                <span className="author">{post.author.firstName} {post.author.lastName}</span>
                <span>{moment(post.post.createdAt).format('MMMM Do, YYYY')}</span>
              </div>
    
              <div></div>
    
              <div>

                <span className="commentsIconContainer"><i class="far fa-comments"></i> {post.post.comments.length}</span>
                
              </div>
            </div>

            <div className="postActionIcons">
                <Link to={`/edit-post/${id}`}><i class="fas fa-edit"></i></Link>
                <span><i class="fas fa-trash"></i></span>
            </div>
            
            <div>
              {ReactHtmlParser(post.post.content)}
            </div>

            {Object.keys(loggedInUser).length < 1 ? (
              <Link to="/login" className="loginToAdd">Log in to add comment</Link>
            ) : <CommentContainer post={post} setComments={setComments} showAddComment={showAddComment} setShowAddComment={setShowAddComment}/>}

    
            <div className="commentsContainer">
              {post.post.comments.map((commentID) => <Comment commentID={commentID} post={post}/>)}
            </div>
          
        </div>
      )}
    </div>
    
  )
}

export default Post;
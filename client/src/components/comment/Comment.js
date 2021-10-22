import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import moment from 'moment'
import './Comment.css'
import axios from 'axios';
import CommentContainer from '../comment_container/CommentContainer';
import UserContext from '../../contexts/UserContext'


const Comment = ({ post, commentID, replyComment }) => {

  const history = useHistory()
  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)
  const SERVER_URL = 'http://localhost:8888/posts'
  const IMAGES_LOCATION = 'http://localhost:8888/images/'

  const [commentInfo, setCommentInfo] = useState({comment: {}, author: {}})
  const [replies, setReplies] = useState({})
  const [loading, setLoading] = useState(true)
  const [showReply, setShowReply] = useState(false)
  const { comment, author } = commentInfo

  useEffect(() => {
    const fetchFromAPI = async () => {
      const commentResponse = await axios.get(`http://localhost:8888/comments/comment/${commentID}`)
      const authorResponse = await axios.get(`http://localhost:8888/users/user/${commentResponse.data.author}`)
      setCommentInfo({comment: commentResponse.data, author: authorResponse.data})
      setLoading(false)
    }

    fetchFromAPI()
  }, [replies])

  const handleLikeComment = async () => {

    if (Object.keys(loggedInUser).length === 0) {
      history.push('/login')
      return
    }

    const body = { userID: loggedInUser._id}
    const response = await axios.put(`http://localhost:8888/comments/comment/like/${comment._id}`, body)

    setCommentInfo({...commentInfo, comment: response.data.updatedComment})
    setLoggedInUser(response.data.updatedUser)

  }

  const handleDislikeComment = async () => {

    if (Object.keys(loggedInUser).length === 0) {
      history.push('/login')
      return
    }

    const body = { userID: loggedInUser._id}
    const response = await axios.put(`http://localhost:8888/comments/comment/dislike/${comment._id}`, body)

    setCommentInfo({...commentInfo, comment: response.data.updatedComment})
    setLoggedInUser(response.data.updatedUser)

  }

  return (
    <div>

      {loading ? 'Loading...' : (
        comment.replyingTo && !replyComment ? null :
        <div className={`commentContainer ${replyComment ? 'replyComment' : ''}`}>
          <div className="topCommentInfo">
            {author.profilePic ? (
              <img src={IMAGES_LOCATION + author.profilePic} alt={`${author.firstName} ${author.lastName} Profile Pic`} className="profilePicImageSmall"/>
            ) : null}
            <Link to={`/author/${author._id}`} className="commentAuthor">{author.firstName} {author.lastName}</Link>
            <span className="fromNowTime">{moment(comment.createdAt).fromNow()}</span>
            <span className="commentLikes">{comment.likes.length - comment.dislikes.length} {(comment.likes.length - comment.dislikes.length) === 1 || (comment.likes.length - comment.dislikes.length) === -1 ? 'like' : 'likes'}</span>
          </div>
          
          <div className="commentContent">
            {comment.content}
          </div>

          <div className="commentActions">
            <span>
              <i className={`fas fa-thumbs-up ${Object.keys(loggedInUser).length > 0 && loggedInUser.likedComments && loggedInUser.likedComments.includes(comment._id) ? 'liked' : null}`} onClick={handleLikeComment}></i>
              <span className="commentUpvotes">{comment.likes.length - comment.dislikes.length}</span>
              <i className={`fas fa-thumbs-down ${Object.keys(loggedInUser).length > 0 && loggedInUser.dislikedComments && loggedInUser.dislikedComments.includes(comment._id) ? 'disliked' : null}`} onClick={handleDislikeComment}></i>
            </span>
            <span>
              <i class="fas fa-reply" onClick={() => setShowReply(true)}></i>
            </span>
          </div>
          

          <CommentContainer post={post} parentComment={commentInfo} showReply={showReply} setShowReply={setShowReply} setReplies={setReplies}/>

          {comment.replies.map((commentID) => {
            return (
              <Comment post={post} commentID={commentID} replyComment={true}/>
              
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Comment;
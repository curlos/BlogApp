import React, { useState, useEffect } from 'react'
import moment from 'moment'
import './Comment.css'
import axios from 'axios';
import CommentContainer from '../comment_container/CommentContainer';


const Comment = ({ post, commentID, replyComment }) => {

  const SERVER_URL = 'http://localhost:8888/posts'
  const [comment, setComment] = useState({comment: {}, author: {}})
  const [replies, setReplies] = useState({})
  const [loading, setLoading] = useState(true)
  const [showReply, setShowReply] = useState(false)

  useEffect(() => {
    const fetchFromAPI = async () => {
      const commentResponse = await axios.get(`http://localhost:8888/comments/comment/${commentID}`)
      const authorResponse = await axios.get(`http://localhost:8888/users/user/${commentResponse.data.author}`)
      setComment({comment: commentResponse.data, author: authorResponse.data})
      setLoading(false)
    }

    fetchFromAPI()
  }, [replies])

  console.log(comment)

  return (
    <div>

      {loading ? 'Loading...' : (
        comment.comment.replyingTo && !replyComment ? null :
        <div className={`commentContainer ${replyComment ? 'replyComment' : ''}`}>
          <div className="topCommentInfo">
            <span className="commentAuthor">{comment.author.firstName} {comment.author.lastName}</span>
            <span className="fromNowTime">{moment(comment.comment.createdAt).fromNow()}</span>
            <span className="commentLikes">{comment.comment.likes.length} likes</span>
          </div>
          
          <div className="commentContent">
            {comment.comment.content}
          </div>

          <div className="commentActions">
            <span>
              <i class="far fa-heart"></i> {comment.comment.likes.length}
            </span>
            <span>
              <i class="fas fa-reply" onClick={() => setShowReply(true)}></i>
            </span>
          </div>
          

          <CommentContainer post={post} parentComment={comment} showReply={showReply} setShowReply={setShowReply} setReplies={setReplies}/>

          {comment.comment.replies.map((commentID) => {
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
import React, { useState } from 'react'
import axios from 'axios'
import './CommentContainer.css'
import UserContext from '../../contexts/UserContext'

const CommentContainer = ({ post, parentComment, setComments, showAddComment, setShowAddComment, showReply, setShowReply, setReplies }) => {
  const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}/comments/comment`
  // eslint-disable-next-line no-unused-vars
  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)
  const parentAuthor = parentComment && `@${parentComment.author.firstName} ${parentComment.author.lastName} `
  const [sendingAPIRequest, setSendingAPIRequest] = useState(false)

  const [commentText, setCommentText] = useState(parentComment ? parentAuthor : '')

  const handleChangeReply = (e) => {
    if (e.target.value.length >= parentAuthor.length) {
      setCommentText(e.target.value)
    }
  }

  const handleChangeParent = (e) => {
    setCommentText(e.target.value)
  }


  const postComment = async () => {
    try {
      setSendingAPIRequest(true)
    
      const body = {
        content: commentText,
        author: loggedInUser._id,
        post: post.post._id,
        replies: [],
        likes: []
      }
      console.log(SERVER_URL)
      console.log(body)

      const response = await axios.post(SERVER_URL, body)

      console.log(response)

      setComments([...post.post.comments, response.data._id])
      setSendingAPIRequest(false)
      setCommentText('')
      setShowAddComment(false)
    } catch (err) {
      console.log(err)
      setSendingAPIRequest(false)
    }
  }

  const replyToComment = async () => {
    console.log(`PARENT`)
    console.log(parentComment)
    console.log(post)

    const body = {
      content: commentText,
      author: loggedInUser._id,
      post: post.post._id,
      replyingTo: parentComment.comment._id,
      replies: [],
      likes: []
    }
    console.log(body)
    const response = await axios.post(SERVER_URL + '/reply', body)
    console.log(response)
    console.log(response.data)

    setReplies([...parentComment.comment.replies])
    setCommentText(parentAuthor)
    setShowReply(false)
  }

  const getAddCommentButton = () => {
    if (parentComment) {
      return <button className={`reply ${sendingAPIRequest && 'animate-pulse'}`} onClick={replyToComment}>Reply</button>
    }

    return <button className={`post ${sendingAPIRequest && 'animate-pulse'}`} onClick={postComment}>Post</button>
  }

  const getCommentContainer = () => {
    if (parentComment) {
      return (
        showReply ?
          <div className="newCommentContainer">
            <textarea value={commentText} onChange={handleChangeReply}></textarea>
            <div className="newCommentActionButtons">
              <button className="cancel" onClick={() => {setShowReply(false) && setCommentText(parentAuthor)}}>Cancel</button>
              {getAddCommentButton()}
            </div>
          </div> : null
      )
    } else {
      return (
        showAddComment ? <div className="newCommentContainer">
          <textarea placeholder="Add a comment..." className="commentTextArea" value={commentText} onChange={handleChangeParent}></textarea>
          <div className="newCommentActionButtons">
            <button className="cancel" onClick={() => {setShowAddComment(false) && setCommentText('')}}>Cancel</button>
            {getAddCommentButton()}
          </div>
        </div> : (
          <textarea placeholder="Add a comment..." onFocus={() => setShowAddComment(true)} className="commentTextArea miniTextArea"></textarea>
        )
      )
    }
  }
  
  return (
    getCommentContainer()
  )
}

export default CommentContainer;
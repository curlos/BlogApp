import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Link, useHistory, useParams } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import Comment from '../comment/Comment';
import CommentContainer from '../comment_container/CommentContainer';
import Skeleton from '../skeleton/Skeleton';
import './Post.css';
// import { sortByMostLikes, sortByMostReplies, sortByNewest, sortByOldest } from './sortHelper';

const Post = () => {

  const { id } = useParams()
  const history = useHistory()
  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)
  const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}/posts`
  const IMAGES_LOCATION = `${process.env.REACT_APP_SERVER_URL}/images/`

  const [postInfo, setPostInfo] = useState({post: {}, author: {}, comments: []})
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddComment, setShowAddComment] = useState(false)
  const [imageError, setImageError] = useState(false)
  // const [sortFilter, setSortFilter] = useState('Likes')
  
  const { post, author } = postInfo

  useEffect(() => {
    const fetchFromAPI = async () => {
      
      const postResponse = await axios.get(SERVER_URL + `/post/${id}`)
      const authorResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/user/${postResponse.data.author}`)
      const newComments = await getComments(postResponse.data.comments)

      setPostInfo({post: postResponse.data, author: authorResponse.data, comments: newComments})
      setLoading(false)
    }

    fetchFromAPI()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments])

  const getComments = async (commentIDs) => {
    const comments = []
    for (let commentID of commentIDs) {
      const commentResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/comments/comment/${commentID}`)

      comments.push(commentResponse.data)
    }

    return comments
    
  }

  // const getSortedComments = (comments) => {
  //   switch (sortFilter) {
  //     case 'newest':
  //       return sortByNewest(comments)
  //     case 'oldest':
  //       return sortByOldest(comments)
  //     case 'likes':
  //       return sortByMostLikes(comments)
  //     case 'replies':
  //       return sortByMostReplies(comments)
  //     default:
  //       return comments
  //   }
  // }

  const handleLikePost = async () => {

    if (Object.keys(loggedInUser).length === 0) {
      history.push('/login')
      return
    }

    const body = { userID: loggedInUser._id}
    const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/posts/post/like/${post._id}`, body)

    setPostInfo({...postInfo, post: response.data.updatedPost})
    setLoggedInUser(response.data.updatedUser)

  }

  const handleDislikePost = async () => {

    if (Object.keys(loggedInUser).length === 0) {
      history.push('/login')
      return
    }

    const body = { userID: loggedInUser._id}
    const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/posts/post/dislike/${post._id}`, body)

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


  return (
    <div>
      {loading ? <Skeleton type="fullPost" /> : (
        <div className="postContainer">
      
          {post.headerImage && !imageError ? (
              <div className="headerImage">
                <img src={IMAGES_LOCATION + post.headerImage} alt={post.title} onError={() => setImageError(true)}/>
              </div>
            ) : null}
    
            <div className="postTitle">
              {post.title}
            </div>
    
            <div className="postInfo">
              <div className="authorAndDate">
                <Link to={`/author/${author._id}`}>
                  {author.profilePic ? (
                    <img src={IMAGES_LOCATION + author.profilePic} alt={`${author.firstName} ${author.lastName} Profile Pic`} className="profilePicImageSmall"/>
                  ) : <img src={IMAGES_LOCATION + 'default_user.jpeg'} alt={`${author.firstName} ${author.lastName} Profile Pic`} className="profilePicImageSmall"/>}
                </Link>

                <Link to={`/author/${author._id}`}>
                  <span className="author">{author.firstName} {author.lastName}</span>
                </Link>
                
                <span className="postDate">{moment(post.createdAt).format('MMMM Do, YYYY')}</span>
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

            <span>
              <span className="dropdown">
              {/* <div className="sortCommentContainer">Sort By: {sortFilter} <i class="fas fa-sort-down"></i></div> */}

                <div class="dropdown-content">
                  <Link to={`/author/${loggedInUser._id}`}>My Profile</Link>
                  <Link to="/settings">Settings</Link>
                  
                </div>
              </span>

              </span>

    
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
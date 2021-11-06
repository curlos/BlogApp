import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import './UserProfile.css'
import axios from "axios";
import SmallPost from '../small_post/SmallPost'
import SamllComment from '../small_comment/SmallComment'
import Skeleton from "../skeleton/Skeleton";

const UserProfile = () => {
  
  const { id } = useParams()
  const IMAGES_LOCATION = 'http://localhost:8888/images/'

  const [user, setUser] = useState({userInfo: {}, posts: [], comments: []})
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('POSTS')
  
  useEffect(() => {
    const fetchFromAPI = async () => {
      const response = await axios.get(`http://localhost:8888/users/user/${id}`)
      const userPosts = await getAllUserPosts(response.data.posts)
      const userComments = await getAllUserComments(response.data.comments)
      const userCommentsWithFullPost = await getCommentsWithFullPost(userComments)

      setUser({userInfo: response.data, posts: [...userPosts], comments: [...userCommentsWithFullPost]})
      setLoading(false)
    }

    fetchFromAPI()
  }, [])

  const getAllUserPosts = async (postIDs) => {
    const allUserPosts = []

    for (let postID of postIDs) {
      const response = await axios.get(`http://localhost:8888/posts/post/${postID}`)
      allUserPosts.push(response.data)
    }

    return allUserPosts
  }

  const getAllUserComments = async (commentIDs) => {
    const allUserComments = []

    for (let commentID of commentIDs) {
      const response = await axios.get(`http://localhost:8888/comments/comment/${commentID}`)
      allUserComments.push(response.data)
    }

    return allUserComments
  }

  const getCommentsWithFullPost = async (comments) => {
    const newComments = []
    for (let comment of comments) {

      const response = await axios.get(`http://localhost:8888/posts/post/${comment.post}`)
      newComments.push({...comment, post: response.data})
    }

    return newComments
  }

  console.log(user)



  return (
    <div>
      {loading ? <Skeleton type="userProfile"/> : (
        <div className="userProfilePage">
          <div className="userInfo">
            {user.userInfo.profilePic ? (
              <div>
                <img src={IMAGES_LOCATION + user.userInfo.profilePic} alt={`${user.userInfo.firstName} ${user.userInfo.lastName} Profile Pic`} className="profilePicImg"/>
              </div>
            ) : <div>
                  <img src={IMAGES_LOCATION + 'default_user.jpeg'} alt={`${user.userInfo.firstName} ${user.userInfo.lastName} Profile Pic`} className="profilePicImg"/>
                </div>}
            <div className="firstAndLastName">{user.userInfo.firstName} {user.userInfo.lastName}</div>
            <div>{user.userInfo.aboutMe}</div>
          </div>

          <div className="userNavbar">
            <span className={selectedType === 'OVERVIEW' ? 'selected' : null} onClick={() => setSelectedType('OVERVIEW')}>Overview</span>
            <span className={selectedType === 'POSTS' ? 'selected' : null} onClick={() => setSelectedType('POSTS')}>Posts</span>
            <span className={selectedType === 'COMMENTS' ? 'selected' : null} onClick={() => setSelectedType('COMMENTS')}>Comments</span>
          </div>
    
          {selectedType === 'OVERVIEW' || selectedType === 'POSTS' ? (
            <div className="userPosts">
              {user.posts.map((post) => {
                console.log(post)

                if (!post) {
                  return null
                }

                return (
                  <SmallPost postID={post._id} />
                )
              })}
            </div>
          ) : null}

          {selectedType === 'OVERVIEW' || selectedType === 'COMMENTS' ? (
            <div className="userComments">
            {user.comments.map((comment) => {
              return (
                <SamllComment comment={comment} post={comment.post} />
              )
            })}
          </div>
          ) : null}
        </div>
      )}
    </div>
    
  )
}

export default UserProfile;
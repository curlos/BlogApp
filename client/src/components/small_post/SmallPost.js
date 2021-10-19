import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './SmallPost.css'

const SmallPost = ({post}) => {

  const [author, setAuthor] = useState({})

  useEffect(() => {
    const fetchFromAPI = async () => {
      const response = await axios.get(`http://localhost:8888/users/user/${post.author}`)
      setAuthor(response.data)
    }

    fetchFromAPI()
  }, [])

  console.log(author)

  return (
    <Link to={`/post/${post._id}`} className="smallPostContainer">
      <div className="imageContainer">
        <img src={post.headerImage || 'https://cdn.theathletic.com/app/uploads/2019/02/03234241/USATSI_12105980-e1549255831654-1024x683.jpg'} alt={post.title} />
      </div>

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
  )
}

export default SmallPost;
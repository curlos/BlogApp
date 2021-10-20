import { Link } from "react-router-dom";
import moment from 'moment'
import './SmallComment.css'

const SmallComment = ({ comment, post }) => {
  
  return (
    <Link to={`/post/${post._id}`}>
      <div className="smallCommentContainer">
        <div className="smallCommentHeader">
          <span>{post.title}</span>
          <span className="smallCommentFromNow">{moment(comment.createdAt).fromNow()}</span>
        </div>

        <div>
          {comment.content}
        </div>

        <div>
          <span><i class="far fa-heart"></i> {comment.likes.length}</span>
        </div>
      </div>
    </Link>
    
  )
}

export default SmallComment;
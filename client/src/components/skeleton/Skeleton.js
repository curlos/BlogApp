import React from "react";
import "./skeleton.css";

export default function Skeleton({ type }) {
  const SmallPostSkeleton = () => (
    <div className="postSk">
      <div className="postSkLikesDislikes"></div>
      <div className="postSkImg"></div>
      <div className="postSkInfo">
        <div className="postSkDetail">
          <div className="postSkText"></div>
          <div className="postSkText sm"></div>
        </div>
      </div>
    </div>
  );

  const FullPostSkeleton = () => (
    <div className="fullPostSk">
      <div className="fullPostSkImg"></div>
      <div className="fullPostSkInfo">
        <div className="fullPostSkDetail">
          <div className="fullPostSkTitle"></div>
          <div className="fullPostSkTitle sm"></div>
          <div className="fullPostSkText sm"></div>
        </div>
      </div>

      <div className="fullPostSkMoreDetails">
        <div className="fullPostSkAuthor">
          <div className="fullPostSkIcon"></div>
          <div className="fullPostSkAuthorDetail"></div>
          <div className="fullPostSkAuthorDetail"></div>
        </div>

        <div className="fullPostSkAuthor right">
          <div className="fullPostSkFeedback"></div>
        </div>
      </div>

      <div className="fullPostSkContent">
        <div className="fullPostSkContentLine"></div>
        <div className="fullPostSkContentLine"></div>
        <div className="fullPostSkContentLine"></div>
        <div className="fullPostSkContentLine"></div>
        <div className="fullPostSkContentLine"></div>
        <div className="fullPostSkContentLine"></div>
        <div className="fullPostSkContentLine"></div>
        <div className="fullPostSkContentLine"></div>
        <div className="fullPostSkContentLine sm"></div>
      </div>

      <div className="fullPostSkNewCommentsContainer">
        <div className="fullPostSkCommentsNum"></div>
        <div className="fullPostSkCommentContainer"></div>
      </div>
    </div>
  );

  const CommentSkeleton = () => {

    return (
      <div className={`commentSk ${type === 'commentReply' ? 'skReply' : ''}`}>
        <div className="commentSkIcon"></div>
        <div className="commentSkInfo">
          <div className="commentSkDetails"></div>
          <div className="commentSkContent"></div>
          <div className="commentSkContent"></div>
          <div className="commentSkContent"></div>
          <div className="commentSkContent sm"></div>
          <div className="commentSkActions"></div>
        </div>
      </div>
    )
  }



  if (type === "smallPost") return <SmallPostSkeleton />;
  if (type === "fullPost") return <FullPostSkeleton />
  if (type === "comment") return <CommentSkeleton />
  if (type === "commentReply") return <CommentSkeleton />
}
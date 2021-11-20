export const sortByNewest = (postsToFilter) => {
  return postsToFilter.sort((postOne, postTwo) => (postOne.createdAt > postTwo.createdAt ? -1 : 1))
}

export const sortByOldest = (postsToFilter) => {
  return postsToFilter.sort((postOne, postTwo) => (postOne.createdAt > postTwo.createdAt ? 1 : -1))
}

export const sortByMostLikes = (postsToFilter) => {
  return postsToFilter.sort((postOne, postTwo) => {
    const postOneTotalLikes = postOne.likes.length - postOne.dislikes.length
    const postTwoTotalLikes = postTwo.likes.length - postTwo.dislikes.length

    return (
      (postOneTotalLikes > postTwoTotalLikes ? -1 : 1)
    )
  })
}

export const sortByMostReplies = (postsToFilter) => {
  return postsToFilter.sort((postOne, postTwo) => (postOne.comments.length > postTwo.comments.length ? -1 : 1))
}
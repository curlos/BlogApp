export const sortByNewest = (objects) => {
  return objects.sort((objectOne, objectTwo) => (objectOne.createdAt > objectTwo.createdAt ? -1 : 1))
}

export const sortByOldest = (objects) => {
  return objects.sort((objectOne, objectTwo) => (objectOne.createdAt > objectTwo.createdAt ? 1 : -1))
}

export const sortByMostLikes = (objects) => {
  return objects.sort((objectOne, objectTwo) => {
    const objectOneTotalLikes = objectOne.likes.length - objectOne.dislikes.length
    const objectTwoTotalLikes = objectTwo.likes.length - objectTwo.dislikes.length

    return (
      (objectOneTotalLikes > objectTwoTotalLikes ? -1 : 1)
    )
  })
}

export const sortByMostReplies = (postsToFilter) => {
  return postsToFilter.sort((postOne, postTwo) => (postOne.comments.length > postTwo.comments.length ? -1 : 1))
}
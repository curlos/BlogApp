import React, { useState } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'
import './PostForm.css'

const PostForm = () => {

  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)
  const history = useHistory()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState(Object.keys(loggedInUser).length > 0 && loggedInUser._id)
  const [editorContent, setEditorContent] = useState()
  const categories = ['TECH', 'LIFE', 'SPORTS', 'ART', 'FOOD', 'DIY', 'HEALTH', 'FITNESS']
  const selectedCategories = []

  const handleEditorChange = (e) => {
    console.log(e.target.getContent())
    setEditorContent(e.target.getContent())
  }

  const handleCheck = (e) => {
    if (e.target.checked) {
      selectedCategories.push(e.target.value)
    } else {
      const indexToRemove = selectedCategories.indexOf(e.target.value)
      selectedCategories.splice(indexToRemove, 1)
    }

    console.log(selectedCategories)
  }

  const handlePostArticle = async () => {
    const body = {
      title,
      author,
      headerImage: 'https://cdn.theathletic.com/app/uploads/2021/10/18090030/GettyImages-1324455754-scaled-e1634562066494.jpg',
      categories: selectedCategories,
      content: editorContent,
      comments: []
    }

    console.log(body)
    const response = await axios.post('http://localhost:8888/posts', body)
    console.log(response.data)
  }

  if (Object.keys(loggedInUser).length < 1) {
    history.push('/login')
  }

  return (
    <div className="postFormContainer">
      <div>Title: </div>
      <input onChange={(e) => setTitle(e.target.value)} value={title}></input>

      <div>Header Image: </div>
      <input type="file" />

      <div>Categories:</div>
      <div className="categoriesContainer">
        {categories.map((category) => {
          return (
            <div>
              <input type="checkbox" id={category} name={category} value={category} onClick={handleCheck}/>
              <label for={category}>{category}</label>
            </div>
          )
        })}
      </div>

      <Editor
        initialValue="<p>Initial content</p>"
        init={{
          height: 500,
          plugins: [
            'advlist autolink lists link image', 
            'charmap print preview anchor help',
            'searchreplace visualblocks code',
            'insertdatetime media table paste wordcount image'
          ],
          menubar: 'file edit view insert format tools table tc help',
          toolbar:
            'undo redo | formatselect | bold italic | \
            alignleft aligncenter alignright | \
            bullist numlist outdent indent | help'
        }}
        onChange={handleEditorChange}
        className="editor"
      />
      
      <button className="postArticleButton" onClick={handlePostArticle}>Post Article</button>
    </div>

  )
}

export default PostForm;
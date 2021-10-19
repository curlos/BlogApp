import React, { useEffect, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios'
import { useParams, useHistory } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'
import './PostForm.css'

const PostForm = () => {

  const { loggedInUser } = React.useContext(UserContext)
  const history = useHistory()
  const { id } = useParams()
  const IMAGES_LOCATION = 'http://localhost:8888/images/'

  const [newPost, setNewPost] = useState({
    title: '',
    author: Object.keys(loggedInUser).length > 0 && loggedInUser._id,
    editorContent: '',
    file: null,
    selectedCategories: []
  })

  const categories = ['TECH', 'LIFE', 'SPORTS', 'ART', 'FOOD', 'DIY', 'HEALTH', 'FITNESS']

  useEffect(() => {
    const fetchFromAPI = async () => {
      const response = await axios.get(`http://localhost:8888/posts/post/${id}`)
      console.log(response.data)
      setNewPost({
        ...newPost,
        title: response.data.title,
        editorContent: response.data.content,
        file: response.data.headerImage,
        selectedCategories: response.data.categories
      })
    }

    if (id) {
      fetchFromAPI()
    }
  }, [])

  const handleEditorChange = (e) => {
    console.log(e.target.getContent())
    setNewPost({...newPost, editorContent: e.target.getContent()})
  }

  const handleCheck = (e) => {

    console.log(newPost)
    console.log(e.target.checked)
    if (e.target.checked) {
      setNewPost({...newPost, selectedCategories: [...newPost.selectedCategories, e.target.value]})
      
    } else {
      const newSelectedCategories = newPost.selectedCategories.filter((category) => category !== e.target.value)

      setNewPost({...newPost, selectedCategories: newSelectedCategories})
    }
  }

  const handlePostArticle = async () => {

    if (!newPost.title) {
      return
    }
    
    const body = {
      title: newPost.title,
      author: newPost.author,
      categories: newPost.selectedCategories,
      content: newPost.editorContent,
      comments: []
    }
    

    if (newPost.file) {
      const data = new FormData()
      const filename = Date.now() + newPost.file.name
      data.append('name', filename)
      data.append('file', newPost.file)
      body.headerImage = filename

      try {
        const response = await axios.post('http://localhost:8888/upload', data)

        console.log(response)
      } catch (err) {
        console.log(err)
        return
      }
    }

    console.log(body)
    const response = await axios.post('http://localhost:8888/posts', body)
    console.log(response.data)
  }

  if (Object.keys(loggedInUser).length < 1) {
    history.push('/login')
  }

  const handleEditArticle = async () => {
    const body = {
      title: newPost.title,
      author: newPost.author,
      headerImage: typeof newPost.file === 'object' ? newPost.file.name : newPost.file,
      categories: newPost.selectedCategories,
      content: newPost.editorContent,
    }
    console.log(newPost)
    console.log(body)
    const response = await axios.put(`http://localhost:8888/posts/post/${id}`, body)
    console.log(response.data)
  }

  console.log(newPost)

  return (
    <div className="postFormContainer">
      {(newPost.file || newPost.headerImage) && (
        <img className="writeImg" src={typeof newPost.file === 'string' && newPost.file ? IMAGES_LOCATION + newPost.file : URL.createObjectURL(newPost.file)} alt="" />
      )}
      <div>Title: </div>
      <input onChange={(e) => setNewPost({...newPost, title: e.target.value})} value={newPost.title}></input>

      <div>Header Image: </div>
      <input 
        type="file" 
        id="fileInput" 
        onChange={(e) => setNewPost({...newPost, file: e.target.files[0]})}
      />

      <div>Categories:</div>
      <div className="categoriesContainer">
        {categories.map((category) => {
          return (
            <div>
              <input type="checkbox" id={category} name={category} value={category} onClick={handleCheck} checked={newPost.selectedCategories.includes(category)}/>
              <label for={category}>{category}</label>
            </div>
          )
        })}
      </div>

      <Editor
        initialValue={newPost.editorContent}
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

      {id ? (
        <button className="editArticleButton" onClick={handleEditArticle}>Update Article</button>
      ) : (
        <button className="postArticleButton" onClick={handlePostArticle}>Post Article</button>
      )}
    </div>

  )
}

export default PostForm;
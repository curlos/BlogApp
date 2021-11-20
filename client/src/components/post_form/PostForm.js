import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import { postImage } from '../../utils/postImage'
import './PostForm.css';

const PostForm = () => {

  const { loggedInUser } = React.useContext(UserContext)
  const history = useHistory()
  const { id } = useParams()
  const IMAGES_LOCATION = `${process.env.REACT_APP_SERVER_URL}/images/`

  const [newPost, setNewPost] = useState({
    title: '',
    author: Object.keys(loggedInUser).length > 0 && loggedInUser._id,
    editorContent: '',
    file: null,
    headerImage: '',
    selectedCategories: []
  })

  const categories = ['TECH', 'LIFE', 'SPORTS', 'ART', 'FOOD', 'DIY', 'HEALTH', 'FITNESS']

  useEffect(() => {
    const fetchFromAPI = async () => {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts/post/${id}`)
      console.log(response.data)
      setNewPost({
        ...newPost,
        title: response.data.title,
        editorContent: response.data.content,
        headerImage: response.data.headerImage,
        selectedCategories: response.data.categories
      })

    }

    if (id) {
      fetchFromAPI()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEditorChange = (newValue, editor) => {
    console.log('sup')
    console.log(newValue)
    setNewPost({...newPost, editorContent: newValue})
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

    let headerImage = null

    if (newPost.file) {
      try {
        const response = await postImage(newPost.file)
        headerImage = response.imagePath

        console.log(headerImage)
      } catch (err) {
        console.log(err)
        return
      }
    }
    
    const body = {
      title: newPost.title,
      author: newPost.author,
      categories: newPost.selectedCategories,
      content: newPost.editorContent,
      headerImage: headerImage,
      comments: []
    }
    

    console.log(body)
    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/posts`, body)
    console.log(response.data)

    history.push('/login')
  }

  if (Object.keys(loggedInUser).length < 1) {
    history.push('/login')
  }

  const handleEditArticle = async () => {
    const body = {
      title: newPost.title,
      author: newPost.author,
      headerImage: newPost.headerImage || (newPost.file && newPost.file.name),
      categories: newPost.selectedCategories,
      content: newPost.editorContent,
    }

    if (newPost.file) {
      const data = new FormData()
      const filename = Date.now() + newPost.file.name
      data.append('name', filename)
      data.append('file', newPost.file)
      body.headerImage = filename

      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/upload`, data)

        console.log(response)
      } catch (err) {
        console.log(err)
        return
      }
    }
    
    const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/posts/post/${id}`, body)
    console.log(response)

    history.push('/')
  }

  console.log(newPost)

  return (
    <div className="postFormContainer">
      {(newPost.file || newPost.headerImage) && (
        <img className="writeImg" src={newPost.file ? URL.createObjectURL(newPost.file) : IMAGES_LOCATION + newPost.headerImage } alt="" />
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
              <input type="checkbox" id={category} name={category} value={category} checked={newPost.selectedCategories.includes(category)} onClick={handleCheck}/>
              <label for={category}>{category}</label>
            </div>
          )
        })}
      </div>

      <Editor
        initialValue={'<p>Initial Content</p>'}
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
            // eslint-disable-next-line no-multi-str
            'undo redo | formatselect | bold italic | \
            alignleft aligncenter alignright | \
            bullist numlist outdent indent | help'
        }}
        value={newPost.editorContent}
        onEditorChange={handleEditorChange}
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
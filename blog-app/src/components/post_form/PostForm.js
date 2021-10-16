import React, { useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'; 
import './PostForm.css'

const PostForm = () => {

  const [editorContent, setEditorContent] = useState()

  const handleEditorChange = (e) => {
    console.log(e.target.getContent())
    setEditorContent(e.target.getContent())
  }

  return (
    <div className="postFormContainer">
      <div>Title: </div>
      <input></input>

      <div>Header Image: </div>
      <input type="file" />

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
    </div>

  )
}

export default PostForm;
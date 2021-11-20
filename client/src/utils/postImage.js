import axios from "axios"

export const postImage = async (image) => {
  const formData = new FormData()
  formData.append('image', image)

  console.log(formData)

  const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return response.data
}
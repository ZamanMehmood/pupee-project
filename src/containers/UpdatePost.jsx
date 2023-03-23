import React, { useEffect, useState } from 'react'
import {
  addUpdateData,
  getAllData,
  getDataById,
  updateRecord,
  uploadSingleFile,
} from '../backend/utility'
import { Input, message, Spin, Switch } from 'antd'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Toast } from 'primereact/toast';

const UpdatePost = (props) => {
  const urlPathName = window.location.pathname.split('/')
  const postId = urlPathName[urlPathName.length - 1]
  const [postDetails, setPostDetails] = useState({
    number_of_Comments: '',
    numberOfDisLikes: '',
    whoDisLikes: [],
    numberOfLikes: '',
    whoLikes: [],
    post_videos: [],
    post_images: [],
    tag_products: [],
    music: {},
    allow_comments: '',
    add_caption: '',
    userId: '',
    timestamp: '',
    my_list: [],
    privacy: {},
    blocked: '',
    short_id: '',
  })
  useEffect(() => {
    getpostDetails()
  }, [])

  const [isLoading, setIsLoading] = useState(false)

  const getpostDetails = async () => {
    let result = await getAllData(`posts/${postId}`)
    if (result && result.success === true && result.statusCode === 200) {
      setPostDetails(result.data)
    }
  }

  const handleChange = (e) => {
    if (e.target.value) {
      setPostDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let body = {
      ...postDetails,
      postId: postDetails._id,
    }
    body.blocked = body.blocked === 'true' ? 'block' : 'unblock'
    body.blocked = body.blocked === 'false' ? 'unblock' : 'block'
    let result = await updateRecord('posts', body)
    if (result && result.success === true && result.data) {
      Swal.fire({
        title: 'Post Details Updated Successfully',
        icon: 'success',
        timer: 2000,
      })
    }
  }

  const handleFileUpload = async (e) => {
    e.persist()
    if (!e.target.files[0]) return
    const MIN_FILE_SIZE = 1024
    const MAX_FILE_SIZE = 5120
    if(e.target.files[0].size/1024/1024 > 5.12) {
      message.config({top: 70, duration: 3})
      message.error('The file size should be limited to 5mb', 3)
      return;
    } 
    // else {
    //   message.error('The file size should be limited to 5mb')
    // }
    setIsLoading(true)
    let result = await uploadSingleFile(e.target.files[0])
    setIsLoading(false)
    if (result && result.data.success === true) {
      const arr = [...postDetails.post_images]
      const newImage = {
        image_url: result.data.url,
      }
      arr.push(newImage)
      setPostDetails((prev) => ({
        ...prev,
        post_images: [...arr],
      }))
    }
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12 p-0">
        <h3>Post Details</h3>
        {postDetails && (
          <form onSubmit={handleSubmit}>
            <div className="col-12 row">
              <div className="col-12 col-md-6">
                <label>Date</label>
                <Input
                  value={new Date(postDetails.timestamp).toLocaleDateString()}
                />
              </div>
              <div className="col-12 col-md-6">
                <label>Caption</label>
                <Input
                  type={'text'}
                  name="add_caption"
                  value={postDetails.add_caption}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label>Number of Likes</label>
                <Input
                  type={'number'}
                  name="numberOfLikes"
                  value={postDetails.numberOfLikes}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label>Number of Dislikes</label>
                <Input
                  value={postDetails.numberOfDisLikes}
                  type={'number'}
                  name="numberOfDisLikes"
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label>No of Comments</label>
                <Input
                  value={postDetails.number_of_Comments}
                  type={'number'}
                  name="number_of_Comments"
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label>Username</label>
                <Input
                  value={postDetails}
                  type={'number'}
                  name="number_of_Comments"
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label>Post Status</label>
                <Input
                  value={postDetails.blocked}
                  type={'text'}
                  name="blocked"
                  // onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label>Change Post Status</label>
                <Switch
                  checked={postDetails.blocked === 'unblock' ? false : true}
                  onChange={(checked) => {
                    setPostDetails((prev) => ({
                      ...prev,
                      blocked: checked ? 'block' : 'unblock',
                    }))
                  }}
                />
              </div>
              {postDetails && postDetails.post_images && (
                <div className="col-12 p-0">
                  <div className="col-12">
                    <h5>Post Images</h5>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ width: '90px', marginLeft: '1rem' }}
                    />
                    {isLoading && (
                      <div className="w-100 d-flex align-items-center">
                        <Spin /> <p>Uploading ... </p>
                      </div>
                    )}
                  </div>
                  <div className="col-12 row mt-3 pb-5">
                    {postDetails.post_images &&
                      postDetails.post_images.map((item, index) => (
                        <div className="col-12 col-md-4 position-relative mt-2">
                          <span
                            className="fa fa-trash bg-white"
                            aria-hidden="true"
                            style={{
                              cursor: 'pointer',
                              position: 'absolute',
                              right: '9%',
                              top: '2%',
                              fontSize: '1rem',
                            }}
                            onClick={() => {
                              const arr = postDetails.post_images
                              arr.splice(index, 1)
                              setPostDetails((prev) => ({
                                ...prev,
                                post_images: [...arr],
                              }))
                            }}
                          ></span>
                          <img
                            src={item.image_url}
                            alt=""
                            key={item._id}
                            width={'100%'}
                            height={'100%'}
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    <div className="col-12 col-md-4"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="col-12 d-flex justify-content-between align-items-center flex-wrap mt-3">
              <Link to={'/posts'}>
                <button type="button" className="btn btn-primary">
                  Back
                </button>
              </Link>
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default UpdatePost

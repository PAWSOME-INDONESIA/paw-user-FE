const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const myHeaders2 = new Headers();
myHeaders2.append("Content-Type", "multipart/form-data");

const userUrl = "https://paw-user-yej2q77qka-an.a.run.app"
const imageUrl = "https://paw-image-yej2q77qka-an.a.run.app/image/upload"
const emailUrl = "https://paw-mail-yej2q77qka-an.a.run.app"

// USER
  export const doLogin = (body) => {
    const login  = fetch(userUrl + '/user/login', {
        method: 'POST',
        headers: myHeaders,
        body: body,
        redirect: 'follow'
    })
        .then(response => response.json())
        .then(result => {
            if(result.success === true){
                return result.data
            } else {
                return 'failed'
            }
        })
        .catch(error => console.log('error', error));

    return login
}
export const doRegister = (body) => {
  const register  = fetch(userUrl + '/user/register', {
    method: 'POST',
    headers: myHeaders,
    body: body,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data.user
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return register
}
export const doLogout = (id) => {
  let value = id;
  value = value.replace(/^"|"$/g, '');

  const logout  = fetch(userUrl + `/user/logout/${value}`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return 'success'
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return logout
}
export const getUser = (id) => {
  let value = id;
  value = value.replace(/^"|"$/g, '');

  const user  = fetch(userUrl + `/user/${value}`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data.user
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return user
}
export const findUserByUsername = (id) => {
  let value = id;
  value = value.replace(/^"|"$/g, '');

  const findUser  = fetch(userUrl + `/user/find?username=${value}`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data.users
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return findUser
}
export const editUser = (id, body) => {
  let value = id;
  value = value.replace(/^"|"$/g, '');

  const user  = fetch(userUrl + `/user/${value}/profile`, {
    method: 'PUT',
    headers: myHeaders,
    body: body,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data.user
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return user
}
export const getFollowers = (id) => {
  let value = id;
  value = value.replace(/^"|"$/g, '');

  const followers  = fetch(userUrl + `/user/${value}/followers`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        if(result.data.followers === null){
          return []
        } else {
          return result.data.followers
        }
      } else {
        return 'No Followers'
      }
    })
    .catch(error => console.log('error', error));

  return followers
}
export const getFollowings = (id) => {
  let value = id;
  value = value.replace(/^"|"$/g, '');

  const followings  = fetch(userUrl + `/user/${value}/followings`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        if(result.data.followings === null){
          return []
        } else{
          return result.data.followings
        }
      } else {
        return 'No Followings'
      }
    })
    .catch(error => console.log('error', error));

  return followings
}
export const checkUsernameUnique = (username) => {
  let value = username;
  value = value.replace(/^"|"$/g, '');

  const followings  = fetch(userUrl + `/user/find-by-exact-username?username=${value}`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        if(result.data.user.username === ""){
          return 'success'
        } else{
          return 'existed'
        }
      } else {
        return 'existed'
      }
    })
    .catch(error => console.log('error', error));

  return followings
}
export const checkEmailUnique = (email) => {
  let value = email;
  value = value.replace(/^"|"$/g, '');

  const followings  = fetch(userUrl + `/user/find-by-email?email=${value}`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        if(result.data.user.email === ""){
          return 'success'
        } else{
          return 'existed'
        }
      } else {
        return 'existed'
      }
    })
    .catch(error => console.log('error', error));

  return followings
}

// POST
export const getUserPost = (id, lastID) => {
  let value = id;
  value = value.replace(/^"|"$/g, '');

  const userPost  = fetch(userUrl + `/post/user-profile?userID=${value}&lastID=${lastID}&limit=12`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data.posts
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return userPost
}
export const deleteUserPost = (postId) => {
  let value = postId;
  value = value.replace(/^"|"$/g, '');

  const deletePost  = fetch(userUrl + `/post/${value}`, {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return 'success'
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return deletePost
}
export const postUserPost = (body) => {
  const uploadPost  = fetch(userUrl + '/post', {
    method: 'POST',
    headers: myHeaders,
    body: body,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data.post
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return uploadPost
}
export const getPostLikeCounter = (id) => {
  let value = id;
  value = value.replace(/^"|"$/g, '');

  const postLikeCounter  = fetch(userUrl + `/like/find-by-postID?postID=${value}`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return postLikeCounter
}
export const getCommentCount = (postId) => {
  let value = postId;
  value = value.replace(/^"|"$/g, '');

  const commentCount  = fetch(userUrl + `/comment/count?postID=${value}`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data.commentsCount
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return commentCount
}
export const getCommentText = (postId, lastId) => {
  let value = postId;
  value = value.replace(/^"|"$/g, '');

  const commentText  = fetch(userUrl + `/comment/by-post?postID=${value}&lastID=${lastId}&limit=5`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data.comments
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return commentText
}
export const postComment = (postId, userId) => {
  let value = postId;
  value = value.replace(/^"|"$/g, '');

  const commentPost  = fetch(userUrl + '/comment', {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data.comments
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return commentPost
}
export const editUserPost = (text, postId) => {
  const editUserPost  = fetch(userUrl + `/post/${postId}`, {
    method: 'PUT',
    headers: myHeaders,
    body: text,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data.post
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return editUserPost
}

// IMAGE
export const uploadImage = (image) => {
  const upload  = fetch(imageUrl, {
    method: 'POST',
    headers: myHeaders2,
    body: image,
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return upload
}

// PET
export const getPet = (id, wLocation) => {
  let value = id;
  let value2 = wLocation;
  value = value.replace(/^"|"$/g, '');
  wLocation = value2.replace(/^"|"$/g, '');

  const userPet  = fetch(userUrl + `/pet/find-by-userID?userID=${value}&withLocation=${wLocation}`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        if(result.data.pets === null){
          return []
        }
        return result.data.pets
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return userPet
}
export const postPet = (body) => {
  const uploadPet  = fetch(userUrl + '/pet', {
    method: 'POST',
    headers: myHeaders,
    body: body,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data.pet
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return uploadPet
}
export const deleteUserPet = (petId) => {
  let value = petId;
  value = value.replace(/^"|"$/g, '');

  const deletePet  = fetch(userUrl + `/pet/${value}`, {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return 'success'
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return deletePet
}

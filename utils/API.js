const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const myHeaders2 = new Headers();
myHeaders2.append("Content-Type", "multipart/form-data");

const userUrl = "https://paw-user-yej2q77qka-an.a.run.app"
const imageUrl = "https://paw-image-yej2q77qka-an.a.run.app/image/upload"
const emailUrl = "https://paw-mail-yej2q77qka-an.a.run.app"

export const login = (body) => {
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
                return {}
            }
        })
        .catch(error => console.log('error', error));

    return login
}

export const logoutAPI = (id) => {
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

export const getUserPost = (id, lastID) => {
  let value = id;
  value = value.replace(/^"|"$/g, '');

  const userPost  = fetch(userUrl + `/post/user-profile?userID=${value}&lastID=${lastID}&limit=3`, {
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

export const uploadImage = (image) => {
  const upload  = fetch(imageUrl, {
    method: 'POST',
    headers: myHeaders2,
    body: image,
  })
    .then(response => response.json())
    .then(result => {
      if(result.success === true){
        return result.data.image_url
      } else {
        return 'failed'
      }
    })
    .catch(error => console.log('error', error));

  return upload
}

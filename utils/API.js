const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const baseUrl = "https://paw-user-yej2q77qka-an.a.run.app/user"

export const login = (body) => {
    const login  = fetch(baseUrl + '/login', {
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

  const logout  = fetch(baseUrl + `/logout/${value}`, {
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

  const user  = fetch(baseUrl + `/${value}`, {
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

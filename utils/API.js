const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const baseUrl = "https://paw-user-yej2q77qka-an.a.run.app"
const loginUrl = baseUrl + '/user/login'
const logoutUrl = baseUrl + '/user/logout'

export const login = (body) => {
    const login  = fetch(loginUrl, {
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

export const logoutAPI = (body) => {
  const logout  = fetch(logoutUrl, {
    method: 'POST',
    headers: myHeaders,
    body: body,
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

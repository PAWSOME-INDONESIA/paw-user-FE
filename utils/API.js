import axios from 'axios';
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const baseUrl = "https://paw-user-yej2q77qka-an.a.run.app"

export const login = (body) => {
    const login  = fetch(baseUrl + '/user/login', {
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

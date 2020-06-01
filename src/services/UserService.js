import HttpService from './HttpService'
import axios from 'axios'

export default {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    uploadImg,
    getOnline,
    isOnline
}

function getOnline() {
    return HttpService.get('user/online')
}

function getUsers() {
    return HttpService.get('user')
}

function getById(userId) {
    return HttpService.get(`user/${userId}`)
}
function remove(userId) {
    return HttpService.delete(`user/${userId}`)
}

async function update(user) {

    return HttpService.put(`user/${user._id}`, user)

}

async function login(userCred) {
    const user = await HttpService.post('auth/login', userCred)
    if (user.username) window.location.href = '/'
    return _handleLogin(user)
}
async function signup(userCred) {
    const user = await HttpService.post('auth/signup', userCred)
    return _handleLogin(user)
}
async function logout() {
    await HttpService.post('auth/logout');
    sessionStorage.clear();
}
function _handleLogin(user) {
    sessionStorage.setItem('user', JSON.stringify(user))
    return user;
}



function uploadImg(ev, user) {
    const CLOUD_NAME = 'shaharperetz'; // find it in your cloudinary account (main page)
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append('file', ev.target.files[0]);
    formData.append('upload_preset', 'swg3eibm'); // second parameter is the upload preset (you can find it in cloudinary settings)

    return axios.post(UPLOAD_URL, formData)
        .then(res => {
            return res.data.url
        })
        .then(imgUrl => {
            user.imgUrl = imgUrl
            return user;
        })
        .then(user => update(user))
        .catch(err => console.error(err))
}

function isOnline(user, onlineUsers) {

    let isOnline = onlineUsers.find(onlineUser => {
        if (onlineUser._id === user._id) return onlineUser
    })
    return isOnline
}
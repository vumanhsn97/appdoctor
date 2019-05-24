import axiosGet, { axiosPost } from './axios-fetch'
import baseURL from './config'

export default () => {
    let services = {
        // Chat
        getMessages: (sender, receiver, page) => {
            return axiosGet(baseURL + `chats?MaNguoiGui=${sender.id}&LoaiNguoiGui=${sender.type}&MaNguoiNhan=${receiver.id}&LoaiNguoiNhan=${receiver.type}&page=${page}`)
                .then((res) => {
                    if (res.data.status === 'success') {
                        return res.data.chats
                    }
                    return null
                })
        }
    }
    return services
}
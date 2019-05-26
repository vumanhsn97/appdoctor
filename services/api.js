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
        },

        getBacSiInfo: (info) => {
            return axiosGet(baseURL + `doctors/find-doctor-by-id?MaBacSi=${info.MaBacSi}`)
                .then((res) => {
                    if (res.data.status === 'success') {
                        return res.data.doctor
                    }
                    return null;
                })
        },

        register:(doctor)=>{
            return axiosPost(baseURL + `doctors/sign-up`, {
                MaBacSi: doctor.MaBacSi,
                Password: doctor.Password,
                HoTen: doctor.HoTen,
                ChuyenMon: doctor.ChuyenMon
            })
                .then((res) => {
                    if (res.data.status === 'success') {
                        return res.data.status
                    }
                    return null
                })
        }
    }
    return services
}
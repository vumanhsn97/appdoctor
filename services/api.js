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
<<<<<<< HEAD
        getHealthValue: (info) => {
            return axiosGet(baseURL + `statistics?MaBenhNhan=${info.MaBenhNhan}&Loai=${info.Loai}`)
                .then((res) => {
                    if (res.data.status === 'success') {
                        if (info.Loai === 1)
                            return res.data.blood_sugar
                        else if (info.Loai === 2)
                            return res.data.blood_pressure
                    }
                    return null
                })
        },
        getTodayMeal: (info) => {
            return axiosGet(baseURL + `meals/todayMeal?MaBenhNhan=${info.MaBenhNhan}`)
                .then((res) => {
                    if (res.data.status === 'success') {
                        return res.data
                    }
                    return null
                })
        },
=======

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
>>>>>>> 7ac9c75e6534be475e1761a5d030871a2809db6c
    }
    return services
}
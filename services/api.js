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
    }
    return services
}
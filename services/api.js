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
        getBenhNhanInfo: (info) => {
            return axiosGet(baseURL + `patients/find-patient-by-id?MaBenhNhan=${info.MaBenhNhan}`)
                .then((res) => {
                    if (res.data.status === 'success') {
                        return res.data.patient
                    }
                    return null;
                })

        },
        updateSeeingSeen: (info) => {
            return axiosPost(baseURL + `chatnotifications/update-seeing-seen-messages`, {
                MaTaiKhoan: info.MaTaiKhoan,
                LoaiTaiKhoan: info.LoaiTaiKhoan,
                MaTaiKhoanLienQuan: info.MaTaiKhoanLienQuan,
                LoaiTaiKhoanLienQuan: info.LoaiTaiKhoanLienQuan
            })
                .then((res) => {
                    if (res.data.status === 'success') {
                        return res.data.status
                    }
                    return null
                })
        },
        seenThisNotification: (info) => {
            return axiosPost(baseURL + `notifications/seenThisNotification`, {
                MaTaiKhoan: info.MaTaiKhoan,
                Id: info.Id,
                LoaiNguoiChinh: info.LoaiNguoiChinh,
            }).then((res) => {
                if (res.data.status === 'success') {
                    return res.data
                }
                return null
            })
        },
        getHealthValuePerDay: (info) => {
            return axiosGet(baseURL + `statistics/getPerDay?MaBenhNhan=${info.MaBenhNhan}&Loai=${info.Loai}&Ngay=${info.Ngay}&page=${info.page}`)
                .then((res) => {
                    if (res.data.status === 'success') {
                        if (info.Loai === 1)
                            return {
                                data: res.data.blood_sugar,
                                totalPages: res.data.total_page
                            }
                        else if (info.Loai === 2)
                            return {
                                data: res.data.blood_pressure,
                                totalPages: res.data.total_page
                            }
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
        forgetBacSiPassword: (info) => {
            return axiosPost(baseURL + `doctors/forget-password`, {
                MaBacSi: info.MaBacSi,
                NewPassword: info.NewPassword,
            })
                .then((res) => {
                    if (res.data.status === 'success') {
                        return res.data.status
                    }
                    return null
                })
        },
        register: (doctor) => {
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
        },
        updateSeeing: (info) => {
            return axiosPost(baseURL + `chatnotifications/update-seeing-messages`, {
                MaTaiKhoan: info.MaTaiKhoan,
                LoaiTaiKhoan: info.LoaiTaiKhoan,
                MaTaiKhoanLienQuan: info.MaTaiKhoanLienQuan,
                LoaiTaiKhoanLienQuan: info.LoaiTaiKhoanLienQuan
            })
                .then((res) => {
                    if (res.data.status === 'success') {
                        return res.data.status
                    }
                    return null
                })
        },
        logout: () => {
            return axiosPost(baseURL + 'doctors/log-out')
        },
        getListMeal: (info) => {
            return axiosGet(baseURL + `meals?MaBenhNhan=${info.MaBenhNhan}&page=${info.page}`)
                .then((res) => {
                    if (res.data.status === 'success') {
                        return res.data
                    }
                    return null
                })
        },
        changeBacSiPassword: (info) => {
            return axiosPost(baseURL + `doctors/change-password`, {
                MaBacSi: info.MaBacSi,
                NewPassword: info.NewPassword,
                OldPassword: info.OldPassword
            })
                .then((res) => {
                    // if (res.data.status === 'success') {
                    //     return res.data.status
                    // }
                    // return null
                    return res.data
                })
        }
    }
    return services
}
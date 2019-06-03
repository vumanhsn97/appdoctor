import {LOAD_MY_PROFILE, UPDATE_MY_PROFILE} from '../actions/type';
import api from '../services/config';
import axios from 'axios';

var data = {}

export default function(state = data, actions) {
    switch(actions.type) {
        case UPDATE_MY_PROFILE:
            var d = state;
            if (actions.key == 'cmnd') {
                d.CMND = actions.value
            }
            if (actions.key == 'gender') {
                d.GioiTinh = actions.value
            }
            if (actions.key == 'hospital') {
                d.BenhVien = actions.value
            }
            if (actions.key == 'email') {
                d.Email = actions.value
            }
            if (actions.key == 'image') {
                d.Avatar = actions.value
            }
            if (actions.key == 'speciality') {
                d.ChuyenMon = actions.value
            }
            if (actions.key == 'name') {
                d.HoTen = actions.value
            }
            axios.post(api + 'doctors/update-profile', d)
                .then(async (response) => {
                    if (response.data.status == 'success') {
                        
                    } else {
                        
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            state = d;
            return state;
        case LOAD_MY_PROFILE:
            
            state = actions.data;
            data = actions.data;
            console.log(data.GioiTinh);
            return state;
        default:
            return state;
    }
}
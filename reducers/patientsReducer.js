import { LOAD_PATIENTS, DELETE_PATIENT, UN_HIGHLIGHT_PATIENT } from '../actions/type';

var datas = {
    patients: []
}

export default function (state = datas.patients, action) {
    switch (action.type) {
        case LOAD_PATIENTS:
            return state;
        case UN_HIGHLIGHT_PATIENT:
            let data = state.map((patient, index) => {
                if (patient.id.indexOf(action.id) != -1) {
                    patient.highlight = false;
                    i = index;
                }
                return patient;
            });
            for (let i = 0; i < data.length - 1; i++) {
                if (data[i].highlight === false && data[i + 1].highlight === true) {
                    if (data[i].noti === true && data[i + 1].noti === false) break;
                    const t = data[i];
                    data[i] = data[i + 1];
                    data[i + 1] = t; 
                }
            }
            state = [...data];
            return state;
        default:
            return state;
    }
}
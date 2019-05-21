import {INCREASE,
        DECREASE, 
        LOAD_PATIENTS, 
        DELETE_PATIENT, 
        ADD_PATIENT, 
        UPDATE_PATIENTS, 
        UN_HIGHLIGHT_PATIENT,
        ADD_ADVICE,
        DELETE_ADVICE,
        LOAD_CHAT,
        SEND,
        UPDATE_MY_PROFILE,
        LOAD_MY_PROFILE
        } from './type';

export const counterIncrease = () => ({type:INCREASE});
export const counterDecrease = () => ({type:DECREASE});
export const loadPatients = () => ({type:LOAD_PATIENTS});
export const updatePatient = (id) => ({type:UPDATE_PATIENTS, id});
export const deletePatients = (id) => ({type:DELETE_PATIENT, id});
export const unHighLightPatients = (id) => ({type:UN_HIGHLIGHT_PATIENT, id});
//PatientScreen
export const addAdviceForPatient = (title, content) => ({
    type: ADD_ADVICE,
    title,
    content
})
//ChatScreen
export const sendChat = (mess, time) => ({
    type: SEND,
    mess,
    time
})
//My Profile Screen
export const updateMyProfile = ( key, value) => ({
    type: UPDATE_MY_PROFILE,
    key,
    value
});

export const loadMyProfile = (data) => ({
    type: LOAD_MY_PROFILE,
    data
})
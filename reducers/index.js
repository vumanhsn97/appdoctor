import {combineReducers} from 'redux';
import counterReducer from './couterReducer';
import patientsReducer from './patientsReducer';
import patientReducer from './patientReducer';
import chatReducer from './chatReducer';
import myProfileReducer from './myProfileReducer';

export default combineReducers({
  count:counterReducer,
  patients:patientsReducer,
  patient:patientReducer,
  chat:chatReducer,
  myProfile: myProfileReducer
});
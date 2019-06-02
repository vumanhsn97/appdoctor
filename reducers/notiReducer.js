import {UPDATE_NOTIFICATION} from '../actions/type';

noti = 5;

export default function(data = noti, actions){
    switch(actions.type) {
        case UPDATE_NOTIFICATION: {
            data = actions.data;
            return data;
        }
        default:
            return data;
    }
}
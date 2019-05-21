import { SEND } from '../actions/type';

datas = {
    mess: [{
        time: "10:44",
        type: 1,
        content: "Hien"
    }]
}

export default function (state = datas.mess, actions) {
    switch (actions.type) {
        case SEND:
            let data = [...state];
            var _hr = new Date().getHours(),
                _min = new Date().getMinutes();
            let _time = _hr + ':' + _min;
            data.unshift({
                time: _time,

                content: action.content
            });
        default:
            return state;
    }
}
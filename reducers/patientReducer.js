import {ADD_ADVICE, DELETE_ADVICE} from '../actions/type';

var data = {
    "id": "03294644667",
    "avatar": "https://hcplive.s3.amazonaws.com/v1_media/_image/happydoctor.jpg",
    "name": "Vũ Văn Mạnh",
    "age": "24 tuổi",
    "address": "227 Nguyễn Văn Cừ, Hồ Chí Minh",
    "type": "Tiểu đường" ,
    "duonghuyet": "120mg/dL",
    "cannang": "50kg",
    "huyetap": "120mmHg",
    "nhiptim": "100 n/p",
    "chieucao": "1.66m",
    "hba1c": "5%",
    "advices": [{
        "key": "1558272145533",
        "title": "Chỉnh đốn chế độ ăn",
        "content": "Bạn nên ăn đúng bữa và đúng giờ. Không nên bỏ bữa hay ăn trái giờ"
    }, {
        "key": "1558272145536",
        "title": "Mua thuốc",
        "content": "Bạn có thể mua thuốc ... để khỏe hơn"
    }]
}

export default function(state = data, action) {
    switch(action.type) {
        case ADD_ADVICE:
            let advice = [...state.advices];
            var d = new Date();

            advice.unshift({
                key: d.getTime().toString(),
                title: action.title,
                content: action.content
            });
            state.advices = [...advice];
            return state;

        default:
            return state;
    }
}
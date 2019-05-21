import { LOAD_PATIENTS, DELETE_PATIENT, UN_HIGHLIGHT_PATIENT } from '../actions/type';

var datas = {
    patients: [{
        "id": "03294644667",
        "noti": true,
        "highlight": true,
        "avatar": "https://hcplive.s3.amazonaws.com/v1_media/_image/happydoctor.jpg",
        "name": "Vũ Văn Mạnh",
        "type": "Tiểu đường"
    },
    {
        "id": "04141531523",
        "noti": true,
        "highlight": true,
        "avatar": "http://imcut.jollychic.com//uploads/jollyimg/imageLibrary/201808/6S3/09/IL201808091905407184.jpg",
        "name": "Trần Văn A",
        "type": "Tiểu đường"
    },
    {
        "id": "015315321532",
        "noti": false,
        "highlight": true,
        "avatar": "https://sc02.alicdn.com/kf/HTB167mwXL_HK1JjSsziq6ygrVXaJ/Red-rose-giant-foam-paper-flower-wall.jpg_350x350.jpg",
        "name": "Nguyễn Văn B",
        "type": "Tiểu đường"
    },
    {
        "id": "031515214667",
        "noti": false,
        "highlight": true,
        "avatar": "https://ae01.alicdn.com/kf/HTB1PhJLQpXXXXb8aXXXq6xXFXXXf/Kustom-Foto-Mural-Wallpaper-Modern-Fashion-3D-Butterfly-Rose-Bunga-Pintu-Masuk-Dinding-Latar-Belakang-Dekorasi.jpg",
        "name": "Tô Thị M",
        "type": "Tiểu đường"
    },
    {
        "id": "153215113421",
        "noti": false,
        "highlight": false,
        "name": "Doàn Văn T",
        "avatar": "https://images.unsplash.com/photo-1533467915241-eac02e856653?ixlib=rb-1.2.1&w=1000&q=80",
        "type": "Tiểu đường"
    }, {
        "id": "414314314314",
        "noti": false,
        "highlight": false,
        "name": "Nguyễn Thị M",
        "avatar": "https://cdn.vox-cdn.com/thumbor/3ajecDMOIH59cbOeyO0bap_4wj4=/0x0:2257x1320/1200x800/filters:focal(949x480:1309x840)/cdn.vox-cdn.com/uploads/chorus_image/image/63738986/pokemon.0.0.png",
        "type": "Tiểu đường"
    }, {
        "id": "412531253123",
        "noti": false,
        "highlight": false,
        "name": "Cao Văn L",
        "avatar": "https://gameworld.vn/wp-content/uploads/2018/10/w4n62VTLIJiL1AO39P2LH4VpoTkVu4sE.jpg",
        "type": "Tiểu đường"
    }, {
        "id": "134414313243",
        "noti": false,
        "highlight": false,
        "name": "Trần Trung C",
        "avatar": "https://static1.squarespace.com/static/51b3dc8ee4b051b96ceb10de/t/5cca15881905f41be8767005/1556747658231/?format=2500w",
        "type": "Tiểu đường"
    }
    ]
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
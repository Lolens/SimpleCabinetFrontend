import RequestService from "./request-service";

export default class AssetService {
    static async uploadSkin(file, toggleSlim = false) {
        return AssetService.upload('skin', file, {
            toggleSlim: toggleSlim
        });
    }

    static async uploadCape(file) {
        return AssetService.upload('cape', file, {});
    }


    static async upload(type, file, options = {}) {
        const fd = new FormData();
        fd.append("options", new Blob([JSON.stringify(options)], {
            type: "application/json"
        }))
        fd.append("file", file)
        return await RequestService.request('POST', 'cabinet/upload/' + type, fd, {
            "Content-Type": 'multipart/form-data'
        })
    }

    static async adminUpload(file) {
        const fd = new FormData();
        fd.append("file", file)
        return await RequestService.request('POST', 'admin/upload/simpleupload', fd, {
            "Content-Type": 'multipart/form-data'
        })
    }
};
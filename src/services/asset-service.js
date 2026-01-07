import RequestService from "./request-service";

export default class AssetService {

  static async uploadSkin(file, slim = false) {
    return this.upload("skin", file, slim);
  }

  static async uploadCape(file) {
    return this.upload("cape", file, false);
  }

  static async upload(type, file, slim = false) {
    const fd = new FormData();
    fd.append("type", type);
    fd.append("file", file);
    fd.append("slim", String(slim));

    return RequestService.request(
      "POST",
      "assets/upload",
      fd
    );
  }

  static async adminUpload(file) {
    const fd = new FormData();
    fd.append("file", file);

    return RequestService.request(
      "POST",
      "/admin/upload/simpleupload",
      fd
    );
  }
}

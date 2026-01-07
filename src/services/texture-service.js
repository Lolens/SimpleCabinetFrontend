import RequestService from "./request-service";

export default class AssetService {

  static async getMyAssets() {
    const res = await RequestService.request(
      "GET",
      "assets/my",
      null
    );
    return res.data;
  }

  static async uploadSkin(file, slim = false) {
    return this.upload("skin", file, slim);
  }

  static async uploadCape(file) {
    return this.upload("cape", file, false);
  }

  static async upload(type, file, slim) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("slim", String(slim));

    const res = await RequestService.request(
      "POST",
      `assets/upload/${type}`,
      fd
    );

    return res.data;
  }

  static async delete(type) {
    return RequestService.request(
      "DELETE",
      `assets/${type}`,
      null
    );
  }
}

export class RequestException extends Error {
  code = 0;
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export default class RequestService {
  static BASIC_URL = "/api/";
  static accessToken = null;

  static async request(method, url, data, headers = {}) {
  headers = { ...headers };

  if (!headers["Accept"]) {
    headers["Accept"] = "application/json";
  }

  const isFormData = data instanceof FormData;

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (RequestService.accessToken != null && !headers["Authorization"]) {
    headers["Authorization"] = "Bearer " + RequestService.accessToken;
  }

  const params = {
    method,
    headers
  };

  if (data) {
    params.body = isFormData
      ? data
      : JSON.stringify(data);
  }

  const response = await fetch(RequestService.BASIC_URL + url, params);

  if (response.status === 404) {
    return null;
  }

  const contentType = response.headers.get("Content-Type") || "";
  const text = await response.text();

  const payload = contentType.includes("application/json")
    ? JSON.parse(text)
    : text;

  if (response.ok) {
    return payload;
  }

  throw new RequestException(
    "SC" + payload.code + ": " + payload.error,
    payload.code
  );
}

}

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;




// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;



import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // --------------------------------------------------
    // Authorization
    // --------------------------------------------------

    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    // --------------------------------------------------
    // FormData
    //
    // برای آپلود فایل:
    // Content-Type را دستی تعیین نکن.
    //
    // مرورگر خودش می‌سازد:
    //
    // multipart/form-data;
    // boundary=----------------...
    // --------------------------------------------------

    if (config.data instanceof FormData) {

      if (config.headers) {

        delete config.headers["Content-Type"];

        delete config.headers["content-type"];
      }

    } else {

      // ------------------------------------------------
      // درخواست‌های معمول پروژه همچنان JSON هستند
      // ------------------------------------------------

      if (config.headers) {
        config.headers["Content-Type"] =
          "application/json";
      }
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default api;
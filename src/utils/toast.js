import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export const showToast = (message, bgColor = "#4CAF50") => {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: bgColor,
    stopOnFocus: true,
  }).showToast();
};

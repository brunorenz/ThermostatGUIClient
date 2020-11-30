/* eslint-disable no-console */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "MB - App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
    },
    registered() {
      console.log("MB - Service worker has been registered.");
    },
    cached() {
      console.log("MB - Content has been cached for offline use.");
    },
    updatefound() {
      console.log("MB - New content is downloading.");
    },
    updated() {
      console.log("MB - New content is available; please refresh.");
    },
    offline() {
      console.log(
        "MB - No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("MB - Error during service worker registration:", error);
    },
  });
}

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyD0DOyfTC3b9Nqvg6tdoIPC9nhgjpUuJIM",
  authDomain: "careerpoint-push-notifications.firebaseapp.com",
  projectId: "careerpoint-push-notifications",
  storageBucket: "careerpoint-push-notifications.firebasestorage.app",
  messagingSenderId: "670362340034",
  appId: "1:670362340034:web:4ead4371e79ed21085895b",
  measurementId: "G-RCZ8CDDVRM",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message:", payload);
});

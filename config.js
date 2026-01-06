// config.js
// === إعدادات المتجر (قم بتعديل البيانات هنا لكل زبون) ===

window.MY_STORE_CONFIG = {
    // 1. ضع كود فيربايس هنا (نسخ ولصق من موقع فيربايس)
    firebase: {
        apiKey: "AIzaSyDX0esBRiQ4MuyvWH_s2UZ2kJpA9GryDgE",
        authDomain: "tttttt-48c2e.firebaseapp.com",
        databaseURL: "https://tttttt-48c2e-default-rtdb.firebaseio.com",
        projectId: "tttttt-48c2e",
        storageBucket: "tttttt-48c2e.firebasestorage.app",
        messagingSenderId: "982883301644",
        appId: "1:982883301644:web:7b1676215cb4f0fe7c7129",
        measurementId: "G-QLCYC16T20"
    },

    // 2. ضع إعدادات الصور (Cloudinary) هنا
    cloudinary: {
        cloudName: "dongmlmoj",  // اسم الكلاود
        uploadPreset: "app_upload" // اسم البريسيت (تأكد من إنشائه في حساب الزبون)
    },

    // 3. رمز دخول الأدمن
    security: {
        adminCode: "1001"
    }
};


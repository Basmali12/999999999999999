if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker registered!', reg))
      .catch(err => console.log('Service Worker registration failed', err));
  });
}

const config = window.MY_STORE_CONFIG;
if (!config) { alert("خطأ: لم يتم العثور على ملف الإعدادات config.js!"); }

let allProducts = {};
let cart = [];
let user = null;
let deferredPrompt;
let adminPhoneNumber = ""; 
let sliderInterval;

firebase.initializeApp(config.firebase);
const db = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
    
    db.ref('settings').on('value', snapshot => {
        const s = snapshot.val();
        if(s) {
            if(s.storeName) {
                const formattedName = `<span class="store-text" style="color:#fff">${s.storeName.charAt(0)}</span>${s.storeName.substring(1)}`;
                const headerDisplay = document.getElementById('store-name-display');
                if(headerDisplay) headerDisplay.innerHTML = formattedName;
                const splashTitle = document.getElementById('splash-title');
                if(splashTitle) splashTitle.innerText = s.storeName;
            }
            if(s.whatsapp) adminPhoneNumber = s.whatsapp;
        }
    });

    db.ref('categories').on('value', snapshot => {
        const catContainer = document.getElementById('dynamic-categories');
        const data = snapshot.val();
        catContainer.innerHTML = `<div class="category-item" onclick="filterProducts('all')"><div class="cat-box active"><div class="square-icon"></div></div><span class="cat-name">الكل</span></div>`;
        if(data) {
            Object.values(data).forEach(cat => {
                catContainer.innerHTML += `<div class="category-item" onclick="filterProducts('${cat.id}')"><div class="cat-box"><img src="${cat.image}" class="cat-img"></div><span class="cat-name">${cat.name}</span></div>`;
            });
        }
    });

    db.ref('banners').on('value', snapshot => {
        const slider = document.getElementById('dynamic-slider');
        const data = snapshot.val();
        slider.innerHTML = "";
        if(sliderInterval) clearInterval(sliderInterval);
        if(data) {
            const banners = Object.values(data);
            banners.forEach(b => { slider.innerHTML += `<img src="${b.image}" alt="${b.title || 'Offer'}">`; });
            let currentIndex = 0;
            const totalSlides = banners.length;
            if(totalSlides > 1) {
                sliderInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % totalSlides;
                    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
                }, 3000);
            }
        } else { slider.innerHTML = '<img src="https://via.placeholder.com/800x450?text=Welcome" style="width:100%; height:100%; object-fit:cover">'; }
    });

    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        setTimeout(() => splash.style.display = 'none', 500);
        if(!localStorage.getItem('visited')) { showPage('login-page'); localStorage.setItem('visited', 'true'); }
    }, 2000);

    window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; document.getElementById('install-banner').style.display = 'flex'; });
    document.getElementById('install-btn').addEventListener('click', async () => { if(deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; document.getElementById('install-banner').style.display = 'none'; } });
    document.getElementById('close-install').addEventListener('click', () => document.getElementById('install-banner').style.display = 'none');
    
    db.ref('products').on('value', (snapshot) => {
        const container = document.getElementById('products-container');
        container.innerHTML = "";
        const data = snapshot.val();
        if (!data) { container.innerHTML = "<p style='width:200%; text-align:center;'>لا توجد منتجات</p>"; return; }
        allProducts = data;
        const productsKeys = Object.keys(data).reverse();
        productsKeys.forEach(key => {
             const prod = data[key];
             const card = `<div class="product-card" data-category="${prod.category || 'general'}"><span class="discount-badge">جديد</span><img src="${prod.image}" class="prod-img" loading="lazy"><div class="prod-details"><div class="prod-title">${prod.title}</div><button class="details-btn" onclick="openProductPage('${key}')">تفاصيل</button></div></div>`;
            container.innerHTML += card;
        });
    });
});

window.showPage = function(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active-page'));
    if(document.getElementById(pageId)) document.getElementById(pageId).classList.add('active-page');
    window.scrollTo(0,0);
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if(pageId === 'home-page') document.querySelector('.nav-item:nth-child(1)').classList.add('active');
}
window.goBack = function() { showPage('home-page'); }

window.openProductPage = function(id) {
    const prod = allProducts[id];
    if(!prod) return;
    document.getElementById('detail-title').innerText = prod.title || "";
    document.getElementById('detail-img').src = prod.image || "";
    document.querySelector('.detail-desc p').innerHTML = prod.description ? prod.description.replace(/\n/g, "<br>") : "لا يوجد وصف";
    
    const btnsContainer = document.getElementById('detail-dynamic-buttons');
    btnsContainer.innerHTML = '';
    if(prod.buttons && prod.buttons.length > 0) {
        prod.buttons.forEach(b => {
            btnsContainer.innerHTML += `<a href="${b.url}" class="dynamic-link-btn" target="_blank">${b.name}</a>`;
        });
    }
    showPage('product-page');
}

window.addToCartFromDetail = function() {
    // تم الإبقاء على الوظيفة تجنباً للحذف كما طُلب
}
window.addToCart = function(title, price, img) { cart.push({ title, price, img }); updateCartUI(); showToast("تمت الإضافة للسلة!"); }
function updateCartUI() {
    // تم الإبقاء على الوظيفة
}
window.removeFromCart = function(index) { cart.splice(index, 1); updateCartUI(); }
window.clearCart = function() { cart = []; updateCartUI(); }

window.processCheckout = function() {
    // تم الإبقاء على الوظيفة
}

window.handleGoogleLogin = function() { showToast("جاري الاتصال..."); setTimeout(() => { user = { name: "مستخدم", email: "user@gmail.com", avatar: "https://via.placeholder.com/80" }; updateProfileUI(); showPage('home-page'); }, 1500); }
function updateProfileUI() { if(user) { document.getElementById('profile-name').innerText = user.name; document.getElementById('profile-email').innerText = user.email; document.getElementById('profile-img').src = user.avatar; } }
window.openWhatsAppSupport = function() { if (adminPhoneNumber) window.open(`https://wa.me/${adminPhoneNumber}`, '_blank'); else showToast("رقم الخدمة غير متوفر"); }
function showToast(msg) { const toast = document.getElementById('toast-notification'); toast.innerText = msg; toast.classList.add('show-toast'); setTimeout(() => toast.classList.remove('show-toast'), 2000); }
window.toggleSidebar = function() { document.getElementById('sidebar').classList.toggle('active'); document.getElementById('sidebar-overlay').classList.toggle('active'); }
window.filterProducts = function(cat) {
    const cards = document.querySelectorAll('.product-card');
    document.querySelectorAll('.cat-box').forEach(b => b.classList.remove('active'));
    event.currentTarget.querySelector('.cat-box').classList.add('active');
    cards.forEach(card => { if(cat === 'all' || card.dataset.category === cat) card.style.display = 'flex'; else card.style.display = 'none'; });
}

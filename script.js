if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker registered!'))
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

if (config && firebase.apps.length === 0) {
    firebase.initializeApp(config.firebase);
}
const db = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
    
    db.ref('settings').on('value', snapshot => {
        const s = snapshot.val();
        if(s) {
            if(s.storeName) {
                const nameStr = String(s.storeName);
                const formattedName = `<span class="store-text" style="color:#fff">${nameStr.charAt(0)}</span>${nameStr.substring(1)}`;
                const headerDisplay = document.getElementById('store-name-display');
                if(headerDisplay) headerDisplay.innerHTML = formattedName;
                const splashTitle = document.getElementById('splash-title');
                if(splashTitle) splashTitle.innerText = nameStr;
            }
            if(s.whatsapp) adminPhoneNumber = s.whatsapp;
        }
    });

    db.ref('categories').on('value', snapshot => {
        const catContainer = document.getElementById('dynamic-categories');
        if(!catContainer) return;
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
        if(!slider) return;
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
        if(splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 500);
        }
        if(!localStorage.getItem('visited')) { 
            showPage('home-page'); 
            localStorage.setItem('visited', 'true'); 
        }
    }, 2000);

    const installBtn = document.getElementById('install-btn');
    const closeInstall = document.getElementById('close-install');
    
    window.addEventListener('beforeinstallprompt', (e) => { 
        e.preventDefault(); 
        deferredPrompt = e; 
        const installBanner = document.getElementById('install-banner');
        if(installBanner) installBanner.style.display = 'flex'; 
    });
    
    if(installBtn) {
        installBtn.addEventListener('click', async () => { 
            if(deferredPrompt) { 
                deferredPrompt.prompt(); 
                deferredPrompt = null; 
                const installBanner = document.getElementById('install-banner');
                if(installBanner) installBanner.style.display = 'none'; 
            } 
        });
    }
    if(closeInstall) {
        closeInstall.addEventListener('click', () => {
            const installBanner = document.getElementById('install-banner');
            if(installBanner) installBanner.style.display = 'none';
        });
    }
    
    db.ref('products').on('value', (snapshot) => {
        const container = document.getElementById('products-container');
        if(!container) return;
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
    const targetPage = document.getElementById(pageId);
    if(targetPage) targetPage.classList.add('active-page');
    window.scrollTo(0,0);
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if(pageId === 'home-page') {
        const firstNav = document.querySelector('.nav-item:nth-child(1)');
        if(firstNav) firstNav.classList.add('active');
    }
}

window.goBack = function() { showPage('home-page'); }

window.openProductPage = function(id) {
    const prod = allProducts[id];
    if(!prod) return;
    const titleEl = document.getElementById('detail-title');
    if(titleEl) titleEl.innerText = prod.title || "";
    
    const imgEl = document.getElementById('detail-img');
    if(imgEl) imgEl.src = prod.image || "";
    
    const descEl = document.querySelector('.detail-desc p');
    if(descEl) descEl.innerHTML = prod.description ? prod.description.replace(/\n/g, "<br>") : "لا يوجد وصف";
    
    const btnsContainer = document.getElementById('detail-dynamic-buttons');
    if(btnsContainer) {
        btnsContainer.innerHTML = '';
        if(prod.buttons && prod.buttons.length > 0) {
            prod.buttons.forEach(b => {
                btnsContainer.innerHTML += `<a href="${b.url}" class="dynamic-link-btn" target="_blank">${b.name}</a>`;
            });
        }
    }
    showPage('product-page');
}

window.addToCartFromDetail = function() {
    // تم الإبقاء على الوظيفة
}

window.addToCart = function(title, price, img) { 
    cart.push({ title, price, img }); 
    updateCartUI(); 
    showToast("تمت الإضافة للسلة!"); 
}

function updateCartUI() {
    // تم الإبقاء على الوظيفة
}

window.removeFromCart = function(index) { 
    cart.splice(index, 1); 
    updateCartUI(); 
}

window.clearCart = function() { 
    cart = []; 
    updateCartUI(); 
}

window.processCheckout = function() {
    // تم الإبقاء على الوظيفة
}

window.handleGoogleLogin = function() { 
    showToast("جاري الاتصال..."); 
    setTimeout(() => { 
        user = { name: "مستخدم", email: "user@gmail.com", avatar: "https://via.placeholder.com/80" }; 
        updateProfileUI(); 
        showPage('home-page'); 
    }, 1500); 
}

function updateProfileUI() { 
    if(user) { 
        const pName = document.getElementById('profile-name');
        if(pName) pName.innerText = user.name; 
        const pEmail = document.getElementById('profile-email');
        if(pEmail) pEmail.innerText = user.email; 
        const pImg = document.getElementById('profile-img');
        if(pImg) pImg.src = user.avatar; 
    } 
}

window.openWhatsAppSupport = function() { 
    if (adminPhoneNumber) window.open(`https://wa.me/${adminPhoneNumber}`, '_blank'); 
    else showToast("رقم الخدمة غير متوفر"); 
}

function showToast(msg) { 
    const toast = document.getElementById('toast-notification'); 
    if(toast) {
        toast.innerText = msg; 
        toast.classList.add('show-toast'); 
        setTimeout(() => toast.classList.remove('show-toast'), 2000); 
    }
}

window.toggleSidebar = function() { 
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if(sidebar) sidebar.classList.toggle('active'); 
    if(overlay) overlay.classList.toggle('active'); 
}

window.filterProducts = function(cat) {
    const cards = document.querySelectorAll('.product-card');
    document.querySelectorAll('.cat-box').forEach(b => b.classList.remove('active'));
    if(typeof event !== 'undefined' && event.currentTarget) {
        const box = event.currentTarget.querySelector('.cat-box');
        if(box) box.classList.add('active');
    }
    cards.forEach(card => { 
        if(cat === 'all' || card.dataset.category === cat) {
            card.style.display = 'flex'; 
        } else {
            card.style.display = 'none'; 
        }
    });
}

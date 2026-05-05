function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

function loadProducts() {
    const grid = document.getElementById('productsGrid');
    db.collection(CONFIG.COLLECTION_NAME).orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        grid.innerHTML = '';
        snapshot.forEach(doc => {
            const product = doc.data();
            grid.innerHTML += `
                <div class="product-card">
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price} د.ع</p>
                    <a href="https://wa.me/?text=طلب ${product.name}" target="_blank" rel="noopener noreferrer" class="buy-btn">شراء الآن</a>
                </div>
            `;
        });
    });
}
window.onload = loadProducts;

// عداد الزوار
function updateVisitorCount() {
    let visitorCount = localStorage.getItem('visitorCount');
    if (!visitorCount) {
        visitorCount = 0;
    }
    visitorCount = parseInt(visitorCount) + 1;
    localStorage.setItem('visitorCount', visitorCount);
    document.getElementById('visitorCount').textContent = visitorCount;
}

// تشغيل عداد الزوار عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    updateVisitorCount();
    
    // تأثير التمرير السلس للروابط
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// بيانات المعرض (سيتم توسيعها لاحقاً)
let galleryData = [
    {
        id: 1,
        src: 'https://via.placeholder.com/400x300/667eea/ffffff?text=تصوير+احترافي',
        category: 'تصوير خارجي',
        likes: 15,
        views: 120,
        comments: [
            { user: 'أحمد محمد', text: 'صورة رائعة!' },
            { user: 'فاطمة علي', text: 'إبداع حقيقي' }
        ]
    },
    {
        id: 2,
        src: 'https://via.placeholder.com/400x300/764ba2/ffffff?text=تصوير+منتجات',
        category: 'منتجات',
        likes: 23,
        views: 89,
        comments: [
            { user: 'سارة أحمد', text: 'جودة عالية جداً' }
        ]
    },
    {
        id: 3,
        src: 'https://via.placeholder.com/400x300/ffd700/333333?text=مهرجانات',
        category: 'مهرجانات',
        likes: 31,
        views: 156,
        comments: []
    }
];

// وظائف المعرض
function createGalleryHTML() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;
    
    galleryContainer.innerHTML = '';
    
    galleryData.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${item.src}" alt="${item.category}" onclick="openImageModal(${item.id})">
            <div class="gallery-info">
                <h4>${item.category}</h4>
                <div class="gallery-stats">
                    <span class="likes" onclick="likeImage(${item.id})">❤️ ${item.likes}</span>
                    <span class="views">👁️ ${item.views}</span>
                </div>
            </div>
        `;
        galleryContainer.appendChild(galleryItem);
    });
}

function likeImage(imageId) {
    const image = galleryData.find(img => img.id === imageId);
    if (image) {
        image.likes++;
        createGalleryHTML();
    }
}

function openImageModal(imageId) {
    const image = galleryData.find(img => img.id === imageId);
    if (image) {
        image.views++;
        // هنا يمكن إضافة مودال لعرض الصورة والتعليقات
        alert(`عرض الصورة: ${image.category}\nالإعجابات: ${image.likes}\nالمشاهدات: ${image.views}`);
        createGalleryHTML();
    }
}

// وظيفة البحث والفلترة
function filterGallery(category) {
    const filteredData = category === 'all' ? galleryData : galleryData.filter(item => item.category === category);
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;
    
    galleryContainer.innerHTML = '';
    
    filteredData.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${item.src}" alt="${item.category}" onclick="openImageModal(${item.id})">
            <div class="gallery-info">
                <h4>${item.category}</h4>
                <div class="gallery-stats">
                    <span class="likes" onclick="likeImage(${item.id})">❤️ ${item.likes}</span>
                    <span class="views">👁️ ${item.views}</span>
                </div>
            </div>
        `;
        galleryContainer.appendChild(galleryItem);
    });
}

// وظيفة ترتيب الصور
function sortGallery(sortBy) {
    let sortedData = [...galleryData];
    
    switch(sortBy) {
        case 'newest':
            sortedData = sortedData.reverse();
            break;
        case 'likes':
            sortedData.sort((a, b) => b.likes - a.likes);
            break;
        case 'views':
            sortedData.sort((a, b) => b.views - a.views);
            break;
    }
    
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;
    
    galleryContainer.innerHTML = '';
    
    sortedData.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${item.src}" alt="${item.category}" onclick="openImageModal(${item.id})">
            <div class="gallery-info">
                <h4>${item.category}</h4>
                <div class="gallery-stats">
                    <span class="likes" onclick="likeImage(${item.id})">❤️ ${item.likes}</span>
                    <span class="views">👁️ ${item.views}</span>
                </div>
            </div>
        `;
        galleryContainer.appendChild(galleryItem);
    });
}


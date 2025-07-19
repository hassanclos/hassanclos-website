// متغير لتخزين الصورة المحددة حالياً
let currentImageId = null;

// تحميل المعرض عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    createGalleryHTML();
    
    // إضافة مستمع لرفع الصور
    document.getElementById('imageUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // عرض معاينة للصورة المحددة
                console.log('تم اختيار صورة:', file.name);
            };
            reader.readAsDataURL(file);
        }
    });
});

// إنشاء HTML للمعرض
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

// فتح مودال الصورة
function openImageModal(imageId) {
    const image = galleryData.find(img => img.id === imageId);
    if (image) {
        currentImageId = imageId;
        image.views++;
        
        // تحديث محتوى المودال
        document.getElementById('modalImage').src = image.src;
        document.getElementById('modalCategory').textContent = image.category;
        document.getElementById('modalLikes').innerHTML = `❤️ ${image.likes}`;
        document.getElementById('modalViews').innerHTML = `👁️ ${image.views}`;
        
        // عرض التعليقات
        displayComments(image.comments);
        
        // إظهار المودال
        document.getElementById('imageModal').style.display = 'block';
        
        // تحديث المعرض
        createGalleryHTML();
    }
}

// إغلاق المودال
function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
    currentImageId = null;
}

// إغلاق المودال عند النقر خارجه
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target == modal) {
        closeModal();
    }
}

// عرض التعليقات
function displayComments(comments) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="color: #666; font-style: italic;">لا توجد تعليقات بعد</p>';
        return;
    }
    
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-item';
        commentDiv.innerHTML = `
            <div class="comment-user">${comment.user}</div>
            <div class="comment-text">${comment.text}</div>
        `;
        commentsList.appendChild(commentDiv);
    });
}

// إضافة تعليق
function addComment() {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();
    
    if (commentText === '') {
        alert('يرجى كتابة تعليق');
        return;
    }
    
    if (currentImageId === null) return;
    
    const image = galleryData.find(img => img.id === currentImageId);
    if (image) {
        // إضافة التعليق الجديد
        const newComment = {
            user: 'زائر', // يمكن تحسين هذا لاحقاً بنظام تسجيل دخول
            text: commentText
        };
        
        image.comments.push(newComment);
        
        // تحديث عرض التعليقات
        displayComments(image.comments);
        
        // مسح حقل الإدخال
        commentInput.value = '';
    }
}

// إعجاب بالصورة
function likeImage(imageId) {
    const image = galleryData.find(img => img.id === imageId);
    if (image) {
        image.likes++;
        createGalleryHTML();
        
        // تحديث المودال إذا كان مفتوحاً
        if (currentImageId === imageId) {
            document.getElementById('modalLikes').innerHTML = `❤️ ${image.likes}`;
        }
    }
}

// فلترة المعرض
function filterGallery(category) {
    // إزالة الفئة النشطة من جميع الأزرار
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إضافة الفئة النشطة للزر المحدد
    event.target.classList.add('active');
    
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

// ترتيب المعرض
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

// رفع صورة جديدة
function uploadImage() {
    const fileInput = document.getElementById('imageUpload');
    const categorySelect = document.getElementById('categorySelect');
    
    if (!fileInput.files[0]) {
        alert('يرجى اختيار صورة أولاً');
        return;
    }
    
    const file = fileInput.files[0];
    const category = categorySelect.value;
    
    // إنشاء URL للصورة المحلية
    const reader = new FileReader();
    reader.onload = function(e) {
        // إضافة الصورة الجديدة لبيانات المعرض
        const newImage = {
            id: galleryData.length + 1,
            src: e.target.result,
            category: category,
            likes: 0,
            views: 0,
            comments: []
        };
        
        galleryData.push(newImage);
        
        // تحديث المعرض
        createGalleryHTML();
        
        // مسح الحقول
        fileInput.value = '';
        
        alert('تم إضافة الصورة بنجاح!');
    };
    
    reader.readAsDataURL(file);
}

// إضافة مستمع للوحة المفاتيح لإغلاق المودال
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});


// وظائف لوحة التحكم

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    updateStats();
});

// تبديل التبويبات
function showTab(tabId) {
    // إخفاء جميع التبويبات
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // إزالة الفئة النشطة من جميع الأزرار
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إظهار التبويب المحدد
    document.getElementById(tabId).classList.add('active');
    
    // إضافة الفئة النشطة للزر المحدد
    event.target.classList.add('active');
    
    // تحديث البيانات حسب التبويب
    switch(tabId) {
        case 'gallery-management':
            loadGalleryManagement();
            break;
        case 'contact-messages':
            loadContactMessages();
            break;
        case 'site-stats':
            updateStats();
            break;
    }
}

// تحميل بيانات إدارة المعرض
function loadGalleryManagement() {
    const galleryList = document.getElementById('adminGalleryList');
    galleryList.innerHTML = '';
    
    galleryData.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'admin-gallery-item';
        galleryItem.innerHTML = `
            <img src="${item.src}" alt="${item.category}">
            <div class="admin-gallery-info">
                <h4>${item.category}</h4>
                <div class="admin-gallery-stats">
                    <span>❤️ ${item.likes}</span>
                    <span>👁️ ${item.views}</span>
                    <span>💬 ${item.comments.length}</span>
                </div>
                <div class="admin-gallery-actions">
                    <button class="edit-btn" onclick="editImage(${item.id})">تعديل</button>
                    <button class="delete-btn" onclick="deleteImage(${item.id})">حذف</button>
                </div>
            </div>
        `;
        galleryList.appendChild(galleryItem);
    });
}

// رفع صور متعددة من لوحة التحكم
function adminUploadImages() {
    const fileInput = document.getElementById('adminImageUpload');
    const categorySelect = document.getElementById('adminCategorySelect');
    const titleInput = document.getElementById('imageTitle');
    
    if (!fileInput.files.length) {
        alert('يرجى اختيار صورة واحدة على الأقل');
        return;
    }
    
    const category = categorySelect.value;
    const title = titleInput.value || category;
    
    Array.from(fileInput.files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newImage = {
                id: galleryData.length + index + 1,
                src: e.target.result,
                category: category,
                title: title + (index > 0 ? ` ${index + 1}` : ''),
                likes: 0,
                views: 0,
                comments: []
            };
            
            galleryData.push(newImage);
            
            // تحديث المعرض إذا كان مفتوحاً
            if (typeof createGalleryHTML === 'function') {
                createGalleryHTML();
            }
        };
        reader.readAsDataURL(file);
    });
    
    // مسح الحقول
    fileInput.value = '';
    titleInput.value = '';
    
    // تحديث العرض
    setTimeout(() => {
        loadGalleryManagement();
        updateStats();
        alert(`تم إضافة ${fileInput.files.length} صورة بنجاح!`);
    }, 1000);
}

// تعديل صورة
function editImage(imageId) {
    const image = galleryData.find(img => img.id === imageId);
    if (!image) return;
    
    const newCategory = prompt('أدخل التصنيف الجديد:', image.category);
    if (newCategory && newCategory !== image.category) {
        image.category = newCategory;
        loadGalleryManagement();
        alert('تم تحديث التصنيف بنجاح');
    }
}

// حذف صورة
function deleteImage(imageId) {
    if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
        const index = galleryData.findIndex(img => img.id === imageId);
        if (index !== -1) {
            galleryData.splice(index, 1);
            loadGalleryManagement();
            updateStats();
            
            // تحديث المعرض إذا كان مفتوحاً
            if (typeof createGalleryHTML === 'function') {
                createGalleryHTML();
            }
            
            alert('تم حذف الصورة بنجاح');
        }
    }
}

// تحميل رسائل التواصل
function loadContactMessages() {
    const messagesList = document.getElementById('contactMessagesList');
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    
    if (submissions.length === 0) {
        messagesList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">لا توجد رسائل بعد</p>';
        return;
    }
    
    messagesList.innerHTML = '';
    
    submissions.reverse().forEach(submission => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        messageItem.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${submission.name}</span>
                <span class="message-date">${new Date(submission.timestamp).toLocaleString('ar-SA')}</span>
            </div>
            <div class="message-details">
                <p><strong>البريد الإلكتروني:</strong> ${submission.email}</p>
                <p><strong>الهاتف:</strong> ${submission.phone || 'غير محدد'}</p>
                <p><strong>نوع الخدمة:</strong> ${getServiceName(submission.service)}</p>
                <p><strong>الميزانية:</strong> ${getBudgetName(submission.budget)}</p>
            </div>
            <div class="message-content">
                <strong>تفاصيل المشروع:</strong><br>
                ${submission.message}
            </div>
            <div class="message-actions">
                <button class="reply-btn" onclick="replyToMessage('${submission.email}')">رد</button>
                <button class="archive-btn" onclick="archiveMessage(${submission.id})">أرشفة</button>
            </div>
        `;
        messagesList.appendChild(messageItem);
    });
}

// الحصول على اسم الخدمة
function getServiceName(serviceValue) {
    const services = {
        'photography': 'تصوير فوتوغرافي احترافي',
        'video': 'تصوير فيديو إعلاني وتسويقي',
        'social-media': 'تصميم إعلانات سوشيال ميديا',
        'editing': 'مونتاج فيديو احترافي',
        'reels': 'إنتاج مقاطع ريلز قصيرة',
        'events': 'تغطية مهرجانات وفعاليات',
        'podcast': 'إعداد وبث بودكاست بصري',
        'other': 'خدمة أخرى'
    };
    return services[serviceValue] || serviceValue;
}

// الحصول على اسم الميزانية
function getBudgetName(budgetValue) {
    const budgets = {
        'under-500': 'أقل من 500 دولار',
        '500-1000': '500 - 1000 دولار',
        '1000-2000': '1000 - 2000 دولار',
        '2000-5000': '2000 - 5000 دولار',
        'over-5000': 'أكثر من 5000 دولار'
    };
    return budgets[budgetValue] || 'غير محدد';
}

// الرد على رسالة
function replyToMessage(email) {
    window.open(`mailto:${email}?subject=رد على استفسارك - استوديو حسن كلوز&body=شكراً لتواصلك معنا...`);
}

// أرشفة رسالة
function archiveMessage(messageId) {
    if (confirm('هل تريد أرشفة هذه الرسالة؟')) {
        let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions = submissions.filter(sub => sub.id !== messageId);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        loadContactMessages();
        updateStats();
        alert('تم أرشفة الرسالة');
    }
}

// تحديث الإحصائيات
function updateStats() {
    const visitorCount = localStorage.getItem('visitorCount') || 0;
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    
    // حساب الإحصائيات
    const totalImages = galleryData.length;
    const totalLikes = galleryData.reduce((sum, img) => sum + img.likes, 0);
    const totalViews = galleryData.reduce((sum, img) => sum + img.views, 0);
    const totalComments = galleryData.reduce((sum, img) => sum + img.comments.length, 0);
    
    // تحديث العرض
    document.getElementById('totalVisitors').textContent = visitorCount;
    document.getElementById('totalImages').textContent = totalImages;
    document.getElementById('totalLikes').textContent = totalLikes;
    document.getElementById('totalViews').textContent = totalViews;
    document.getElementById('totalMessages').textContent = submissions.length;
    document.getElementById('totalComments').textContent = totalComments;
}

// تصدير البيانات
function exportData() {
    const data = {
        galleryData: galleryData,
        contactSubmissions: JSON.parse(localStorage.getItem('contactSubmissions') || '[]'),
        visitorCount: localStorage.getItem('visitorCount') || 0,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `hassan_clos_studio_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('تم تصدير البيانات بنجاح');
}

// إعادة تعيين الإحصائيات
function resetStats() {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإحصائيات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        // إعادة تعيين عداد الزوار
        localStorage.setItem('visitorCount', '0');
        
        // إعادة تعيين إحصائيات المعرض
        galleryData.forEach(img => {
            img.likes = 0;
            img.views = 0;
            img.comments = [];
        });
        
        // تحديث العرض
        updateStats();
        loadGalleryManagement();
        
        alert('تم إعادة تعيين الإحصائيات بنجاح');
    }
}

// نسخ احتياطي
function backupData() {
    const data = {
        galleryData: galleryData,
        contactSubmissions: JSON.parse(localStorage.getItem('contactSubmissions') || '[]'),
        visitorCount: localStorage.getItem('visitorCount') || 0,
        backupDate: new Date().toISOString()
    };
    
    localStorage.setItem('hassan_clos_backup', JSON.stringify(data));
    alert('تم إنشاء نسخة احتياطية بنجاح');
}

// تحميل البيانات الإدارية
function loadAdminData() {
    loadGalleryManagement();
    loadContactMessages();
    updateStats();
}

// استعادة النسخة الاحتياطية
function restoreBackup() {
    const backup = localStorage.getItem('hassan_clos_backup');
    if (!backup) {
        alert('لا توجد نسخة احتياطية');
        return;
    }
    
    if (confirm('هل تريد استعادة النسخة الاحتياطية؟ سيتم استبدال البيانات الحالية.')) {
        const data = JSON.parse(backup);
        
        // استعادة البيانات
        galleryData.length = 0;
        galleryData.push(...data.galleryData);
        
        localStorage.setItem('contactSubmissions', JSON.stringify(data.contactSubmissions));
        localStorage.setItem('visitorCount', data.visitorCount);
        
        // تحديث العرض
        loadAdminData();
        
        alert('تم استعادة النسخة الاحتياطية بنجاح');
    }
}


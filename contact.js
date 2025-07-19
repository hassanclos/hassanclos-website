// وظائف صفحة التواصل

// إرسال النموذج
function submitForm(event) {
    event.preventDefault();
    
    // الحصول على بيانات النموذج
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        budget: formData.get('budget'),
        message: formData.get('message')
    };
    
    // التحقق من صحة البيانات
    if (!data.name || !data.email || !data.service || !data.message) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('يرجى إدخال بريد إلكتروني صحيح');
        return;
    }
    
    // محاكاة إرسال البيانات
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'جاري الإرسال...';
    submitBtn.disabled = true;
    
    // محاكاة تأخير الإرسال
    setTimeout(() => {
        // حفظ البيانات محلياً (في تطبيق حقيقي، سترسل للخادم)
        saveContactSubmission(data);
        
        // إظهار رسالة نجاح
        showSuccessMessage();
        
        // إعادة تعيين النموذج
        event.target.reset();
        
        // إعادة تعيين الزر
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
}

// حفظ بيانات التواصل محلياً
function saveContactSubmission(data) {
    let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    
    const submission = {
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    submissions.push(submission);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    console.log('تم حفظ طلب التواصل:', submission);
}

// إظهار رسالة النجاح
function showSuccessMessage() {
    // إنشاء عنصر الرسالة
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✅</span>
            <h3>تم إرسال رسالتك بنجاح!</h3>
            <p>سنتواصل معك في أقرب وقت ممكن</p>
        </div>
    `;
    
    // إضافة الأنماط
    successMessage.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3000;
    `;
    
    const successContent = successMessage.querySelector('.success-content');
    successContent.style.cssText = `
        background: white;
        padding: 3rem;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        margin: 0 20px;
    `;
    
    const successIcon = successMessage.querySelector('.success-icon');
    successIcon.style.cssText = `
        font-size: 3rem;
        display: block;
        margin-bottom: 1rem;
    `;
    
    const successTitle = successMessage.querySelector('h3');
    successTitle.style.cssText = `
        color: #28a745;
        margin-bottom: 1rem;
        font-size: 1.5rem;
    `;
    
    const successText = successMessage.querySelector('p');
    successText.style.cssText = `
        color: #666;
        margin: 0;
    `;
    
    // إضافة الرسالة للصفحة
    document.body.appendChild(successMessage);
    
    // إزالة الرسالة بعد 3 ثوان
    setTimeout(() => {
        document.body.removeChild(successMessage);
    }, 3000);
    
    // إزالة الرسالة عند النقر عليها
    successMessage.addEventListener('click', () => {
        document.body.removeChild(successMessage);
    });
}

// تحسين تجربة المستخدم
document.addEventListener('DOMContentLoaded', function() {
    // إضافة تأثيرات التفاعل للحقول
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // إضافة تأثير للأزرار السريعة
    const quickButtons = document.querySelectorAll('.quick-btn');
    quickButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // إضافة تأثير للروابط الاجتماعية
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
});

// وظيفة لعرض طلبات التواصل المحفوظة (للمطورين)
function viewContactSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    console.table(submissions);
    return submissions;
}

// وظيفة لمسح طلبات التواصل المحفوظة
function clearContactSubmissions() {
    localStorage.removeItem('contactSubmissions');
    console.log('تم مسح جميع طلبات التواصل المحفوظة');
}


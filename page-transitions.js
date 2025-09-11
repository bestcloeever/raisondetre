// Smooth page transitions
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-out effect when clicking links
    const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="http"]):not([href^="mailto"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's the same page
            if (href === window.location.pathname) return;
            
            e.preventDefault();
            
            // Add fade-out class to body
            document.body.style.transition = 'opacity 0.3s ease-out';
            document.body.style.opacity = '0';
            
            // Navigate after fade-out
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
    
    // Fade in on page load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease-in';
    
    // Trigger fade-in after a brief delay
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
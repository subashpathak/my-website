document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input').value;
    const message = this.querySelector('textarea').value;
    
    console.log('Lead captured:', { email, message });
    
    alert('Message received! I will review your business needs and get back to you within 24 hours.');
    this.reset();
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
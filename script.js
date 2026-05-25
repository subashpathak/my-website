document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input').value;
    const message = this.querySelector('textarea').value;
    
    // In a real scenario, you'd send this to a backend
    console.log('Form submitted:', { email, message });
    
    alert('Thanks for reaching out! I will get back to you within 24 hours.');
    this.reset();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// JavaScript for interactive features

// Button click event
const myButton = document.getElementById('myButton');
const message = document.getElementById('message');

if (myButton) {
    myButton.addEventListener('click', function() {
        message.textContent = '🎉 Button clicked! Great job!';
        message.style.animation = 'fadeIn 0.5s ease';
        message.style.color = '#667eea';
    });
}

// Contact form submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Get form values
        const formInputs = contactForm.querySelectorAll('input, textarea');
        const name = formInputs[0].value;
        const email = formInputs[1].value;
        const messageText = formInputs[2].value;
        
        // Display confirmation message
        alert(`Thank you, ${name}! Your message has been sent.\nWe'll get back to you at ${email} soon.`);
        
        // Clear form
        contactForm.reset();
    });
}

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Change button color on hover
if (myButton) {
    myButton.addEventListener('mouseenter', function() {
        console.log('Button hovered!');
    });
}

// Log page load
console.log('Website loaded successfully!');

// Add animation for fade-in effect
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

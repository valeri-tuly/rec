import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';

emailjs.init('MeG_AUJX35hyw0i2i');

document.addEventListener("DOMContentLoaded", () => {
    const footerForm = document.querySelector("#footer-contact-form");
    if (!footerForm) return;

    footerForm.addEventListener("submit", function(e) {
        e.preventDefault();

        emailjs.send('service_b3lr60p', 'template_ke477j8', {
            email: this.email.value
        })
        .then(() => {
            alert("Kiitos! Otamme sinuun yhteyttä 👍");
            this.reset();
        })
        .catch((error) => {
            alert("Virhe! Yritä uudelleen 😢");
            console.log(error);
        });
    });
});

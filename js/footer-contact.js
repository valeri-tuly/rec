// Инициализация EmailJS
(function(){
  emailjs.init("MeG_AUJX35hyw0i2i");
})();
// Обработка формы
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#footer-contact-form");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        emailjs.send("service_b3lr60p", "template_ke477j8", {
            email: this.email.value,
        }).then(() => {

            alert("Kiitos! Viestisi on lähetetty ❤️");
            this.reset();

        }, (error) => {
            alert("Virhe! Yritä uudelleen 😢");
            console.log(error);
        });
    });
});

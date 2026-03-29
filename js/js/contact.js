// Инициализация EmailJS
(function(){
  emailjs.init("MeG_AUJX35hyw0i2i");
})();
console.log("JS подключен");
// Обработка формы
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#contact-form");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        emailjs.send("service_b3lr60p", "template_5qdozpm", {
            name: this.name.value,
            email: this.email.value,
            message: this.message.value,
            company: this.company.value
        }).then(() => {

            alert("Kiitos! Viestisi on lähetetty ❤️");
            this.reset();

        }, (error) => {
            alert("Virhe! Yritä uudelleen 😢");
            console.log(error);
        });
    });
});

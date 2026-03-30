document.addEventListener("DOMContentLoaded", function () {
    const footerForm = document.querySelector("#footer-contact-form");

    if (!footerForm) return;

    footerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        emailjs.send("service_b3lr60p", "template_5qdozpm", {
            name: "Footer user",
            email: this.email.value,
            message: "Contact request from footer",
            company: "-"
        }).then(() => {

            alert("Kiitos! Otamme sinuun yhteyttä 👍");
            this.reset();

        }, (error) => {
            alert("Virhe! Yritä uudelleen 😢");
            console.log(error);
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const footerForm = document.querySelector("#footer-contact-form");

    if (!footerForm) return;

    footerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        emailjs.send("service_b3lr60p", "template_ke477j8", {
            email: this.email.value
        }).then(() => {

            alert("Kiitos! Otamme sinuun yhteyttä 👍");
            this.reset();

        }, (error) => {
            alert("Virhe! Yritä uudelleen 😢");
            console.log(error);
        });
    });
});

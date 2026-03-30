$(document).ready(function() {

    // 1. Создаем overlay и fullscreen контейнер динамически
    if ($('#nav-overlay').length === 0) {
        $('body').append('<div id="nav-overlay"></div>');
    }

    if ($('#nav-fullscreen').length === 0) {
        $('body').append('<nav id="nav-fullscreen"></nav>');
        // перемещаем сгенерированное slicknav меню внутрь
        $('.menu-slicknav').appendTo('#nav-fullscreen');
    }

    // 2. resize overlay под диагональ окна
    function resizeNav() {
        var radius = Math.sqrt(Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2));
        var diameter = radius * 2;

        $("#nav-fullscreen").css({"height": window.innerHeight});
        $("#nav-overlay").css({
            width: diameter,
            height: diameter,
            "margin-top": -radius,
            "margin-left": -radius
        });
    }
    $(window).resize(resizeNav);
    resizeNav();

    // 3. Клик по кнопке: открываем overlay + меню
    $("#nav-toggle").click(function(e) {
        e.preventDefault();
        $("#nav-toggle, #nav-overlay, #nav-fullscreen").toggleClass("open");
    });

    // 4. Инициализация slicknav (как было)
    $('.menu').slicknav({
        label: '',             // убираем надпись MENU внутри slicknav
        prependTo: 'body',     // пусть генерирует меню в body, потом JS переместит в overlay
        closeOnClick: true
    });
});

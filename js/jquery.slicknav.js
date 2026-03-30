;(function ($, document, window) {
    var defaults = {
        label: 'MENU',
        duplicate: true,
        duration: 200,
        easingOpen: 'swing',
        easingClose: 'swing',
        closedSymbol: '&#9658;',
        openedSymbol: '&#9660;',
        prependTo: 'body',
        appendTo: '',
        parentTag: 'a',
        closeOnClick: false,
        allowParentLinks: false,
        nestedParentLinks: true,
        showChildren: false,
        removeIds: true,
        removeClasses: false,
        removeStyles: false,
        brand: '',
        animations: 'circle', // кастомная анимация
        init: function () {},
        beforeOpen: function () {},
        beforeClose: function () {},
        afterOpen: function () {},
        afterClose: function () {}
    },
    mobileMenu = 'slicknav',
    prefix = 'slicknav',
    Keyboard = {DOWN:40, ENTER:13, ESCAPE:27, LEFT:37, RIGHT:39, SPACE:32, TAB:9, UP:38};

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        if (!this.settings.duplicate && !options.hasOwnProperty("removeIds")) {
            this.settings.removeIds = false;
        }
        this._defaults = defaults;
        this._name = mobileMenu;
        this.init();
    }

    Plugin.prototype.init = function () {
        var $this = this,
            menu = $(this.element),
            settings = this.settings,
            iconClass, menuBar;

        if (settings.duplicate) $this.mobileNav = menu.clone();
        else $this.mobileNav = menu;

        if (settings.removeIds) $this.mobileNav.removeAttr('id').find('*').removeAttr('id');
        if (settings.removeClasses) $this.mobileNav.removeAttr('class').find('*').removeAttr('class');
        if (settings.removeStyles) $this.mobileNav.removeAttr('style').find('*').removeAttr('style');

        iconClass = prefix + '_icon';
        if (settings.label === '') iconClass += ' ' + prefix + '_no-text';
        if (settings.parentTag == 'a') settings.parentTag = 'a href="#"';

        $this.mobileNav.attr('class', prefix + '_nav');
        menuBar = $('<div class="' + prefix + '_menu"></div>');
        if (settings.brand !== '') {
            var brand = $('<div class="' + prefix + '_brand">'+settings.brand+'</div>');
            $(menuBar).append(brand);
        }
        $this.btn = $(['<' + settings.parentTag + ' aria-haspopup="true" role="button" tabindex="0" class="' + prefix + '_btn ' + prefix + '_collapsed">',
                '<span class="' + prefix + '_menutxt">' + settings.label + '</span>',
                '<span class="' + iconClass + '">',
                    '<span class="' + prefix + '_icon-bar"></span>',
                    '<span class="' + prefix + '_icon-bar"></span>',
                    '<span class="' + prefix + '_icon-bar"></span>',
                '</span>',
            '</' + settings.parentTag + '>'].join(''));
        $(menuBar).append($this.btn);
        if(settings.appendTo !== '') $(settings.appendTo).append(menuBar);
        else $(settings.prependTo).prepend(menuBar);
        menuBar.append($this.mobileNav);

        // Инициализация подменю
        var items = $this.mobileNav.find('li');
        $(items).each(function () {
            var item = $(this), data = {};
            data.children = item.children('ul').attr('role', 'menu');
            item.data('menu', data);
            if (data.children.length > 0) {
                var a = item.contents(), containsAnchor=false, nodes=[];
                $(a).each(function() {
                    if (!$(this).is('ul')) nodes.push(this);
                    if($(this).is("a")) containsAnchor = true;
                });

                var wrapElement = $('<' + settings.parentTag + ' role="menuitem" aria-haspopup="true" tabindex="-1" class="' + prefix + '_item"/>');
                if ((!settings.allowParentLinks || settings.nestedParentLinks) || !containsAnchor) {
                    $(nodes).wrapAll(wrapElement).parent().addClass(prefix+'_row');
                } else $(nodes).wrapAll('<span class="'+prefix+'_parent-link '+prefix+'_row"/>');

                if (!settings.showChildren) item.addClass(prefix+'_collapsed');
                else item.addClass(prefix+'_open');
                item.addClass(prefix+'_parent');

                var arrowElement = $('<span class="'+prefix+'_arrow">'+(settings.showChildren?settings.openedSymbol:settings.closedSymbol)+'</span>');
                if (settings.allowParentLinks && !settings.nestedParentLinks && containsAnchor) arrowElement = arrowElement.wrap(wrapElement).parent();
                $(nodes).last().after(arrowElement);
            } else if (item.children().length === 0) item.addClass(prefix+'_txtnode');
            item.children('a').attr('role','menuitem');
        });

        // Скрываем все подменю по умолчанию
        $(items).each(function() {
            var data = $(this).data('menu');
            if (!settings.showChildren){
                this.classList.add(prefix+'_collapsed');
            }
        });

        // outline
        $(document).mousedown(function(){ $this._outlines(false); });
        $(document).keyup(function(){ $this._outlines(true); });

        $($this.btn).click(function (e) { e.preventDefault(); $this._menuToggle(); });
        $this.mobileNav.on('click', '.' + prefix + '_item', function (e) { e.preventDefault(); $this._itemClick($(this)); });
    };

    Plugin.prototype._menuToggle = function () {
        var $this = this;
        var btn = $this.btn;

        if (btn.hasClass(prefix+'_collapsed')) btn.removeClass(prefix+'_collapsed').addClass(prefix+'_open');
        else btn.removeClass(prefix+'_open').addClass(prefix+'_collapsed');
        btn.addClass(prefix+'_animating');

        // кастомная анимация кругом
        if ($this.settings.animations === 'circle') {
            var $overlay = $("#nav-overlay");
            var $fullscreen = $("#nav-fullscreen");
            var radius = Math.sqrt(Math.pow(window.innerHeight,2) + Math.pow(window.innerWidth,2));
            var diameter = radius * 2;
            $overlay.width(diameter).height(diameter).css({"margin-top": -radius,"margin-left": -radius});

            $overlay.toggleClass("open");
            $fullscreen.toggleClass("open");
        }
    };

    Plugin.prototype._itemClick = function (el) {
        var $this = this;
        var settings = $this.settings;
        var data = el.data('menu');
        if (!data) {
            data = {};
            data.arrow = el.children('.'+prefix+'_arrow');
            data.ul = el.next('ul');
            data.parent = el.parent();
            if (data.parent.hasClass(prefix+'_parent-link')) {
                data.parent = el.parent().parent();
                data.ul = el.parent().next('ul');
            }
            el.data('menu', data);
        }

        if (data.parent.hasClass(prefix+'_collapsed')) {
            data.arrow.html(settings.openedSymbol);
            data.parent.removeClass(prefix+'_collapsed').addClass(prefix+'_open').addClass(prefix+'_animating');
        } else {
            data.arrow.html(settings.closedSymbol);
            data.parent.addClass(prefix+'_collapsed').removeClass(prefix+'_open').addClass(prefix+'_animating');
        }

        // Круговая анимация при клике
        if ($this.settings.animations === 'circle') {
            var $overlay = $("#nav-overlay");
            var $fullscreen = $("#nav-fullscreen");
            var radius = Math.sqrt(Math.pow(window.innerHeight,2) + Math.pow(window.innerWidth,2));
            var diameter = radius * 2;
            $overlay.width(diameter).height(diameter).css({"margin-top": -radius,"margin-left": -radius});

            $overlay.toggleClass("open");
            $fullscreen.toggleClass("open");
        }
    };

    Plugin.prototype._visibilityToggle = function(){};

    Plugin.prototype._outlines = function(state){
        if (!state) $('.'+prefix+'_item, .'+prefix+'_btn').css('outline','none');
        else $('.'+prefix+'_item, .'+prefix+'_btn').css('outline','');
    };

    $.fn[mobileMenu] = function ( options ) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + mobileMenu)) {
                    $.data(this, 'plugin_' + mobileMenu, new Plugin( this, options ));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;
            this.each(function () {
                var instance = $.data(this, 'plugin_' + mobileMenu);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }
            });
            return returns !== undefined ? returns : this;
        }
    };
}(jQuery, document, window));

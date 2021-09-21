$( document ).ready(function() {
    $('.dropdown').hover(function(){ 
    $('.dropdown-toggle', this).trigger('click'); 
    });
})

;
window.onload = function () {
    document.addEventListener('click', documentActions);

    // Actions
    function documentActions(e) {
        const targetElement = e.target;
    }

    const body = document.body,
        html = document.documentElement;

    const pageHeight = Math.max( body.scrollHeight, body.offsetHeight, 
                        html.clientHeight, html.scrollHeight, html.offsetHeight );

    const goTop = document.getElementById('back-to-top'); 
    const clientHeight = window.innerHeight;
    const pageStatusBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', function() {
        var posY = window.pageYOffset;
        if (goTop) {
            if (posY > clientHeight) {
                goTop.style.display = 'flex';
            } else {
                goTop.style.display = 'none';
            }
        }
        if (window.innerWidth > 565) {
            pageBar(posY);   
        }
    })

    function pageBar(pos) {
        width = pos / (pageHeight - clientHeight ) * 100;
        pageStatusBar.style.width = width + '%';
    }

    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
        tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
        this.style.height = "32px";
        this.style.height = (this.scrollHeight) + "px";
    }
}

;
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
        return !item.dataset.spollers.split(',')[0];
    });
    if (spollersRegular.length > 0) {
        initSpollers(spollersRegular);
    }

    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
        return item.dataset.spollers.split(',')[0];
    });
    if (spollersMedia.length > 0) {
        const breakpointsArray = [];
        spollersMedia.forEach(item => {
            const params =  item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(',');
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });

        let mediaQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + '-width: ' + item.value + 'px),' + item.value + ',' + item.type;
        });
        // Get Unique breakpoints
        mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        }); 

        // Work with each breakpoint
        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(',');
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            // Match needed objects 
            const spollersArray = breakpointsArray.filter(function (item) {
                if (item.value === mediaBreakpoint && item.type === mediaType) {
                    return true;
                }
            })

            // Event
            matchMedia.addListener(function () {
                initSpollers(spollersArray, matchMedia);
            });
            initSpollers(spollersArray, matchMedia);
        })
    }

    // Init
    function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener('click', setSpollerAction);
            } else {
                spollersBlock.classList.remove('_init');
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener('click', setSpollerAction);
            }
        })
    }
    // Content
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
        if (spollerTitles.length > 0) {
            spollerTitles.forEach(spollerTitle => {
                if (hideSpollerBody) {
                    spollerTitle.removeAttribute('tabindex');
                    if (!spollerTitle.classList.contains('_active')) {
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                } else {
                    spollerTitle.setAttribute('tabindex', '-1');
                    spollerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }
    function setSpollerAction(e) {
        const el = e.target;
        if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('[data-one-spoller]') ? true : false;
            if (!spollersBlock.querySelectorAll('._slide').length) {
                if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                    hideSpollerBody(spollersBlock);
                }
                spollerTitle.classList.toggle('_active');
                _slideToggle(spollerTitle.nextElementSibling, 500)
            }
            e.preventDefault();
        }
    }
    function hideSpollerBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelectorAll('[data-spoller]._active');
        if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
        }
    }
} 

// ================================================================
let _slideUp = (target, duration=500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = 'true';
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration) 
    }
}

let _slideDown = (target, duration=500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        if (target.hidden) {
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration) 
    }
}
let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
};
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
    for (let i = 0; i < sliders.length; i++) {
        let slider = sliders[i];
        if (!slider.classList.contains('swiper-bild')) {
            let slider_items = slider.children;
            if (slider_items) {
                for (let i = 0; i < slider_items.length; i++) {
                    let el = slider_items[i];
                    el.classList.add('swiper-slide');
                }
            }
            let slider_content = slider.innerHTML;
            let slider_wrapper = document.createElement('div');
            slider_wrapper.classList.add('swiper-wrapper');
            slider_wrapper.innerHTML = slider_content;
            slider.innerHTML = '';
            slider.appendChild(slider_wrapper);
            slider.classList.add('swiper-bild');

            if (slider.classList.contains('_swiper-scroll')) {
                let sliderScroll = document.createElement('div');
                sliderScroll.classList.add('swiper-scrollbar');
                slider.appendChild(sliderScroll);
            }
        }
    }
    sliders_bild_callback();
}

function sliders_bild_callback(params) {}

if (document.querySelector('.intro-slider-main__body')) {
    var menu = ['Мы в инстаграме', 'Новый дизайн', 'Мы в инстаграме', 'Новый дизайн'];
    var introMain = new Swiper('.intro-slider-main__body', {
        loop: true,
        slidesPerView: 1,
        autoplayDisableOnInteraction: false,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 800,
        autoplay: {
            delay: 8000,
        },
        // arrows
        preLoadImages: false,
        lazy: true,
        pagination: {
        el: '.intro-slider-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"><div class="progress-bar"><div class="progress"></div></div>' + '<div class="intro-slider-pagination-title">' + (menu[index]) + '</div></span>';
            },
        },
    });
}

if (document.querySelector('.water-slider__body')) {
    var introMain = new Swiper('.water-slider__body', {
        autoplayDisableOnInteraction: false,
        speed: 800,
        // arrows
        preLoadImages: false,
        lazy: true,
        scrollbar: {
            el: '.water-slider__scrollbar',
            draggable: true,
        },
        navigation: {
            nextEl: '.water-slider__controls .slider-arrow--next' ,
            prevEl: '.water-slider__controls .slider-arrow--prev'
        },
        breakpoints: {
            1200:  {
                spaceBetween: 10,
                slidesPerView: 3,
            },
            991:  {
                spaceBetween: 10,
                slidesPerView: 2,
            },
            765:  {
                spaceBetween: 10,
                slidesPerView: 1,
            },
            565:  {
                spaceBetween: 10,
                slidesPerView: 2,
            },
            320:  {
                spaceBetween: 10,
                slidesPerView: 1,
            },
        }
    });
}

if (document.querySelector('.drinks-slider__body')) {
    var introMain = new Swiper('.drinks-slider__body', {
        loop: true,
        spaceBetween: 10,
        slidesPerView: 5,
        slidesPerGroup: 5,
        autoplayDisableOnInteraction: false,
        speed: 800,
        // arrows
        preLoadImages: false,
        lazy: true,
        navigation: {
            nextEl: '.drinks-controls .slider-arrow-square--next' ,
            prevEl: '.drinks-controls .slider-arrow-square--prev'
        },
        pagination: {
            el: '.drinks-slider .pagination-dashed',
            clickable: true,
        },
        breakpoints: {
            991: {
                spaceBetween: 10,
                slidesPerView: 5,
                slidesPerGroup: 5
            },
            768: {
                spaceBetween: 10,
                slidesPerView: 4,
                slidesPerGroup: 4
            },
            565: {
                spaceBetween: 10,
                slidesPerView: 3,
                slidesPerGroup: 3
            },
            360: {
                spaceBetween: 10,
                slidesPerView: 2,
                slidesPerGroup: 2
            },
            320: {
                spaceBetween: 10,
                slidesPerView: 1,
                slidesPerGroup: 1
            }
        }

    });
};
function isMobileDevice() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

function removeClasses(targets, classToDelete) {
    for (let i = 0; i < targets.length; i++) {
        target = targets[i];
        target.classList.remove(classToDelete);
    }
}

function ibg() {
    let ibg = document.querySelectorAll("._ibg");
    for (var i = 0; i < ibg.length; i++) {
        if (ibg[i].querySelector('img')) {
            ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
        }
    }
}

ibg();
;
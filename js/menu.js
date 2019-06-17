var header = document.querySelector('.header');
var toggle = document.querySelector('.header__toggle');

toggle.addEventListener('click', () => {
    header.classList.toggle( 'header--menu-open' );
    toggle.classList.toggle( 'header__toggle--close' );
})
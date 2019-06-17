var header = document.querySelector('.header');
var curr = null;
var sections = [ ...document.querySelectorAll('[data-header-classes]') ].map( el => ({
    classes: el.dataset.headerClasses.split(' '),
    el
})).reverse();
var update;
if ( sections.length ) {
    update = () => {
        var section = sections.find( s => s.el.getBoundingClientRect().top <= 0 ) || sections[ sections.length - 1 ];
        if ( section !== curr ) {
            if ( curr !== null ) header.classList.remove( ...curr.classes );
            header.classList.add( ...section.classes );
            curr = section;
        }
    }
} else {
    update = () => header.classList.toggle( 'header--compact', window.pageYOffset > 0 )
}
window.addEventListener( 'scroll', update );
window.addEventListener( 'resize', update );
update();
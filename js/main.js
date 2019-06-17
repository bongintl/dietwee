require('smoothscroll-polyfill').polyfill();

var FontFaceObserver = require('fontfaceobserver');

Promise.all([
    new FontFaceObserver( 'Patron' ).load(),
    new FontFaceObserver( 'Patron', { weight: 'bold' }).load()
]).then(() => window.requestAnimationFrame(() => {
    require('object-fit-images')();
    require('./menu')
    require('./intro')
    require('./header')
    require('./video')
    require('./gallery')
    document.documentElement.classList.remove('hidden');
}))

// var header = document.querySelector('header');
// var expanded = true;

// var CENTER = .6;

// var center = el => el.offsetTop + el.offsetHeight * CENTER;

// var fixedClone = el => {
//     var fixed = el.cloneNode( true );
//     fixed.style.position = 'fixed';
//     fixed.style.visibility = 'hidden';
//     el.parentNode.insertBefore( fixed, el.nextSibling );
//     return { scroll: el, fixed, both: fn => { fn( el ); fn( fixed ) } }
// }

// var showFixed = ({ scroll, fixed }) => {
//     scroll.style.visibility = 'hidden';
//     fixed.style.visibility = '';
// }

// var showScroll = ({ scroll, fixed }) => {
//     scroll.style.visibility = '';
//     fixed.style.visibility = 'hidden';
// }

// var intro = fixedClone( document.querySelector('.intro') );

// var collapse = () => intro.both( el => {
//     el.style.height = center( el.querySelectorAll('.intro__end')[0] ) + 'px'
//     el.classList.remove('intro--expanded');
//     expanded = false;
// })

// var expand = () => intro.both( el => {
//     el.style.height = center( el.querySelectorAll('.intro__end')[1] ) + 'px'
//     el.classList.add('intro--expanded');
//     expanded = true;
// })

// var toggle = () => expanded ? collapse() : expand();

// var projects = [ ...document.querySelectorAll('.project') ].map( fixedClone );
// projects.forEach( ({ fixed }) => fixed.style.bottom = 0 )

// var projectHeight = () => window.innerHeight - header.offsetHeight - document.querySelector('.intro__end').offsetHeight * CENTER;

// var sizeProjects = () => {
//     var h = projectHeight();
//     projects.forEach( ({scroll, fixed}) => {
//         scroll.style.height = fixed.style.height = h + 'px';
//     })
// }

// var onscroll = () => {
//     var st = window.pageYOffset;
//     var top = window.innerHeight - projectHeight();
//     projects.forEach( project => {
//         var rect = project.scroll.getBoundingClientRect();
//         var text = project.fixed.querySelector('.project__text');
//         if ( rect.bottom < window.innerHeight ) {
//             showFixed( project );
//         } else {
//             showScroll( project );
//         }
//         var offset = rect.bottom - top - text.offsetHeight;
//         text.style.transform = `translateY( ${ Math.min( offset, 0 ) }px )`
//     })
//     if ( intro.scroll.getBoundingClientRect().bottom < top ) {
//         showFixed( intro )
//         intro.fixed.style.bottom = window.innerHeight - top + 'px';
//     } else {
//         showScroll( intro )
//     }
// }

// expand();
// setTimeout( collapse, 500);
// sizeProjects();
// onscroll();
// intro.both( el => el.addEventListener( 'click', toggle ) );
// window.addEventListener( 'scroll', onscroll );



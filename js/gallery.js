var threshold = 10;

var findIndexRight = ( arr, fn ) => {
    for ( var i = arr.length - 1; i >= 0; i-- ) {
        if ( fn( arr[ i ], i, arr ) ) return i;
    }
    return -1;
}

document.querySelectorAll( '.gallery' ).forEach( gallery => {
    var scroll = gallery.querySelector( '.gallery__images' );
    var images = [ ...gallery.querySelectorAll( '.gallery__image' ) ];
    var left = gallery.querySelector( '.gallery__arrow--left' );
    var right = gallery.querySelector( '.gallery__arrow--right' );
    var padding;
    var updatePadding = () => {
        padding = parseInt( window.getComputedStyle( scroll )[ 'padding-left' ] );
    }
    updatePadding();
    window.addEventListener( 'resize', updatePadding );
    var findPrev = () => findIndexRight( images, image => {
        return image.getBoundingClientRect().left < padding - threshold;
    })
    var findNext = () => images.findIndex( image => {
        return image.getBoundingClientRect().left > padding + threshold;
    })
    var goto = i => {
        if ( i === -1 ) return;
        scroll.scrollTo({ left: images[ i ].offsetLeft - padding, behavior: 'smooth' });
    }
    left.addEventListener( 'click', () => goto( findPrev() ) )
    right.addEventListener( 'click', () => goto( findNext() ) )
    var updateArrows = () => {
        left.classList.toggle( 'gallery__arrow--disabled', findPrev() === -1 );
        right.classList.toggle( 'gallery__arrow--disabled', findNext() === -1 );
    }
    scroll.addEventListener( 'scroll', updateArrows );
    images.forEach( ( image, i ) => {
        image.addEventListener('click', () => goto( i ) )
    });
})
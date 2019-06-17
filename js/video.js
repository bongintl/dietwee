var debounce = ( fn, delay ) => {
    var timer;
    return ( ...args ) => {
         clearTimeout( timer );
         setTimeout( fn, delay, ...args );
    }
}

var play = element => {
    var p = element.play();
    if ( p instanceof Promise ) return p;
    return Promise.resolve();
}

document.querySelectorAll( 'video' ).forEach( video => {
    var update = debounce(() => {
        var { top, bottom } = video.getBoundingClientRect();
        if ( top < window.innerHeight && bottom > 0 ) {
            window.removeEventListener( 'scroll', update );
            if ( video.classList.contains('must-autoplay') ) {
                video.play()
                    .catch(() => video.parentNode.removeChild( video ) );
            }
        }
    }, 200 )
    window.addEventListener( 'scroll', update );
    update();
})
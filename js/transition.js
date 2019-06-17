var onTransitionEnd = (() => {
    var eventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'mozTransitionEnd',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd'
    }
    if ( 'TransitionEvent' in window ) eventNames.transition = 'transitionend';
    var testEl = document.createElement('div');
    var eventName;
    for ( var prop in eventNames ) {
        if ( prop in testEl.style ) {
            eventName = eventNames[ prop ];
            break;
        }
    }
    if ( eventName ) return ( el, fn ) => el.addEventListener( eventName, fn );
    return ( el, fn, delay = 0 ) => setTimeout( fn, delay );
})()

document.querySelectorAll('a[href]:not([href^="#"]').forEach( a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        onTransitionEnd( document.documentElement, () => window.location = a.href )
        document.documentElement.classList.add('hidden');
    })
})
var sticky = require('./utils/sticky');

var LAST_LINE_CLIP = .6;

document.querySelectorAll('.intro').forEach( intro => {
    var header = document.querySelector('.header');
    var expandedText = intro.querySelector('.intro__expanded');
    var line = intro.querySelector('.intro__end');
    var headerHeight, collapsedHeight, expandedHeight, lineHeight;
    var images = document.querySelectorAll('.projects__image');
    var captionContainers = document.querySelectorAll('.projects__caption-container');
    var captions = document.querySelectorAll('.projects__caption');
    var measure = () => {
        intro.style.height = '';
        headerHeight = header.offsetHeight;
        lineHeight = line.offsetHeight * .95;
        expandedText.style.display = 'none';
        collapsedHeight = intro.offsetHeight;
        expandedText.style.display = '';
        expandedHeight = intro.offsetHeight;
    }
    var expanded = false;
    var style = ( prop, value ) => el => el.style[ prop ] = value;
    var setTop = () => {
        var top = headerHeight + lineHeight * LAST_LINE_CLIP;
        var introHeight = expanded ? expandedHeight : collapsedHeight;
        var blockHeight = window.innerHeight - top;
        [ ...images, ...captionContainers ].forEach( style( 'height', blockHeight + 'px' ) );
        if ( sticky ) {
            intro.style.top = -introHeight + top + 'px';
            [ ...images, ...captions ].forEach( style( 'top', top + 'px' ) );
        }
    }
    var expand = ( scroll = true ) => {
        intro.classList.add('intro--expanded');
        intro.style.height = expandedHeight + 'px';
        expanded = true;
        setTop();
        if ( scroll ) window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
    var collapse = ( scroll = true ) => {
        intro.classList.remove('intro--expanded');
        intro.style.height = collapsedHeight + 'px';
        expanded = false;
        setTop();
        if ( scroll ) window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
    var toggle = () => expanded ? collapse() : expand();
    intro.addEventListener( 'click', toggle );
    var onResize = () => {
        measure();
        expanded ? expand( false ) : collapse( false );
    }
    window.addEventListener( 'resize', onResize );
    onResize();
})
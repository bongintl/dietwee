module.exports = ['sticky', '-webkit-sticky', '-moz-sticky', '-ms-sticky'].find( prop => {
    const testNode = document.createElement('div');
    try {
        testNode.style.position = prop;
    } catch( e ) {}
    return testNode.style.position != '';
})
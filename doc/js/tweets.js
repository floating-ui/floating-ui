/* globals $, twttr */

$('.twitter-tweet').each(function(index, block) {
    twttr.widgets.createTweet(
        block.getAttribute('id'), block,
        {
            conversation : 'none',    // or all
            cards        : 'visible',  // or visible
            theme        : 'light'    // or dark
        })
        .then (function (el) {
        el.contentDocument.querySelector('.footer').style.display = "none";
    });
});

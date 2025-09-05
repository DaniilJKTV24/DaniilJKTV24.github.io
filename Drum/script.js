//Check for document readiness
$(function() {
    //Fish for event "Key push"
    $(this).keydown(function(event) {
        //Create var where we put div with appropriate data-key in
        var key = $(this).find('.key[data-key='+event.which+']');
        //Find on a page audio tag with needed data-key and put it in a var for comfort
        var audio = $(this).find('audio[data-key='+event.which+']')[0];
        //Attach active class to the key to highlight it
        key.toggleClass('playing');
        //Check for audio tag with this data-key existance
        if (!audio) return;
        //Play sound
        audio.play();
        //Audio track timer is set to 0 again
        audio.currentTime = 0;
    });

    //Monitor event, when user releases a button
    $(this).keyup(function(event) {
        //Create var with needed data-key again
        var key = $(this).find('.key[data-key='+event.which+']');
        //Remove class that highlights a button
        key.toggleClass('playing');
    });
});
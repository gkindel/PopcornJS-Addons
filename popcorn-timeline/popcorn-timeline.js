

/*
 an example transcript plugin for popcorn.js

 requires: jquery, popcorn.js
 author: @gkindel
 license: MIT

 use:
 popcorn.transcript({
 target : "#myTranscript"
 start: 0,
 end:5,
 text: "A transcript sentence."
 });
 */

Popcorn.plugin("timeline", {
    _setup: function(options) {
        var body = $(options.target).get(0).children[0];
        if( ! body)
            body = $("<div></div>").addClass("tl")
                .css("position", "relative")
                .appendTo(options.target);

        var self = this;
        var text = options.text.replace(/<br\s*\/?>/ig, " ");

        var scale = options.pixelsPerSec || 10;
        var duration = options.end - options.start;

        options.el = $("<div/>")
            .addClass("tl-item")
            .append( $("<div/>").addClass("tl-text").html(text + " ") )
            .append( $("<div/>").addClass("tl-time").text( Math.round(options.start) ))
            .css("top",  options.start * scale )
            .css("height", duration * scale )
            .attr("title", text )
            .click( function () { self.media.currentTime = options.start + .01 })
            .appendTo(body);

    },


    start : function (event,options) {
        options.el.addClass("active");
        var scroll = (options.el.parent().scrollTop() + options.el.position().top)
            - ( options.el.parent().height() - options.el.height() ) * .5;

        options.el.parent().stop().animate({ 'scrollTop' :  scroll }, 750);
        console.log("scroll",scroll)
        $(options.target).find(".last").removeClass("last");
    },


    end : function (event,options) {
        options.el.removeClass("active");
        options.el.addClass("last");
    },

    _teardown: function( options ) {
        $(options.target).empty();
    }
});
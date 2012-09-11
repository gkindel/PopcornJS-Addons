

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

Popcorn.plugin("transcript", {
    _setup: function(options) {

        // create body so we know our items's y offset
        var body = $(options.target).get(0).children[0];
        if( ! body)
            body = $("<div></div>").addClass("tx-body")
                .css("position", "relative")
                .appendTo(options.target);

        var self = this;
        var text = options.text.replace(/<br\s*\/?>/ig, " ");
        options.el = $("<div/>")
            .addClass("tx-line")
            .append( $("<span/>").addClass("tx-time").text( Math.round(options.start) + "s :: ") )
            .append( $("<span/>").addClass("tx-text").html(text + " ") )
            .click( function () { self.media.currentTime = options.start + .01 })
            .appendTo(body);
    },

    start : function (event,options) {
        options.el.addClass("active");
        var body = $(options.target).children(0);
        var t = $(options.target);

        var scroll =  options.el.position().top - (t.height() * .5);

        t.stop().animate({ 'scrollTop' :  scroll }, 1500);

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
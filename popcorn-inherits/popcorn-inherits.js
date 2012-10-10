/**
 Popcorn Inherits

 - A PopcornJS mod which allows for an observing plugin to receive events from another, possibly
 unimplemented, plugin.  Live example: http://jsfiddle.net/gkindel/s2Q6N/

 Copyright (c) 2012 RAMP Holdings, Inc.

 Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

  Example use:
    <script src="lib/popcorn-complete.js"></script>
    <script src="lib/popcorn.transcript.js"></script>
    <script src="popcorn-inherits.js"></script>

     <video id='video' muted controls poster="elephants_dream/elephant.png">
        <source id='mp4' src="http://archive.org/download/ElephantsDream/ed_1024_512kb.mp4" type='video/mp4'>
        <source id='ogv' src="http://archive.org/download/ElephantsDream/ed_1024.ogv" type='video/ogg'>
     </video>

    <script>
    var popcorn = Popcorn("video");

    // inherit events from one or more plugins using popcorn's defaults()
    popcorn.defaults("transcript", {
        inherits : "not_implemented, subtitle",
        target : "#tx"
    });

    // allows for inheriting subtitle events
    popcorn.subtitle({
        start: 0,
        end:3,
        text: "subtitle events are inherited"
    });

    // normal use case allows for additional, child-only events
    popcorn.transcript({
        start: 3,
        end:5,
        text: "popcorn.transcript() still works"
    });

    // allows for inheriting from abstract plugins:
    popcorn.not_implemented({
        start: 5,
        end:8,
        text: "abstract plugin support"
    });

    // particularly useful for parsers which don't let us specify import names
    popcorn.parseSRT("elephants_dream/elephant.english.srt");

    </script>
 */

(function () {
    /**
     * @name Popcorn Inheritance
     * @description (proof of concept, ie. hack)
     * @author gkindel@ramp.com
     * @author @gkindel
     */

    var map = {};

    function dispatch (name, id, options) {
        var plugins =  map[name];
        if( ! plugins)
            return;

        // add the track for named plugin if any
        var orig = Popcorn.prototype[name].pluginFn;
        if( orig )
            orig.call(this, id, options);

        var opt =  options || id;
        delete opt.id; // strip ids, they're unique would clobber the original

        for( var i = 0; i <  plugins.length; i++ ){
            plugins[i].call(this, opt );
        }
    }

    function attach (subjects, observer) {
        var plugins = subjects.split(/[,\s]+/);
        var subject;
        while( plugins.length ){
            subject = plugins.shift();
            register(subject);
            map[subject].push(Popcorn.prototype[observer]);
        }
    }

    function register (name) {
        if( map[name] )
            return;

        var restore;
        map[name] = [];

        if( Popcorn.registryByName[ name ] )
            restore = Popcorn.prototype[name];

        Popcorn.prototype[name] = function ( id, options ) {
            dispatch.call(this, name, id, options)
        };

        Popcorn.prototype[name].pluginFn = restore;
    }

    // intercept calls to Popcorn.defaults()
    Popcorn.prototype._defaults = Popcorn.prototype.defaults;
    Popcorn.prototype.defaults = function(  plugin, options  ) {
        this._defaults.apply(this, arguments);
        if( options.inherits )
            attach(options.inherits, plugin);
    };

    // explicit support
    Popcorn.inherits = function (child, parents) {
        attach(parents, child);
    }

})();

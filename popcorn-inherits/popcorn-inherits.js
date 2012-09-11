

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
        delete opt.id;

        for( var i = 0; i <  plugins.length; i++ ){
            // strip ids, they're unique would clobber the original
            plugins[i].call(this, opt );
        }
    }

    function attach (subjects, observer) {
        var plugins = subjects.split(/[,\s]+/);
        var subject;
        while( plugins.length ){
            subject = plugins.shift();
            console.log("attach", subject, subject)
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

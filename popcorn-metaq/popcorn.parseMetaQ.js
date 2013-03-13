(function (Popcorn) {

    function xmlChildren(xml, nodeName ){
        if( nodeName == "")
            return xml;

        var ret = [];
        var i;
        var path = nodeName.split(".");
        var tag = path.shift();
        var nodes = xml.childNodes;
        var node;

        for( i = 0; i < nodes.length; i++ ){
            node = nodes[i];
            if( node.nodeName == tag )
                ret = ret.concat( xmlChildren( node, path.join(".") ) );
        }
        return ret;
    }

    function xmlText (xml, path) {
        var text;
        try {
            text = xmlChildren(xml, path)[0].textContent;
        }
        catch(e){}
        return text;
    }

    function xmlNameValues(nodes) {
        var ret = {};
        var i, name;
        for( i = 0;i < nodes.length; i++){
            name  = xmlText(nodes[i], "Name");
            if( name )
                ret[ name ] = xmlText(nodes[i], "Value");
        }
        return ret;
    }

    function parseMatch (matchXml) {

        var type = xmlText(matchXml, "Actions.Action.Type");
        if( ! type )
            type = xmlText(matchXml, "Actions.Action.Name");

        var attributes = xmlNameValues( xmlChildren(matchXml, "Actions.Action.Attributes.Attribute") );

        attributes.start = parseFloat(
            xmlText(matchXml, "Actions.Action.StartTime") || xmlText(matchXml, "Occurrence.StartTime")
        );
        attributes.end = parseFloat(
            xmlText(matchXml, "Actions.Action.EndTime") || xmlText(matchXml, "Occurrence.EndTime")
        );

        var ret = {};
        ret[type] = attributes;
        return ret;
    }


    Popcorn.parser( "parseMetaQ", function( data ) {
        var i;
        var matches = xmlChildren(data.xml, "Response.Matches.Match");
        var events = [];

        for(i=0; i<matches.length; i++ ){
            events.push( parseMatch( matches[i] ) );
        }
        return { data : events };
    });

})( Popcorn );
/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */
 
/* This class is authored by Christian Stocker <chregu@liip.ch> */

/**
 * @requires OpenLayers/Layer/XYZ.js
 */

/**
 * Class: OpenLayers.Layer.OSM
 * A class to access OpenStreetMap tiles and put them into a WebSQL offline storage. 
 *  By default, uses the OpenStreetMap
 *    hosted tile.openstreetmap.org 'Mapnik' tileset.
 *  If you wish to use
 *    tiles@home / osmarender layer instead, you can pass a layer like:
 * 
 * (code)
 *     new OpenLayers.Layer.OSMoffline("t@h", 
 *       "http://tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png"); 
 * (end)
 *
 * This layer defaults to Spherical Mercator.
 * 
 * Inherits from:
 *  - <OpenLayers.Layer.OSM>
 */
 
 
OpenLayers.Layer.OSMoffline = OpenLayers.Class(OpenLayers.Layer.OSM, {
    CLASS_NAME: "OpenLayers.Layer.OSMoffline",
    /* getKey
    */
    getKey: function(bounds) {
        var key, s, url, xyz;
        xyz = this.getXYZ(bounds);
        url = this.url;
        if (OpenLayers.Util.isArray(url)) {
            s = "" + xyz.x + xyz.y + xyz.z;
            url = this.selectUrl(s, url);
        }
        key = OpenLayers.String.format(url, xyz);
        return key;
    },
    getURLasync: function(bounds, scope, prop, callback) {
        var url;
        url = this.getKey(bounds);
        return db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM foo where url = ?", [url], function(tx, results) {
                var fnWhenDone, myConn, _ref;
                if (results != null ? (_ref = results.rows) != null ? _ref.length : void 0 : void 0) {
                    scope.url = results.rows.item(0).data;
                    return callback.apply(scope);
                } else {
                    if (!navigator.onLine) {
                        scope.url = "data_not_avail.jpg";
                        callback.apply(scope);
                        return;
                    }
                    fnWhenDone = function(oXML) {
                        try {
                            return db.transaction(function(tx2) {
                                return tx2.executeSql("INSERT INTO foo (url, data) VALUES (?, ?)", [url, oXML.responseText], (function(tx, results) {
                                    scope.url = oXML.responseText;
                                    return callback.apply(scope);
                                }));
                            });
                        } catch (e) {
                            return console.log(e);
                        }
                    };
                    myConn = new XHConn();
                    return myConn.connect("./offline/64proxy.php", "GET", "src=" + encodeURIComponent(url), fnWhenDone);
                }
            });
        });
    }
});

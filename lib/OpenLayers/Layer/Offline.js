/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */
 
/* This class is authored by Christian Stocker <chregu@liip.ch> */

 
 
OpenLayers.Layer.Offline = {
    CLASS_NAME: "OpenLayers.Layer.Offline",
 
    dbTable: "OpenLayersOffline",
    base64proxy: "./offline/64proxy.php",
    dataNotAvailImg: "./offline/data_not_avail.jpg",
    db: null,
    async: true,
    
    initialize: function(name, url, options) {
        var newArguments = [name, url, options];
        if (options.parentClass) {
            options.parentClass.prototype.initialize.apply(this, newArguments);
        } else {
            alert("You have to define the parentClass option!");
        }
        this.createDB();

    },
    
    createDB: function() {
        var that = this;
        if (window.openDatabase) {
            this.db = window.openDatabase("OpenLayersOffline", "1.0", "my first database", 20 * 1024 * 1024);
            this.db.transaction(function(tx) {
                return tx.executeSql("CREATE TABLE " + that.dbTable + " (url unique, data)");
            });
        } else {
            alert("Your browser doesn't support WebSQL. Only WebKit browsers like Safari or Chrome do. The demo will nevertheless work, just nothing will be cached for offline access.");
        }
    },

    getURLasync: function(bounds, scope, prop, callback) {
        var url;
        var that = this;
        url = this.getURL(bounds);
        if (this.db) {
            return this.db.transaction(function(tx) {
                return tx.executeSql("SELECT * FROM " + that.dbTable + " where url = ?", [url], function(tx, results) {
                    var fnWhenDone, myConn, _ref;
                    if (results != null ? (_ref = results.rows) != null ? _ref.length : void 0 : void 0) {
                        scope.url = results.rows.item(0).data;
                        return callback.apply(scope);
                    } else {
                        if (!navigator.onLine) {
                            scope.url = this.dataNotAvailImg;
                            callback.apply(scope);
                            return;
                        }
                        
                        fnWhenDone = function(oXML) {
                            try {
                                return that.db.transaction(function(tx2) {
                                    return tx2.executeSql("INSERT INTO " + that.dbTable + " (url, data) VALUES (?, ?)", [url, oXML.responseText], (function(tx, results) {
                                        scope.url = oXML.responseText;
                                        return callback.apply(scope);
                                    }));
                                });
                            } catch (e) {
                                return console.log(e);
                            }
                        };
                        myConn = new XHConn();
                        
                        return myConn.connect(that.base64proxy, "GET", "src=" + encodeURIComponent(url), fnWhenDone);
                    }
                });
            });
        } else {
            scope.url = url;
            callback.apply(scope);
            return;
        }
    }
};

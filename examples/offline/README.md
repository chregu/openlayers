# Offline Mode for OpenLayers Maps

This is a proof of concept for having Maps tile available offline

It uses the [WebSQL](http://www.w3.org/TR/webdatabase/) storage available in Safari and Chrome and other WebKit browsers, but not Firefox and IE (which they will never support, I guess). We choose WebSQL because it allows (at least in Safari) "indefinite" amount of storage, while the more widely supported [LocalStorage](http://dev.w3.org/html5/webstorage/) usually only allows for 5 MB of data.

The main goal for this proof of concept was to support offline mode on mobile devices like the iPhone or Android. Both support WebSQL.

WebSQL has only an asynchronous interface, which makes programming for it a little bit harder, but luckily enough OpenLayers supports also an async interface for getting the URLs of the image

In this proof of concept, we initially extended OpenLayers.Layer.OSM, therefor it is only tested for that kind of layers. In the meantime I added a more general approach with adding OpenLayer.Layer.Offline "dynamically" to a Layer Class, but I didn't test it with other types of layers.

## How it works

When OpenLayers asks for an image, we look into the local database if that image already exists. We overwrite `getURLasync` for this purpose and set the property `async` to true.

If the image doesn't exist in the local database, we try to get it from the server. As we use XMLHTTPRequest for that, we have to have a little proxy script on the same server as the script, which gets the actual data from the map server and returns it to the browser.

For later displaying the data, we store the whole image base64 encoded in the database. We later inject that image into the src attribute via a [data uri](http://en.wikipedia.org/wiki/Data_URI_scheme). All we have to do is now to return the whole base64 encoded string to OpenLayers instead of a "traditional" URL and the image is  displayed

Theoretically it would be possible to convert an image into a base64 string in javascript on the client side (via Canvas), but for performance and "proof of concept" simplicity reasons, we convert that on the proxy side in PHP (see 64proxy.php).

Alternatives to using a proxy on the same server would be using [JSONP](http://en.wikipedia.org/wiki/JSONP) or a [CORS](http://www.w3.org/TR/cors/) enabled map server, but both approaches would have to send the data base64 encoded to be a direct replacement.

If the map tile already exists in the database, the base64 encoded data is read from the database and also sent to OpenLayers as data uri to be displayed.

As this all happens asynchronously, the DB operations as well as the fetching of the image data, nothing should block and a lot happens in parallel.

## The example

To make the example work, you need PHP (for the proxy mentioned above) on your server, something like 4.3 or bigger should be enough. As we get the data via `file_get_contents` you have to make sure that `allow_url_fopen = On` is set, otherwise you have to craft something with ext/curl.

Next, put the whole OpenLayer folder somewhere on your web server and access the example with eg.
http://localhost/openlayers/examples/offline.html

Now you should see a world map if all went well, you can zoom in and out and once a tile is loaded, it will be served from the local database on the next request.

If you want to be able to use it really offline (not only the tiles from local store), uncomment the `manifest="offline/manifest.php"` in the <html> element, reload the page and then go offline. Now everything should work as before.

## The files

`offline.html` and `offline.js` contain this basic example, it's mostly copy&paste code from another example

`offline/64base.php` is the simple PHP proxy. It just takes the image tile from the map server specified in the src attribute and converts it to base64. Be aware that it's missuse protection is quite simple, it only checks if the end-point url starts with http://tile.openstreetmap.org/ (which should help a lot against missusing) and does only have characters it should have.

`offline/manifest.php` is the [offline Manifest](http://www.w3.org/TR/html5/offline.html). It uses PHP to send the correct Content-Type (otherwise it doesn't work). You could also tell your web server to send the correct mime-type for these kind of files, but for the proxy provided here you need PHP anyway, so this was the easier solution.

`offline/XHConn.js` is a very simple XMLHTTPRequest wrapper I use for simple things.

`../lib/OpenLayers/Layer/Offline.js` contains the new properties and methods which enables offline storage. It misses some features like expiration of tiles. Once in the storage, they never go away.









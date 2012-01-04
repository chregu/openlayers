

  /*global OpenLayers, XHConn, console
  */

  var db, fixSize, init;

  db = null;


  fixSize = function() {
    window.scrollTo(0, 0);
    document.body.style.height = "100%";
    if (!/(iphone|ipod)/.test(navigator.userAgent.toLowerCase()) ? document.body.parentNode : void 0) {
      return document.body.parentNode.style.height = "100%";
    }
  };

  setTimeout(fixSize, 700);

  setTimeout(fixSize, 1500);

  init = function() {
    var map;
   
    return map = new OpenLayers.Map({
      div: "map",
      theme: null,
      controls: [
        new OpenLayers.Control.Attribution(), new OpenLayers.Control.TouchNavigation({
          dragPanOptions: {
            enableKinetic: true
          }
        }), new OpenLayers.Control.ZoomPanel()
      ],
      layers: [
        new OpenLayers.Layer.OSMoffline("OpenStreetMap", null, {
          transitionEffect: "resize"
        })
      ],
      center: new OpenLayers.LonLat(742000, 5861000),
      zoom: 3
    });
  };



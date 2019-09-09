//Step 1 - Store the JS File in a webserver, Possibly Github Pages / Amazon S3 Bucket
//Step 2 - Run the code below to register your plugin
//          nmc.utils.registerDevPlugin("TEST_PLUGIN_STUDIO", 'https://s3.amazonaws.com/xyz.studio.tests.in.here.com/index.js', {})
alert("Plugin Loaded..!")
let styleGroupsConfig = {
    drawingBoard: {
        polygons: [
            {
                fill: '#2DD5c9',
                type: 'Polygon',
                stroke: '#0F1621',
                strokeWidth: 2,
                zIndex: 1,
                opacity: 1,
            },
            {
                fill: '#2DD5c9',
                radius: 5,
                stroke: '#0F1621',
                strokeWidth: 2,
                type: 'Circle',
                zIndex: 2,
            },
        ],
        lines: [
            {
                type: 'Line',
                stroke: '#2DD5c9',
                zIndex: 1,
                opacity: 1,
                strokeWidth: 2,
            },
            {
                fill: '#2DD5c9',
                radius: 5,
                stroke: '#0F1621',
                strokeWidth: 2,
                type: 'Circle',
                zIndex: 2,
            },
        ],
        points: [
            {
                fill: '#00908A',
                type: 'Circle',
                radius: 80,
                zIndex: 10,
            },
        ],
    }
}

define(function (require) {

    var basePath = 'http://127.0.0.1:7000/test_local.js'//
    var UNDEF;
    var drawingPlugin = {
        init: function (pI, config) {
            console.log(pI.getLanguage());

            
            // //Get Map Position on clicking that map

            // pI.sandwichMap().addEventListener('pointerup', function (e) {
            //     var obj = e.target;
            //     console.log(obj)
            //     let latitude = obj.geometry.coordinates[1];
            //     let longitude = obj.geometry.coordinates[0];
            //     let coords = {
            //         latitude, longitude
            //     }
            //     console.log("Test : "+ coords)
            // });
            // pI.sandwichMap().addEventListener('dblclick', function (e) {
            //     var obj = e.target;
            //     console.log(obj)
            //     let latitude = obj.geometry.coordinates[1];
            //     let longitude = obj.geometry.coordinates[0];
            //     let coords = {
            //         latitude, longitude
            //     }
            //     console.log("Drawing Completed : "+coords)
            //     console.log("Finished")
            // });

            // var YOUR_ACCESS_TOKEN = "IzOHLHLyynLPwG28V26Hcw";//window.parent.YOUR_ACCESS_TOKEN;

            // window.display = HERE.xyz.maps.Map
            
            // new here.xyz.maps.Map(
            //     document.getElementById("map"),
            //     {
            //         zoomLevel: 17,
            //         center: {
            //             longitude: -122.48024, latitude: 37.77326
            //         },
            //         // add layers to display
            //         layers: [
            //             new here.xyz.maps.layers.TileLayer({
            //                 name: 'Image Layer',
            //                 min: 1,
            //                 max: 20,
            //                 // image layer for displaying satellite images
            //                 provider: new here.xyz.maps.providers.ImageProvider({
            //                     name: 'Live Map',
            //                     url: 'https://{SUBDOMAIN_INT_1_4}.mapcreator.tilehub.api.here.com/tilehub/wv_livemap_bc/png/sat/256/{QUADKEY}?access_token=' + YOUR_ACCESS_TOKEN
            //                 })
            //             })
            //         ]
            //     }
            // );

            const editorConfig = {
                featureSelectionByDefault: false,
                keepFeatureSelection: true
            };

            var myEditor = new HERE.xyz.maps.editor.Editor(window.display, editorConfig);
            window.editor = myEditor
            myEditor.clearObjectSelection();

            //Enable Drawing Board in Polygon mode

            window.drawingBoard = myEditor.getDrawingBoard();
            window.drawingBoard.start({
                mode: HERE.xyz.maps.editor.features.Area,
                layer: HERE.xyz.maps.layers.TileLayer,//HERE.xyz.maps.layers.TileLayer,//this.state.currentLayer,
                styleGroup: styleGroupsConfig.drawingBoard.polygons
            })


            // pI.sandwichMap().addEventListener('tap', function (e) {
            //     console.log(e)

            // });

            // pI.sandwichMap().addEventListener('dbltap', function (e) {
            //     console.log(e)

            // });

            // pI.sandwichMap().addEventListener('pointerup', function (e) {
            //     //e.getMapPosition()

            // });

        }
    }
    return drawingPlugin;
});
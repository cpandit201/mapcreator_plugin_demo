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

define(


    function (require) {

        // onMapDoubleClick = e => {
        //     // this.mapObject.setZoomlevel(
        //     //     this.mapObject.getZoomlevel() + 1,
        //     //     e.mapX,
        //     //     e.mapY
        //     // );
        //     myEditor.cancel()
        //     myEditor.clearObjectSelection()
        // };


        // onEditorHistoryChange = () => {

        //     history = {
        //         current_step: this.editor.get('history.current'),
        //         total_steps: this.editor.get('history.length'),
        //         modified_features: this.editor.get('changes.length'),
        //     }
        //     console.log(history);

        //     // window.drawingBoard.cancel();
        // };


        onKeyPress = e => {
            console.log("Key Pressed onKeyPress..")
            //if (this.editor.active())
            //if (myEditor.isEditMode()) {
            e.preventDefault();

            switch (e.keyCode) {
                case 27: // ESCAPE
                // this.clearDrawingBoard();
                window.drawingBoard.cancel();
                break;
                case 8://Backspace
                this.deleteDrawing();
                break;
                case 13://ENTER
                this.deleteDrawing();
                break;
                default:
            }
        
        };

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

                //Set up Basemap
                this.mapObject = window.display;//Using MapCreator's Initialized Map
                //  new HERE.xyz.maps.Map(th is.refs.container, {
                //     credentials: { access_token: getToken() },
                //     zoomLevel: settings.zoom,
                //     center: { latitude: settings.center[0], longitude: settings.center[1] },
                //     layers: [this.baseLayer],
                //   });

                window.mapObject = this.mapObject;

                //Setup Editor
                const editorConfig = {
                    featureSelectionByDefault: false,
                    keepFeatureSelection: true
                };

                var myEditor = new HERE.xyz.maps.editor.Editor(window.display, editorConfig);
                window.editor = myEditor
                myEditor.clearObjectSelection();

                //Enable Drawing Board in Polygon mode

                window.drawingBoard = myEditor.getDrawingBoard();

                window.drawingBoard.create();

                window.drawingBoard.start({
                    mode: HERE.xyz.maps.editor.features.Area,
                    layer: HERE.xyz.maps.layers.TileLayer,//HERE.xyz.maps.layers.TileLayer,//this.state.currentLayer,
                    styleGroup: styleGroupsConfig.drawingBoard.polygons
                })

                // this.mapObject.addEventListener('dbltap', this.onMapDoubleClick);
                // myEditor.addEventListener('pointerup', this.onEditorPointerUp);
                // myEditor.addObserver('history.current', this.onEditorHistoryChange);

                document.addEventListener('keydown', this.onKeyPress);

                // myEditor.setZoomLevel(19)

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
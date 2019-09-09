define(function (require) {
    var UNDEF;
    var basePath = "https://mapcreator-plugins-bg90baf6.s3.amazonaws.com/geospaces/";
    //var basePath = "https://mc.ad.here.com/mapcreator/plugins/mapcreator-geospaces/";
    var useNewInterface = true;

    function loadCSS(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    var observationPlugin =
        //nmc.Plugin.add(
        {

            init: function (pI, config) {

                loadCSS(basePath+'dist/jquery.tagsinput.min.css');
                loadCSS(basePath+'dist/json-formatter.css');
                jQuery.getScript(basePath+'dist/jquery.tagsinput.min.js', function(){

                });
                jQuery.getScript(basePath+'dist/json-formatter.js', function(){

                });




                var switchedOn = false;
                if (typeof config === "string") {
                    // try to parse it...

                    var tmp = JSON.parse(config);
                    if (tmp) {
                        config = tmp;
                    }
                }
                if (!config) {
                    config = {}
                }
 
                var switchedOn = false;
                var tagFilter = [];
                var defaultStyles = {
                    Point: {
                        default: [[20, {
                            "r": 7,
                            "fill": '#F00',
                            "stroke": '#FFF',
                            "stroke-width": 1
                        }]]

                    },

                    Polygon: {
                        default: [[0, {
                            'stroke': "#fff",
                            'fill': "#0f0",
                            'stroke-width': 1,
                            'stroke-linejoin': 'none',
                            'stroke-linecap': 'none',
                            'stroke-dasharray': 'none',
                            'opacity': .5
                        }]]

                    },

                    MultiPolygon: {
                        default: [[0, {
                            'stroke': "#fff",
                            'fill': "#0f0",
                            'stroke-width': 1,
                            'stroke-linejoin': 'none',
                            'stroke-linecap': 'none',
                            'stroke-dasharray': 'none',
                            'opacity': .5
                        }]]

                    },

                    LineString: {
                        default: [
                            [10, {
                                'stroke': '#00f',
                                'stroke-width': 5,
                                'opacity': 1
                            }]
                        ]
                    },
                    MultiLineString: {
                        default: [
                            [10, {
                                'stroke': '#00f',
                                'stroke-width': 5,
                                'opacity': 1
                            }]
                        ]
                    }
                };

                var settings = {
                    geospace: 'playground',
                    endpoint: "https://xyz.api.here.com/hub/spaces",
                    label: 'XyzSpace ' + (config.geospace || "playground"),
                    spaceId: 'EjNBNf3Z',
                    token: 'AH_l1eR0UwpTgQ_IKjR_FDo',
                    minLevel: 11,
                    maxLevel: 20,
                    providerLevel: 11,
                    styles: defaultStyles
                };
                $.extend(true, settings, config);

                if (config.styles && config.styles.Point && config.styles.Point.default) {
                    settings.styles.Point.default = config.styles.Point.default;
                }

 				/**
                 *
				 * @param styleInput
				 * @param objectType
				 * @returns {{zIndex: *}[]}
				 */
                var convertStyleXyz = function(styleInput,objectType){

                    var attributeMapping = {
                        "r":"radius",
                        "radius":"radius",
                        "stroke":"stroke",
                        "stroke-width":"strokeWidth",
                        "strokeWidth":"strokeWidth",
                        "fill":"fill",
						'stroke-linejoin': 'strokeLinejoin',
						'strokeLinejoin': 'strokeLinejoin',
						'stroke-linecap': 'strokeLinecap',
						'strokeLinecap': 'strokeLinecap',
						'stroke-dasharray': 'strokeDasharray',
						'strokeDasharray': 'strokeDasharray',
						'opacity': 'opacity',
						'width': 'width',
						'height': 'height',
                        'src':'src',
                        'text':'text',
                        'text-ref':'textRef',
                        'textRef':'textRef',
                        'font':'font',
                        'offsetX':'offsetX',
                        'offsetY':'offsetY',
                        'rotation':'rotation'

                    }
                    if(styleInput instanceof Array){
						var mapped = styleInput.map(function(singleStyle){
						    if (singleStyle instanceof Array && singleStyle.length === 2){
						        var newStyle = {
    					            zIndex:singleStyle[0]
	    						}
                                for (var attr in attributeMapping){
                                    if (singleStyle[1].hasOwnProperty(attr)){
                                        newStyle[attributeMapping[attr]]=singleStyle[1][attr];
                                    }
                                }

								// detect the type...

								if (newStyle.hasOwnProperty('text') || newStyle.hasOwnProperty('textRef')){
									newStyle.type='Text';
								}
								else if (objectType==='Point' && newStyle.hasOwnProperty('radius')){
									newStyle.type='Circle';
								}
								else if (objectType==='Point' && newStyle.hasOwnProperty('src')){
									newStyle.type='Image';
								}
								else if (objectType==='Point' && newStyle.hasOwnProperty('height') && newStyle.hasOwnProperty('width')){
									newStyle.type='Rect';
								}
								else if(objectType === 'LineString' || objectType === 'MultiLineString'){
								    newStyle.type='Line';
                                }
								else if(objectType === 'Polygon' || objectType === 'MultiPolygon'){
									newStyle.type='Polygon';
								}

							}
                            return newStyle;
                        })
                    }
                    return mapped;
                }


                if (pI.isXyzMap){
                    var styleXYZ = {
						styleGroups:{
                        },
                        assign: function(feature){
                            var type = feature.geometry.type;
                            var tags = feature.properties['@ns:com:here:xyz'].tags;

							if (tags) {

								// if one of the tags in tag filter is not in the tags: return empty style
								for (var i = 0; i < tags.length; i++) {

								   var styleIndex = ""+type+"_"+"tag:" + tags[i];
								   if(styleXYZ.styleGroups.hasOwnProperty(styleIndex)){
								       return styleIndex;
                                   }
								}
							}

							if (styleXYZ.styleGroups.hasOwnProperty(type+"_default")){
								return type+"_default";
							}
                        }
                    }

                    for (var styleType in settings.styles ){
                        for (var styleTag in settings.styles[styleType]){
                            styleXYZ.styleGroups[styleType+'_'+styleTag] = convertStyleXyz(settings.styles[styleType][styleTag],styleType);
                        }
					}
                }else{
					var styles = {
						Point: settings.styles.Point,
						Polygon: settings.styles.Polygon,
						MultiPolygon: settings.styles.MultiPolygon,
						MultiLineString: settings.styles.MultiLineString,
						LineString: settings.styles.LineString,

						LineStringZoomScale: function (level) {
							return 1
						},

						get: function (feature) {

							var type = feature.geometry.type;
							var tags = feature.properties['@ns:com:here:xyz'].tags;

							if (tags) {

								// if one of the tags in tag filter is not in the tags: return empty style
								for (var i = 0; i < tags.length; i++) {
									if (this[type]["tag:" + tags[i]]) {
										return this[type]["tag:" + tags[i]];
									}
								}
							}

							return this[type]["default"];
						}
					};
                }


                var generateProvider = function(){                    
                    var endpoint = settings.endpoint;
                    var spaceId  = settings.spaceId;
                    var token    = settings.token;

                    var observationProvider = new HERE.xyz.maps.providers.SpaceProvider({
                        name: "geospace_" + settings.geospace + "_provider",
                        level: settings.providerLevel,
                        space: spaceId,
                        tags: ((tagFilter && tagFilter.length > 0)?tagFilter:[]),
                        headers: {
                            authorization: "Bearer "+token
                        },
                        url: endpoint
                    });

                    var layerConfig = {
                        name		: "geospace_" + settings.geospace,
                        style		: styleXYZ,
                        min: settings.minLevel,
                        max: settings.maxLevel,
                        provider: observationProvider
                    };
                    var observationLayer = new HERE.xyz.maps.layers.TileLayer(layerConfig);


                    return observationLayer;
                }

                var observationLayer = generateProvider();
                var addObservationTooltipListener = function () {
                    pI.sandwichMap().addEventListener('pointerup', function (e) {

                        e.nativeEvent._stopPropagation = true;
                        var obj = e.target;
                        if (obj && obj._provider && (obj._provider.name === "geospace_" + settings.geospace || obj._provider.name === "geospace_" + settings.geospace + "_provider")) {
                            var events = [];
                            var objId = ""+obj.id;
                            if (obj.geometry.type === 'Point') {
                                events[0] = {
                                    'type': "click",
                                    "selector": 'a.addAsPlace',
                                    'fnc': function () {
                                        var coordinate = {
                                            latitude: obj.geometry.coordinates[1],
                                            longitude: obj.geometry.coordinates[0]
                                        };

                                        var properties = {
                                            name: (obj.properties && obj.properties.name?obj.properties.name:''),
                                            phone: (obj.properties && obj.properties.phone?obj.properties.phone:''),
                                            url: (obj.properties && obj.properties.url?obj.properties.url:'')
                                        };
                                        pI.createPlace(coordinate, properties);
                                    }
                                }
                            }

                            var content = document.createElement('div');
                            content.setAttribute('class','tooltip_json');

                            var formatter = new JSONFormatter(obj.properties,2,{theme:'dark'});
                            content.appendChild(formatter.render());
                            content.insertAdjacentHTML('beforeend','<hr noshade size="1" style="margin:3px"/><span><a class="addAsPlace">Add as place</a></span>');

                            pI.showMapTooltip({
                                x: e.mapX,
                                y: e.mapY
                            }, obj.properties.name, content, events);

                            jQuery('.geospace_tooltip_json_'+objId.replace(/\|/,'_')).append(formatter.render());
                        }
                    });
                    addObservationTooltipListener = function () {
                    };
                }               

                // todo: create min max lrcs for bounding box
				var section = config.group || "seeOnMap";

                var menuOptions = {
                    section:  section,
                    label: settings.label,
                    onActivate: function () {

                        pI.sandwichMap().addLayer(observationLayer);
                        switchedOn = true;
                        addObservationTooltipListener();
                    },
                    onDeactivate: function () {
                        switchedOn = false;
                        pI.sandwichMap().removeLayer(observationLayer);
                    },
                    onToggle: function () {
                    },
                    cbIsActive: function () {
                        var zl = pI.getMapZoomLevel();

                        if (zl < settings.minLevel) {
                            return false;
                        }
                        if (zl > settings.maxLevel) {
                            return true;
                        }

                    },
                    cbIsDisplayed: function () {
                        return true;
                    }
                };

                if (config.menuPriority) {
                    menuOptions.priority = config.menuPriority;
                }

                pI.addSandwichMenuOption(menuOptions);
            }
        };

    return observationPlugin;

});
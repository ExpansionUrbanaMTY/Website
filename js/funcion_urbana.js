mapboxgl.accessToken = 'pk.eyJ1Ijoicm9wb25teCIsImEiOiJja2MyajhuMjIwMGxhMnN1bTRudTk5MmlxIn0.FaHKa4n3CaUvaTKcwLXXGw';
const colors = ['#fcfdbf', '#feca8d', '#fd9668', '#f1605d', '#cd4071', '#9e2f7f', '#721f81', '#440f76', '#180f3d', '#000004']; 
const thresholds = {'dist_cbd':[4, 8, 12, 16, 20, 24, 28, 32, 36, 40],
'Emp10_19':[-1999, 383, 2765, 5147, 7529, 9911, 12293, 14675, 17057, 19439],
'Pop0_16':[-17405, -1855, 13695, 29245, 44795, 60345, 75895, 91445, 106995, 122545],
'AreaC':[0.1, 0.172, 0.243, 0.314, 0.385, 0.456, 0.527, 0.598, 0.669, 0.74],
'CUS':[0.17, 0.31, 0.45, 0.59, 0.73, 0.87, 1.01, 1.15, 1.29, 1.43],
'Densidad90':[338, 676, 1014, 1352, 1690, 2028, 2366, 2704, 3042, 3380],
'Densidad00':[319.985, 630.32, 940.65, 1250.99, 1561.325, 1871.65, 2181.995, 2492.33, 2802.665, 3113.0],
'Densidad16':[340.698, 537.586, 734.473, 931.362, 1128.25, 1325.138, 1522.026, 1718.914, 1915.802, 2112.69],
'PropPC':[1.378, 2.196, 3.014, 3.832, 4.65, 5.468, 6.286, 7.104, 7.922, 8.74],
'ConpP':[96.679, 145.128, 193.577, 242.025, 290.475, 338.924, 387.373, 435.822, 484.271, 532.72],
'PorPav':[10.988, 12.596, 14.204, 15.812, 17.42, 19.028, 20.636, 22.244, 23.852, 25.46],
'CambioPP90':[-4.97, -3.858, -2.747, -1.636, -0.525, 0.586, 1.697, 2.808, 3.919, 5.03]};
const layerLegends = {
'dist_cbd':['Distancia','km.'], 'Emp10_19':['Dif. Empleos','empleos'], 'Pop0_16':['Dif. Población','personas'], 'AreaC':['Área const.','porcentaje'], 'CUS':['CUS','metros'], 'Densidad90':['Jov. 90','personas/m2'],
'Densidad00':['Jov. 00','personas/m2'], 'Densidad16':['Jov. 16','personas/m2'], 'PropPC':['Pav/Const.','pav/m2'], 'ConpP':['Cons. Pav.','m2/personas'], 'PorPav':['Porc. Pav','%'], 'CambioPP90':['Dif. Jov.','cambio']
}
const cardcontent = {
    'CUS': 'A partir de la información catastral consultada, estimamos el Coeficiente de Utilización del Suelo (CUS) promedio en los círculos concéntricos trazados a partir del centro de la ciudad. El CUS se refiere a la proporción de superficie construida respecto a la superficie del predio. Los colores más oscuros indican una mayor proporción de área construida contra área del terreno. La zona central de la ciudad tiene el CUS más alto, el cual se reduce gradualmente conforme nos movemos del centro hacia la periferia. La excepción son algunas franjas oscuras ubicadas en García y Juárez, con un CUS muy alto y que corresponden a desarrollos de vivienda social.',
    'AreaC':'Este mapa se elaboró utilizando la información catastral de los predios. En este caso, se muestra el Área Construida dividida entre la superficie total del anillo concéntrico. Se hace esto debido a que es natural que a mayor área tenga el anillo, mayor superficie construida habría. Podemos observar que la proporción de Área Construida con Área Total es mayor en el centro de la ciudad, con valores arriba de 0.7. Sin embargo, mientras más se aleja uno del centro, la proporción disminuye constantemente, excepto por un pequeño incremento entre los 30 y 35 kilómetros de distancia que corresponden a centros históricos en García, Juárez y Santiago.',
    'PropPC':'Este mapa fue elaborado utilizando tanto los datos catastrales, como las superficies calculadas de vialidades. El propósito del mapa es ilustrar cuántos metros cuadrados de vialidad sirven a cada metro cuadrado construido. Un valor menor, ilustra una mayor densidad de construcción, mientras que valores mayores indican que se necesita mantener más superficie pavimentada. En promedio, cada metro cuadrado construido del Área Metropolitana requiere de 1.6 metros cuadrados de pavimentos. Sin embargo, el valor difiere mientras uno se aleja del centro, donde se ubica el menor valor de 0.31. Las periferias tienden a necesitar mayor cantidad de superficie pavimentada para atender a las construcciones, posiblemente debido a la necesidad de grandes carreteras para conectar a los desarrollos urbanos con el centro.',
    'ConpP':'Utilizando los datos del Inventario Nacional de Viviendas 2016 y las superficies calculadas de vialidades, se determinó el consumo per cápita de superficie pavimentada. Es decir, se divide la población total ubicada en el anillo concéntrico entre la superficie de vialidades del mismo anillo. Un valor mayor indica un mayor consumo, y, por lo tanto, el costo de manutención de vialidades recaería en menos personas. Podemos observar que el centro de Monterrey tiene un valor mayor que los anillos que van de 2 a 18 kilómetros, donde el consumo vuelve a aumentar, hasta un máximo de 300 metros cuadrados por habitante a 25 kilómetros de distancia. Esta tendencia puede verse explicada en parte por el abandono del centro, dejando las calles hechas a menos habitantes y por la menor densidad de construcción y habitantes que ocurre en las periferias.',
    'PorPav':'Este mapa muestra el porcentaje del anillo concéntrico que se encuentra pavimentado. Es decir, se dividió la superficie de vialidades entre el área total del anillo y se multiplicó por cien. Un valor mayor indica que un porcentaje mayor del área total disponible se dispone a vialidades. En promedio el 19.6% del área disponible de los anillos se dedica a infraestructuras viales. Este valor es relativamente constante a través del Área Metropolitana, a excepción de unas caídas drásticas entre los 24 y 31 kilómetros de distancia.'
}
var activeLayer = '';
var loadFiles = [d3.json('./data/MapaGradientes.json'), d3.csv('./data/gradiente.csv')];

var map_dist = new mapboxgl.Map({
    container: 'map_dist',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-100.310015, 25.668289],
    zoom: 8.8
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function changeText(s) {
    document.getElementById('cus_text').textContent = cardcontent[s];
}

function changeLegend(s) {
    document.getElementById('leg-title').textContent = layerLegends[s][0];
    document.getElementById('leg-unit').textContent = '('+layerLegends[s][1]+')';
    for (var i = 0; i < 10; i++) {
        document.getElementById('leg'+String(i+1)).childNodes[1].textContent = numberWithCommas(thresholds[s][i]);
    }
}


function forceHide() {
    if(!(activeLayer === ''))  {
        if(map_dist.getLayoutProperty(activeLayer, 'visibility') == 'visible') {
            map_dist.setLayoutProperty(activeLayer, 'visibility', 'none');
        }
    }   
}

function displayLayer(s) {
    if(map_dist.getLayoutProperty(s, 'visibility') != 'visible') {
        forceHide();
        map_dist.setLayoutProperty(s, 'visibility','visible');
        activeLayer = s; 
    }
    changeLegend(s); 
}

Promise.all(loadFiles).then(function (data){
    data[0].feature = data[0].features.map(feature => {
        data[1].forEach(gradienteData => {
            if (feature.properties.distance == gradienteData['dist_cbd']) {
                feature.properties.dist_cbd = Number(gradienteData['dist_cbd']);
                feature.properties.Emp10_19 = Number(gradienteData['Emp10_19']);
                feature.properties.Pop0_16 = Number(gradienteData['Pop0_16']);
                feature.properties.AreaC = Number(gradienteData['AreaC']);
                feature.properties.CUS = Number(gradienteData['CUS']);
                feature.properties.Densidad90 = Number(gradienteData['Densidad90']);
                feature.properties.Densidad00 = Number(gradienteData['Densidad00']);
                feature.properties.Densidad16 = Number(gradienteData['Densidad16']);
                feature.properties.PropPC = Number(gradienteData['PropPC']);
                feature.properties.ConpP = Number(gradienteData['ConpP']);
                feature.properties.PorPav = Number(gradienteData['PorPav']);
                feature.properties.CambioPP90 = Number(gradienteData['CambioPP90']);
            }
        });
        return feature;
    });
    var margedGeoJSON = data[0];
    var rows = Object.keys(thresholds);
    var stepsList = thresholds['dist_cbd'].map((num,i) => {
        return[num,colors[i]]; 
    });

    map_dist.on('load', function() {
        map_dist.addSource('gradiente', {
            type:'geojson',
            data:margedGeoJSON
        });

        map_dist.addLayer({
            'id':'dist_cbd',
            'type':'fill',
            'source':'gradiente',
            'paint':{
                'fill-color':'#088',
                'fill-opacity':0.80
            },
            'paint': {
                'fill-color': {
                    property: 'dist_cbd',
                    stops: stepsList
                },
                'fill-opacity':0.9
            },
            'layout': {
                'visibility': 'visible'
            }
        });

        activeLayer = 'dist_cbd' 

        rows.slice(1).forEach(header => {

            stepsList = thresholds[header].map((num,i) => {
                return[num,colors[i]]; 
            });

            map_dist.addLayer({
                'id':header,
                'type':'fill',
                'source':'gradiente',
                'paint':{
                    'fill-color':'#088',
                    'fill-opacity':0.80
                },
                'paint': {
                    'fill-color': {
                        property: header,
                        stops: stepsList
                    },
                    'fill-opacity':0.9
                },
                'layout': {
                    'visibility': 'none'
                }
            });
        });
        var distPointer =  new mapboxgl.Popup({
            closeButton: false,
        });
        map_dist.on('click', 'dist_cbd', function(e) {
            map_dist.getCanvas().style.cursor = 'pointer'; 
            distPointer.setLngLat(e.lngLat).setHTML('<b>Distancia: </b>' + e.features[0].properties.distance).addTo(map_dist);
        });

        map_dist.on('mouseleave', 'dist_cbd', function(e) {
            map_dist.getCanvas().style.cursor = '';
            distPointer.remove(); 
        });

        var empPointer =  new mapboxgl.Popup({
            closeButton: false,
        });

        map_dist.on('click', 'Emp10_19', function(e) {
            map_dist.getCanvas().style.cursor = 'pointer'; 
            empPointer.setLngLat(e.lngLat).setHTML('<b>Distancia: </b>' + e.features[0].properties.distance + '<br><b>Cambio: </b>' + e.features[0].properties.Emp10_19).addTo(map_dist);
        });

        map_dist.on('mouseleave', 'Emp10_19', function(e) {
            map_dist.getCanvas().style.cursor = '';
            empPointer.remove(); 
        });

        var popPointer =  new mapboxgl.Popup({
            closeButton: false,
        });

        map_dist.on('click', 'Pop0_16', function(e) {
            map_dist.getCanvas().style.cursor = 'pointer'; 
            popPointer.setLngLat(e.lngLat).setHTML('<b>Distancia: </b>' + e.features[0].properties.distance + '<br><b>Cambio: </b>' + e.features[0].properties.Pop0_16).addTo(map_dist);
        });

        map_dist.on('mouseleave', 'Pop0_16', function(e) {
            map_dist.getCanvas().style.cursor = '';
            popPointer.remove(); 
        });

        var acPointer =  new mapboxgl.Popup({
            closeButton: false,
        });

        map_dist.on('click', 'AreaC', function(e) {
            map_dist.getCanvas().style.cursor = 'pointer'; 
            acPointer.setLngLat(e.lngLat).setHTML('<b>Distancia: </b>' + e.features[0].properties.distance + '<br><b>Porc.: </b>' + e.features[0].properties.AreaC).addTo(map_dist);
        });

        map_dist.on('mouseleave', 'AreaC', function(e) {
            map_dist.getCanvas().style.cursor = '';
            acPointer.remove(); 
        });

        var cusPointer =  new mapboxgl.Popup({
            closeButton: false,
        });
        
        map_dist.on('click', 'CUS', function(e) {
            map_dist.getCanvas().style.cursor = 'pointer'; 
           cusPointer.setLngLat(e.lngLat).setHTML('<b>Distancia: </b>' + e.features[0].properties.distance + '<br><b>CUS.: </b>' + e.features[0].properties.CUS).addTo(map_dist);
        });

        map_dist.on('mouseleave', 'CUS', function(e) {
            map_dist.getCanvas().style.cursor = '';
            cusPointer.remove(); 
        });

        var den9Pointer =  new mapboxgl.Popup({
            closeButton: false,
        });


        map_dist.on('click', 'Densidad90', function(e) {
            map_dist.getCanvas().style.cursor = 'pointer'; 
            den9Pointer.setLngLat(e.lngLat).setHTML('<b>Distancia: </b>' + e.features[0].properties.distance + '<br><b>Prop.: </b>' + e.features[0].properties.Densidad90).addTo(map_dist);
        });

        map_dist.on('mouseleave', 'Densidad90', function(e) {
            map_dist.getCanvas().style.cursor = '';
            den9Pointer.remove(); 
        });

        var den0Pointer =  new mapboxgl.Popup({
            closeButton: false,
        });

        map_dist.on('click', 'Densidad00', function(e) {
            map_dist.getCanvas().style.cursor = 'pointer'; 
            den0Pointer.setLngLat(e.lngLat).setHTML('<b>Distancia: </b>' + e.features[0].properties.distance + '<br><b>Prop.: </b>' + e.features[0].properties.Densidad00).addTo(map_dist);
        });

        map_dist.on('mouseleave', 'Densidad00', function(e) {
            map_dist.getCanvas().style.cursor = '';
            den0Pointer.remove(); 
        });

        var den6Pointer =  new mapboxgl.Popup({
            closeButton: false,
        });


        map_dist.on('click', 'Densidad16', function(e) {
            map_dist.getCanvas().style.cursor = 'pointer'; 
            den6Pointer.setLngLat(e.lngLat).setHTML('<b>Distancia: </b>' + e.features[0].properties.distance + '<br><b>Prop.: </b>' + e.features[0].properties.Densidad16).addTo(map_dist);
        });

        map_dist.on('mouseleave', 'Densidad16', function(e) {
            map_dist.getCanvas().style.cursor = '';
            den6Pointer.remove(); 
        });

        var propPointer =  new mapboxgl.Popup({
            closeButton: false,
        })

        map_dist.on('click', 'PropPC', function(e) {
            map_dist.getCanvas().style.cursor = 'pointer'; 
            propPointer.setLngLat(e.lngLat).setHTML('<b>Distancia: </b>' + e.features[0].properties.distance + '<br><b>Prop.: </b>' + e.features[0].properties.PropPC).addTo(map_dist);
        });

        map_dist.on('mouseleave', 'PropPC', function(e) {
            map_dist.getCanvas().style.cursor = '';
            propPointer.remove(); 
        });


        var consPointer =  new mapboxgl.Popup({
            closeButton: false,
        });

        map_dist.on('click', 'ConpP', function(e) {
            map_dist.getCanvas().style.cursor = 'pointer'; 
            consPointer.setLngLat(e.lngLat).setHTML('<b>Distancia: </b>' + e.features[0].properties.distance + '<br><b>Prop.: </b>' + e.features[0].properties.ConpP).addTo(map_dist);
        });

        map_dist.on('mouseleave', 'ConpP', function(e) {
            map_dist.getCanvas().style.cursor = '';
            consPointer.remove(); 
        });

        var pavPointer =  new mapboxgl.Popup({
            closeButton: false,
        });

        map_dist.on('click', 'PorPav', function(e) {
            map_dist.getCanvas().style.cursor = 'pointer'; 
            pavPointer.setLngLat(e.lngLat).setHTML('<b>Distancia: </b>' + e.features[0].properties.distance + '<br><b>Porc.: </b>' + e.features[0].properties.PorPav).addTo(map_dist);
        });

        map_dist.on('mouseleave', 'PorPav', function(e) {
            map_dist.getCanvas().style.cursor = '';
            pavPointer.remove(); 
        });
        
        var cambioPointer =  new mapboxgl.Popup({
            closeButton: false,
        });

        map_dist.on('click', 'CambioPP90', function(e) {
            map_dist.getCanvas().style.cursor = 'pointer'; 
            cambioPointer.setLngLat(e.lngLat).setHTML('<b>Distancia: </b>' + e.features[0].properties.distance + '<br><b>Cambio: </b>' + e.features[0].properties.CambioPP90).addTo(map_dist);
        });

        map_dist.on('mouseleave', 'CambioPP90', function(e) {
            map_dist.getCanvas().style.cursor = '';
            cambioPointer.remove(); 
        });
  
    });
}); 

function renderCenso() {
    Plotly.d3.csv('./data/censo.csv' , function (data) {
        processData(data.filter(function (d) {return (d.year == 2000)}), 
        data.filter(function (d) {return (d.year == 2016)}));
    });    
}


function processData(setA, setB) {
    var viv0 = [],pop0 = [], viv1 = [], pop1 = [],distancia = [];
    for(var i = 0; i < 40; i++) {
        viv0.push(setA[i]['DenViv']);
        pop0.push(setA[i]['DenPop']);
        viv1.push(setB[i]['DenViv']);
        pop1.push(setB[i]['DenPop']);
        distancia.push(i+1);
    } 

    makePlot(viv0,viv1,pop0,pop1,distancia);
}

function makePlot(viv0,viv1,pop0,pop1,distancia) {

    var trace_viv0 = {
        x: distancia,
        y: viv0,
        name: 'Viv. 2000',
        mode: 'lines+markers',
        showlegend:true,
        marker: {
            width:3,
            color: '#440f76'
        }
    };
    var trace_viv1 = {
        x: distancia,
        y: viv1,
        name: 'Viv. 2016',
        mode: 'lines+markers',
        showlegend:true,
        marker: {
            width:3,
            color: '#9e2f7f'
        }
    };

    var trace_pop0 = {
        x: distancia,
        y: pop0,
        name: 'Pob. 2000',
        mode: 'lines+markers',
        showlegend:true,
        marker: {
            width:3,
            color: '#f1605d'
        }
    };
    var trace_pop1 = {
        x: distancia,
        y: pop1,
        name: 'Pob. 2016',
        mode: 'lines+markers',
        showlegend:true,

        marker: {
            width:3,
            color: '#feca8d'
        }
    };

    var data = [trace_viv0, trace_viv1, trace_pop0, trace_pop1]

    var config = {
        displayModeBar: false,
        displayLogo: false,
        responsive:true
    };

    var layout = {
        xaxis: {
            title: {
              text: 'Distancia a centro de la ciudad (km).',
            },
        },
        yaxis: {
            title: {
              text: 'Densidad de personas por km. cuadrado.',
            },
            hoverformat:'.2f'
        },
        plot_bgcolor: '#212121',
        paper_bgcolor:'#141414',
        hovermode: 'x unified',
        legend: {x:1,xanchor:'right',y:1},
        margin : {l:90,r:40,t:80,b:80},
        pad:{t:0,r:0,b:0,l:0},
        font : {
            color:'#bcbcbc'
        }
    }; 

    Plotly.newPlot('graph_censo', data,layout,config);

}


function renderDenue() {

    Plotly.d3.csv('./data/denue.csv' , function (data) {

        function filterData(year) {
            return data.filter(function (d) {return (d.anno == year)});  
        }

        function processRows(year) {

            var denCom = [],denInd = [], denOfic = [], denServ = [];
            var set = filterData(year); 
            for(var i = 0; i < 40; i++) {
                denCom.push(set[i]['DenCom']);
                denInd.push(set[i]['DenInd']);
                denOfic.push(set[i]['DenOfic']);
                denServ.push(set[i]['DenServ']);
            } 
            return [denCom,denInd,denOfic,denServ];
        }

        var config = {
            displayModeBar: false,
            displayLogo: false,
            responsive:true
        };

        var layout = {
            xaxis: {
                title: {
                  text: 'Distancia a centro de la ciudad (km).',
                }
            },
            yaxis: {
                title: {
                  text: 'Densidad de empleos por km. cuadrado.',
                },
                hoverformat:'.2f'
            },
            plot_bgcolor: '#212121',
            paper_bgcolor:'#141414',
            hovermode: 'x unified',
            legend: {x:1,xanchor:'right',y:1},
            margin : {l:90,r:40,t:80,b:80},
            pad:{t:0,r:0,b:0,l:0},
            font : {
                color:'#bcbcbc'
            }
        }; 

        var distancia = Array.from({length: 40}, (_, i) => i + 1); 

        function setDenue() {
            var initData = processRows(2019);   
            var trace_com = {
                x: distancia,
                y: initData[0],
                name: 'Comercio',
                mode: 'lines+markers',
                showlegend:true,
                marker: {
                    width:3,
                    color: '#feca8d'
                }
            };
            var trace_ind = {
                x: distancia,
                y: initData[1],
                name: 'Industria',
                mode: 'lines+markers',
                showlegend:true,
                marker: {
                    width:3,
                    color: '#f1605d'
                }
            };
        
            var trace_of = {
                x: distancia,
                y: initData[2],
                name: 'Oficina',
                mode: 'lines+markers',
                showlegend:true,
                marker: {
                    width:3,
                    color: '#9e2f7f'
                }
            };
            var trace_serv = {
                x: distancia,
                y: initData[3],
                name: 'Servicios',
                mode: 'lines+markers',
                showlegend:true,
        
                marker: {
                    width:3,
                    color: '#440f76'
                }
            };

        
            var data = [trace_com, trace_ind, trace_of, trace_serv]; 
            Plotly.newPlot('graph_denue', data,layout,config);
        }
        
        function updateDenue(year) {
            var updateData = processRows(year);

            var up_com = {
                y: [updateData[0]],
            };
            var up_ind = {
                y: [updateData[1]],
            };
        
            var up_of = {
                y: [updateData[2]],
            };
            var up_serv = {
                y: [updateData[3]],
            };

            Plotly.restyle('graph_denue', up_com, 0); 
            Plotly.restyle('graph_denue', up_ind, 1); 
            Plotly.restyle('graph_denue', up_of, 2); 
            Plotly.restyle('graph_denue', up_serv,3); 

            
        }

        setDenue(); 

        var btn2019 = document.getElementById('denue-2019');
        var btn2015 = document.getElementById('denue-2015');
        var btn2010 = document.getElementById('denue-2010');

        btn2019.addEventListener('click', function () {
            updateDenue(2019);
        }, false);

        btn2015.addEventListener('click', function () {
            updateDenue(2015);
        }, false);

        btn2010.addEventListener('click', function () {
            updateDenue(2010); 
        }, false);



    });

}

renderCenso(); 
renderDenue();


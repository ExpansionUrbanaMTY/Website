mapboxgl.accessToken = 'pk.eyJ1Ijoicm9wb25teCIsImEiOiJja2MyajhuMjIwMGxhMnN1bTRudTk5MmlxIn0.FaHKa4n3CaUvaTKcwLXXGw';
const colors = ['#fcfdbf', '#feca8d', '#fd9668', '#f1605d', '#cd4071', '#9e2f7f', '#721f81', '#440f76', '#180f3d', '#000004']; 
const thresholds = {'dist_cbd':[4, 8, 12, 16, 20, 24, 28, 32, 36, 40],
'Emp10_19':[-1999, 383, 2765, 5147, 7529, 9911, 12293, 14675, 17057, 19439],
'Pop0_16':[-17405, -1855, 13695, 29245, 44795, 60345, 75895, 91445, 106995, 122545],
'AreaC':[1371722, 2638261, 3904800, 5171339, 6437878, 7704417, 8970956, 10237495, 11504034, 12770573],
'CUS':[0.17, 0.31, 0.45, 0.59, 0.73, 0.87, 1.01, 1.15, 1.29, 1.43],
'Densidad90':[338, 676, 1014, 1352, 1690, 2028, 2366, 2704, 3042, 3380],
'Densidad00':[319.98499999999996, 630.3199999999999, 940.65, 1250.99, 1561.325, 1871.65, 2181.995, 2492.33, 2802.665, 3113.0],
'Densidad16':[340.698, 537.586, 734.473, 931.362, 1128.25, 1325.138, 1522.026, 1718.914, 1915.802, 2112.69],
'PropPC':[1.378, 2.196, 3.014, 3.832, 4.65, 5.468, 6.286, 7.104, 7.922, 8.74],
'ConpP':[96.679, 145.128, 193.577, 242.025, 290.475, 338.924, 387.373, 435.822, 484.271, 532.72],
'PorPav':[10.988, 12.596, 14.204, 15.812, 17.42, 19.028, 20.636, 22.244, 23.852, 25.46],
'CambioPP90':[-4.97, -3.858, -2.747, -1.636, -0.525, 0.586, 1.697, 2.808, 3.9190000000000005, 5.03]};

var activeLayer = '';
var loadFiles = [d3.json('./data/MapaGradientes.json'), d3.csv('./data/gradiente.csv')];
   

var map_dist = new mapboxgl.Map({
    container: 'map_dist',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-100.310015, 25.668289],
    zoom: 8.8
});



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
            }
        },
        yaxis: {
            title: {
              text: 'Densidad de personas por km. cuadrado.',
            }
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
                }
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
            var distancia = initData[4]
   
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
        }, false)

        btn2015.addEventListener('click', function () {
            updateDenue(2015);
        }, false)

        btn2010.addEventListener('click', function () {
            updateDenue(2010); 
        }, false)



    });

}

renderCenso(); 
renderDenue();


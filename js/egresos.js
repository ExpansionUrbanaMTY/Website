mapboxgl.accessToken = 'pk.eyJ1Ijoicm9wb25teCIsImEiOiJja2MyajhuMjIwMGxhMnN1bTRudTk5MmlxIn0.FaHKa4n3CaUvaTKcwLXXGw';
var activeYear = document.getElementById('select-bubbles').value;
var activeTab = 'b';
var activeMun = 'Monterrey';
var selectMun = document.getElementById('select-mun');
var btnRec = document.getElementById('recBtn');
var btnHist = document.getElementById('histBtn');
var yearBubbles = document.getElementById('select-bubbles');
var sliderYear = document.getElementById('slider-years');
var labelMun = document.getElementById('state-label');
var pcontents = {'1':1990,'2':2000,'3':2010,'4':2015,'5':2018}; 
var commaValues = d3.format('$,.0f');

const muncolors = {"Abasolo": "#89C5DA", "Apodaca": "#DA5724","Cadereyta": "#74D944","Ciénaga de Flores": "#CE50CA","El Carmen": "#3F4921","García": "#C0717C", 
    "General Escobedo": "#CBD588", "General Zuazua": "#5F7FC7", "Guadalupe": "#673770", "Juárez": "#D3D93E", "Monterrey": "#c84248","Pesquería": "#508578",
    "Salinas Victoria": "#D7C1B1", "San Nicolás": "#689030","San Pedro": "#8569D5", "Santa Catarina": "#CD9BCD", "Santiago": "#D14285"};


var map_mun = new mapboxgl.Map({
    container: 'map_mun',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-100.3155448, 25.82164],
    zoom: 8.0
});

function renderBubbles() {
    Plotly.d3.csv('./data/propinvajustado.csv', function(data) {
        function filterData(year, group) {
            return data.filter(function (d) {
                return (d.Year == year && d.hist === group)});
        }

        function processData(year, group) {
            var pob = [], propInv = [], propIng = [], mun = [];
            var set = filterData(year,group);
            for(var i = 0; i < set.length; i++) {
                pob.push(set[i]['Pob']);
                propInv.push(set[i]['prop_inv']);
                propIng.push(set[i]['prop_ingresos'])
                mun.push(set[i]['Municipio']);
            }

            return [propInv, propIng, pob, mun];

        }

        var config = {
            displayModeBar: false,
            displayLogo: false,
            responsive:true
        };
        
        var layout = {
            title: 'Tamaño de esferas equivale a población',
            xaxis: {
                title: {
                  text: 'Gastos en inversión del municipio (per cápita).',
                },
                hoverformat:'$,.2f'
            },
            yaxis: {
                title: {
                  text: 'Ingresos propios del municipio (per cápita)',
                },
                hoverformat:'$,.2f'
            },
            plot_bgcolor: '#212121',
            paper_bgcolor:'#141414',
            hovermode: 'closest',
            legend: {x:1,y:1,font:{size:12}},
            margin : {l:90,r:40,t:80,b:80},
            pad:{t:0,r:0,b:0,l:0},
            font : {
                color:'#bcbcbc'
            },
            showlegend:true
        }; 

        function setDenue() {
            var initData = processData(activeYear, activeTab);
            var traces = [];
            for(var i = 0; i < initData[3].length; i++) {
                traces.push(
                    {
                        type:'scatter',
                        x: [initData[0][i]],
                        y: [initData[1][i]],
                        mode: 'markers',
                        name: initData[3][i], 
                        marker: {
                            size: [initData[2][i]],
                            sizeref: 250,
                            sizemode: 'area',
                            color: muncolors[initData[3][i]],
                            line: {color:'#141414'}
                        },
                        text: [initData[3][i]],
                        hovertemplate: '<b>%{text}<b>' +
                        '<br><b>Población: </b>%{marker.size:,}'
                        + '<br><b>Gasto en inversión (per cap.): </b>%{x}' + '<br><b>Ingresos propios (per cap.): </b>%{y}' + '<extra></extra>'
                    }
                )
            }

            Plotly.newPlot('graph_bubbles',traces,layout,config);  
            
        }

        function updateBubbles(year,hist) {
            var initData = processData(year, hist);
            var traces = [];
            for(var i = 0; i < initData[3].length; i++) {
                traces.push(
                    {
                        type:'scatter',
                        x: [initData[0][i]],
                        y: [initData[1][i]],
                        mode: 'markers',
                        name: initData[3][i], 
                        marker: {
                            size: [initData[2][i]],
                            sizeref: 250,
                            sizemode: 'area',
                            color: muncolors[initData[3][i]],
                            line: {color:'#141414'}
                        },
                        text: [initData[3][i]],
                        hovertemplate: '<b>%{text}<b>' +
                        '<br><b>Población: </b>%{marker.size}'
                        + '<br><b>Gasto en inversión (per cap.): </b>%{x}' + '<br><b>Ingresos propios (per cap.): </b>%{y}' + '<extra></extra>'
                    }
                )
            }
            Plotly.react('graph_bubbles', traces,layout,config);
        }

        setDenue();

        btnRec.addEventListener('click', function () {
            activeTab = 'b'
            updateBubbles(activeYear,activeTab)
        }, false);

        btnHist.addEventListener('click', function () {
            activeTab = 'a'
            updateBubbles(activeYear,activeTab)
        }, false);

        yearBubbles.addEventListener('change', function () {
            activeYear = yearBubbles.value;
            updateBubbles(activeYear,activeTab);
        }, false);

    });

}

function renderIngresos() {
    Plotly.d3.csv('./data/ingegajustado.csv', function (data) {
        function municipioFilter(mun,tipo) {
            return data.filter(function (d) {
                return(d.mun === mun && d.t === tipo)});
        }

        function tipoFilter(mun, tipo,y) {
            return data.filter(function (d) {
                return(d.mun === mun && d.t === tipo && d.year == y)});
        }

        function processIng(mun,t) {
            var set = municipioFilter(mun,t); 
            var dataProp =  [], dataFed = [], dataDeuda = [];
            var periodo =  d3.map(set, function(d){return(d.year)}).keys(); 
            for(var i = 0; i < set.length; i++) {
                switch(set[i]['concepto']) {
                    case 'Ingresos propios':
                        dataProp.push(set[i]['monto']);
                        break;
                    case 'Ingresos provenientes de transferencias federales':
                        dataFed.push(set[i]['monto']);
                        break;
                    case 'Ingresos de deuda':
                        dataDeuda.push(set[i]['monto']);
                        break;
                    default:
                        console.log('Unknown row found!');
                }
            }

            return [dataProp.map(Number), dataFed.map(Number), dataDeuda.map(Number), periodo.map(Number)];
        }


        function processEg(mun,t) {
            var set = municipioFilter(mun,t); 
            var dataDeuda =  [], dataInv = [], dataGasto = [], dataOtros = [];
            var periodo =  d3.map(set, function(d){return(d.year)}).keys(); 
            for(var i = 0; i < set.length; i++) {
                switch(set[i]['concepto']) {
                    case 'Gasto corriente':
                        dataGasto.push(set[i]['monto']);
                        break;
                    case 'Inversión':
                        dataInv.push(set[i]['monto']);
                        break;
                    case 'Deuda':
                        dataDeuda.push(set[i]['monto']);
                        break;
                    case 'Otros':
                        dataOtros.push(set[i]['monto']);
                        break;
                    default:
                        console.log('Unknown row found!');
                }
            }

            return [dataGasto.map(Number), dataInv.map(Number), dataDeuda.map(Number), dataOtros.map(Number), periodo.map(Number)];
        }

       function processDist(mun,tipo,y) {
            var set = tipoFilter(mun,tipo,y); 
            var dataConc = [], dataMonto = [];
            for(var i = 0; i < set.length; i++) {
                dataConc.push(set[i]['concepto']);
                dataMonto.push(set[i]['monto']); 
            }
            
            return [dataConc, dataMonto.map(Number)]; 

        }

        var config = {
            displayModeBar: false,
            displayLogo: false,
            responsive:true
        };

        var config2 = {
            displayModeBar: false,
            displayLogo: false,
            responsive:true,
            staticPlot:true
        };

        var layout = {
            xaxis: {
                title: {
                  text: 'Año',
                }
            },
            yaxis: {
                title: {
                  text: 'Monto ingresos del municipio (MXN 2020)',
                },
                hoverformat:'$,.0f'
            },
            plot_bgcolor: '#212121',
            paper_bgcolor:'#141414',
            hovermode: 'x unified',
            legend: {x:-0.04, xanchor:'left',y:1.1,orientation:'h'},
            margin : {l:90,r:40,t:80,b:80},
            pad:{t:0,r:0,b:0,l:0},
            font : {
                color:'#bcbcbc'
            }
        }; 

        var layout2 = {
            xaxis: {
                title: {
                  text: 'Año',
                }
            },
            yaxis: {
                title: {
                  text: 'Monto egresos del municipio (MXN 2020)',
                },
                hoverformat:'$,.0f'
            },
            plot_bgcolor: '#212121',
            paper_bgcolor:'#141414',
            hovermode: 'x unified',
            legend: {x:-0.04, xanchor:'left',y:1.1,orientation:'h'},
            margin : {l:90,r:40,t:80,b:80},
            pad:{t:0,r:0,b:0,l:0},
            font : {
                color:'#bcbcbc'
            }
        }; 

        var layout3 = {
            xaxis: {
                title: {
                  text: 'Ingresos',
                }
            },
            yaxis: {
                title: {
                  text: 'Monto (MXN)',
                }
            },
            plot_bgcolor: '#212121',
            paper_bgcolor:'#141414',
            margin : {l:80,r:40,t:20,b:60},
            pad:{t:0,r:0,b:0,l:0},
            font : {
                color:'#bcbcbc'
            }
        }; 

        var layout4 = {
            xaxis: {
                title: {
                  text: 'Egresos',
                }
            },
            yaxis: {
                title: {
                  text: 'Monto (MXN)',
                }
            },
            plot_bgcolor: '#212121',
            paper_bgcolor:'#141414',
            margin : {l:50,r:40,t:20,b:60},
            pad:{t:0,r:0,b:0,l:0},
            font : {
                color:'#bcbcbc'
            }
        }; 

        function setHistIng() {
            var initData = processIng('Abasolo','ing');
            var periodo = initData[3]; 
            var trac_prop = {
               x: periodo,
               y: initData[0],
               name: 'Ingresos propios',
               mode: 'lines+markers', 
               showlegend: true, 
               marker: {
                   width: 3,
                   color: '#feca8d'
               }, 
               hovertemplate: '<b>Propios: </b>%{y} <extra></extra>'

            };

            var trac_fed = {
                x: periodo,
                y: initData[1],
                name: 'Ingresos de transferencias federales',
                mode: 'lines+markers', 
                showlegend: true, 
                marker: {
                    width: 3,
                    color: '#f1605d'
                },
                hovertemplate: '<b>Transf. Fed.: </b>%{y} <extra></extra>'
            }; 

            var trac_deuda = {
                x: periodo,
                y: initData[2],
                name: 'Ingresos de deuda',
                mode: 'lines+markers', 
                showlegend: true, 
                marker: {
                    width: 3,
                    color: '#9e2f7f'
                },
                hovertemplate: '<b>Deuda: </b>%{y} <extra></extra>'
            };

            var traces = [trac_prop, trac_fed, trac_deuda]; 
            Plotly.newPlot('historico_1', traces, layout, config); 

        }

        function setHistEg() {
            var initData = processEg('Abasolo','eg');
            var periodo = initData[4]; 

            var trac_gasto = {
               x: periodo,
               y: initData[0],
               name: 'Egreso por gasto corriente',
               mode: 'lines+markers', 
               showlegend: true, 
               marker: {
                   width: 3,
                   color: '#feca8d'
               }, 
               hovertemplate: '<b>Gasto corriente: </b>%{y} <extra></extra>'

            };

            var trac_inv = {
                x: periodo,
                y: initData[1],
                name: 'Egresos por inversión',
                mode: 'lines+markers', 
                showlegend: true, 
                marker: {
                    width: 3,
                    color: '#f1605d'
                },
                hovertemplate: '<b>Inversión: </b>%{y} <extra></extra>'
            }; 

            var trac_deuda = {
                x: periodo,
                y: initData[2],
                name: 'Egresos por deuda',
                mode: 'lines+markers', 
                showlegend: true, 
                marker: {
                    width: 3,
                    color: '#9e2f7f'
                },
                hovertemplate: '<b>Deuda: </b>%{y} <extra></extra>'
            };

            var trac_otro = {
                x: periodo,
                y: initData[3],
                name: 'Otros egresos',
                mode: 'lines+markers', 
                showlegend: true, 
                marker: {
                    width: 3,
                    color: '#440f76'
                },
                hovertemplate: '<b>Otros: </b>%{y} <extra></extra>'
            };

            var traces2 = [trac_gasto, trac_inv, trac_deuda, trac_otro]; 
            Plotly.newPlot('historico_2', traces2, layout2, config); 

        }

        function setBars() {
            var dataIng = processDist('Monterrey', 'ing' , pcontents[sliderYear.value]);
            var dataEng = processDist('Monterrey', 'eg' , pcontents[sliderYear.value]);
     
            var traceIng = {
                x: ['Propios','Trans. Fed','Deuda'],
                y: dataIng[1],
                width: 0.6,
                type: 'bar',
                text: dataIng[1].map(function(data){return String(commaValues(data/1000000)) + 'M'}),
                textposition:'auto',
                hoverinfo:'none',
                marker: {
                    color: ['#feca8d', '#f1605d', '#9e2f7f']
                }
            };

            var traceEg = {
                x: dataEng[0],
                y: dataEng[1],
                width:0.6,
                type: 'bar',
                text: dataEng[1].map(function(data){return String(commaValues(data/1000000)) + 'M'}),
                textposition:'auto',
                hoverinfo:'none',
                marker: {
                    color: ['#feca8d', '#f1605d', '#9e2f7f','#440f76']
                }
            }

            Plotly.newPlot('bars1',[traceIng], layout3, config2);
            Plotly.newPlot('bars2',[traceEg], layout4, config2);
            
        }

        function renderMap() {
            var shapeMun = './data/municipiosNL.geojson';
            var muns = Object.keys(muncolors), colors = Object.values(muncolors);
            var stepsMun = muns.map((mun,i) => {
                return[mun, colors[i]]; 
            });

            map_mun.on('load', function() {
                map_mun.addSource('municipios', {
                    type:'geojson',
                    data: shapeMun
                });

                map_mun.addLayer({
                    'id':'mun',
                    'type':'fill',
                    'source':'municipios',
                    'paint':{
                        'fill-color':'#120b2f',
                        'fill-opacity':0.99
                    },
                    'layout': {
                        'visibility': 'visible'
                    }
                });
                map_mun.addLayer({
                    'id':'munlines',
                    'type':'line',
                    'source':'municipios',
                    'paint':{
                        'line-color':'#e6e6e6',
                    },
                    'layout': {
                        'visibility': 'visible'
                    }
                });

               map_mun.addLayer({
                    'id':'mun_nom',
                    'type':'symbol',
                    'source':'municipios',
                    'paint':{
                        'text-color':'#e6e6e6'
                    },
                    'layout':{
                        'text-field':['get', 'NOMGEO'],
                        'text-font': ['Open Sans Semibold',
                        'Arial Unicode MS Bold'],
                        'text-offset': [0.4, -0.5],
                        'text-size':12,
                        'text-anchor': 'center',
                        //'text-ignore-placement':true
                        
                    }
                });

                map_mun.on('click','mun', function(e){
                    var munic = e.features[0].properties.NOMGEO; 
                    activeMun = munic; 
                    labelMun.textContent = activeMun; 
                    updateBars(munic, pcontents[sliderYear.value]);
                })
            });
        }

        function assignOptions() {
            var allGroup = d3.map(data, function(d){return(d.mun)}).keys(); 
            for (var i = 0; i < allGroup.length; i++) {
                var currentOption = document.createElement('option');
                currentOption.text = allGroup[i];
                selectMun.appendChild(currentOption);
            }
        }   


        function updateIng(mun) {

            var updateData = processIng(mun, 'ing');
            var periodo = updateData[3];
            var up_prop = {
                x: [periodo],
                y: [updateData[0]]
            };
            var up_fed = {
                x:[periodo], 
                y:[updateData[1]]
            };
            var up_deuda = {
                x:[periodo],
                y:[updateData[2]]
            }; 

            Plotly.restyle('historico_1', up_prop,0);
            Plotly.restyle('historico_1', up_fed,1); 
            Plotly.restyle('historico_1', up_deuda,2); 

        }


        function updateEg(mun) {

            var updateData = processEg(mun, 'eg');
            var periodo = updateData[4];
            var up_gasto = {
                x: [periodo],
                y: [updateData[0]]
            };

            var up_inv = {
                x: [periodo],
                y: [updateData[1]]
            }

            var up_deuda = {
                x:[periodo], 
                y:[updateData[2]]
            };
            var up_otro = {
                x:[periodo],
                y:[updateData[3]]
            }; 

            Plotly.restyle('historico_2', up_gasto,0);
            Plotly.restyle('historico_2', up_inv,1);
            Plotly.restyle('historico_2', up_deuda,2); 
            Plotly.restyle('historico_2', up_otro,3); 

        }

        function updateBars(mun, year) {
            var updateDataing = processDist(mun,'ing',year);
            var updateDataeg = processDist(mun,'eg',year);
            var upIng = {
                x: ['Propios','Trans. Fed','Deuda'],
                y: updateDataing[1],
                width:0.6,
                type: 'bar',
                text: updateDataing[1].map(function(data){return String(commaValues(data/1000000)) + 'M'}),
                textposition:'auto',
                hoverinfo:'none',
                marker: {
                    color: ['#feca8d', '#f1605d', '#9e2f7f']
                }
            }

            var upEg = {
                x: updateDataeg[0],
                y: updateDataeg[1],
                width:0.6,
                type: 'bar',
                text: updateDataeg[1].map(function(data){return String(commaValues(data/1000000)) + 'M'}),
                textposition:'auto',
                hoverinfo:'none',
                marker: {
                    color: ['#feca8d', '#f1605d', '#9e2f7f','#440f76']
                }
            }

            Plotly.react('bars1', [upIng], layout3, config2);
            Plotly.react('bars2', [upEg], layout4, config2);

            
        }

        assignOptions(); 
        setHistIng(); 
        setHistEg(); 
        setBars(); 
        renderMap(); 

        selectMun.addEventListener('change', function () {
            updateIng(this.value); 
            updateEg(this.value); 
        });

        sliderYear.addEventListener('change', function () {
            updateBars(activeMun, pcontents[this.value]);
        })


    });
}
renderBubbles(); 
renderIngresos(); 

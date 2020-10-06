var activeYear = document.getElementById('select-bubbles').value;
var activeTab = 'b';
var selectMun = document.getElementById('select-mun');
var btnRec = document.getElementById('recBtn');
var btnHist = document.getElementById('histBtn');
var yearBubbles = document.getElementById('select-bubbles');


const color_palette = {'b':['#000004', '#120b2f', '#2e0f5a', '#501479','#732181', '#942d80', '#b73b78', '#d74b6c', '#f2635e', '#fb8a66', '#ffb17c', '#ffd89b', '#fcfdc0'],
                'a':['#2e0f5a', '#942d80', '#f2635e', '#ffd89b']};

function renderBubbles() {
    Plotly.d3.csv('./data/propinv.csv', function(data) {
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
            xaxis: {
                title: {
                  text: 'Gastos en inversión del municipio (per cápita)',
                }
            },
            yaxis: {
                title: {
                  text: 'Ingresos propios del municipio (per cápita)',
                },
                hoverformat:'.2f'
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
            var colors = color_palette[activeTab]
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
                            color: colors[i],
                            line: {color:'#141414'}
                        },
                        text: [initData[3][i]],
                        hovertemplate: '<b>%{text}<b>' +
                        '<br><b>Población: </b>%{marker.size}'
                        + '<br><b>Gasto en inversión (per cap.): </b>%{x}' + '<br><b>Ingresos propios (per cap.): </b>%{y}' + '<extra></extra>'
                    }
                )
            }

            Plotly.newPlot('graph_bubbles',traces,layout,config);  
            
        }

        function updateBubbles(year,hist) {
            var initData = processData(year, hist);
            var traces = [];
            var colors = color_palette[hist];
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
                            color: colors[i],
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
    Plotly.d3.csv('./data/ingeg.csv', function (data) {
        function municipioFilter(mun,tipo) {
            return data.filter(function (d) {
                return(d.mun === mun && d.t === tipo)});
        }

        /*function tipoFilter(histr, tipo,y) {
            return data.filter(function (d) {
                return(d.hist === histr && d.t === tipo && d.year == y)});
        }*/

        function processIng(mun,t) {
            var set = municipioFilter(mun,t); 
            var dataProp =  [], dataFed = [], dataDeuda = [];
            var periodo =  d3.map(set, function(d){return(d.year)}).keys(); 
            for(var i = 0; i < set.length; i++) {
                switch(set[i]['concepto']) {
                    case 'Ingresos propios':
                        dataProp.push(set[i]['prop_ingr']);
                        break;
                    case 'Ingresos provenientes de transferencias federales':
                        dataFed.push(set[i]['prop_ingr']);
                        break;
                    case 'Ingresos de deuda':
                        dataDeuda.push(set[i]['prop_ingr']);
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
                        dataGasto.push(set[i]['prop_ingr']);
                        break;
                    case 'Inversión':
                        dataInv.push(set[i]['prop_ingr']);
                        break;
                    case 'Deuda':
                        dataDeuda.push(set[i]['prop_ingr']);
                        break;
                    case 'Otros':
                        dataOtros.push(set[i]['prop_ingr']);
                        break;
                    default:
                        console.log('Unknown row found!');
                }
            }

            return [dataGasto.map(Number), dataInv.map(Number), dataDeuda.map(Number), dataOtros.map(Number), periodo.map(Number)];
        }

       /* function processDist(histr,tipo,y) {
            var set = tipoFilter(histr,tipo,y); 
            var dataMun = [], dataConc = [], dataMonto = [];
            for(var i = 0; i < set.length; i++) {
                dataMun.push(set[i]['mun']),
                dataConc.push(set[i]['concepto']);
                dataMonto.push(set[i]['monto']); 
            }
            
            return [dataMun, dataConc, dataMonto.map(Number)]; 

        }*/

        var config = {
            displayModeBar: false,
            displayLogo: false,
            responsive:true
        };

        var layout = {
            xaxis: {
                title: {
                  text: 'Año',
                }
            },
            yaxis: {
                title: {
                  text: 'Monto ingresos del municipio (per cápita)',
                },
                hoverformat:'.2f'
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
                  text: 'Monto egresos del municipio (per cápita)',
                },
                hoverformat:'.2f'
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


        /*var layout3 = {
            plot_bgcolor: '#212121',
            paper_bgcolor:'#141414',
            margin : {l:0,r:0,t:0,b:0},
            font : {
                color:'#bcbcbc'
            }
        }; */

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
/*
        function setTree() {
            var initData_l = processDist('a', 'ing', 2018);
            var initData_r = processDist('b', 'ing',2018);
            console.log(initData_l);
            var traces_l = [{
                type: "treemap",
                labels:  ["Guadalupe","Ingresos propios", "Ingresos provenientes de transferencias federales", "Ingresos de deuda"],
                parents: ["","Guadalupe", "Guadalupe", "Guadalupe"],
                values:   [,653250941, 1805378768, 75184782],
                textinfo: "label+value+percent parent+percent entry",
                domain: {"x": [0, 0.25]},
                outsidetextfont: {"size": 20, "color": "#377eb8"},
                marker: {"line": {"width": 2}},
                pathbar: {"visible": false}
              },
              {
                type: "treemap",
                labels:  ["Monterrey","Ingresos propios", "Ingresos provenientes de transferencias federales", "Ingresos de deuda"],
                parents: ["","Monterrey", "Monterrey", "Monterrey"],
                values:   [,2886395879, 2886395879, 2886395879],
                textinfo: "label+value+percent parent+percent entry",
                domain: {"x": [0.25, .5]},
                outsidetextfont: {"size": 20, "color": "#377eb8"},
                marker: {"line": {"width": 2}},
                pathbar: {"visible": false}
              },
              {
                type: "treemap",
                labels:  ["Monterrey","Ingresos propios", "Ingresos provenientes de transferencias federales", "Ingresos de deuda"],
                parents: ["","Monterrey", "Monterrey", "Monterrey"],
                values:   [,2886395879, 2886395879, 2886395879],
                textinfo: "label+value+percent parent+percent entry",
                domain: {"x": [0.5, .75]},
                outsidetextfont: {"size": 20, "color": "#377eb8"},
                marker: {"line": {"width": 2}},
                pathbar: {"visible": false}
              },
              {
                type: "treemap",
                labels:  ["Monterrey","Ingresos propios", "Ingresos provenientes de transferencias federales", "Ingresos de deuda"],
                parents: ["","Monterrey", "Monterrey", "Monterrey"],
                values:   [,2886395879, 2886395879, 2886395879],
                textinfo: "label+value+percent parent+percent entry",
                domain: {"x": [0.75, 1]},
                outsidetextfont: {"size": 20, "color": "#377eb8"},
                marker: {"line": {"width": 2}},
                pathbar: {"visible": false}
              }
            ]; 

           // var traces = [traces_l, traces_1];

            Plotly.newPlot('treemap_hist', traces_l, layout3, config);

        }
*/

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

        assignOptions(); 
        setHistIng(); 
        setHistEg(); 
        //setTree(); 

        selectMun.addEventListener('change', function () {
            updateIng(this.value); 
            updateEg(this.value); 
        });



    });
}
renderBubbles(); 
renderIngresos(); 
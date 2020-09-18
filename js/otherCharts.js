async function readData(){
    let poblacion = await d3.csv('./data/Poblacion.csv');
    let densidad = await d3.csv('./data/DensidadPob.csv');
    let extension = await d3.csv('./data/Extensiones.csv');
    let pavimentos = await d3.json('./data/pavimentos.json');
    //Costos
    var costContainer = document.getElementById('costChart');
    var costChart = new Chart(costContainer, {
        type: 'line',
        data: {
            labels: Object.keys(pavimentos.historicosTotales).filter(l=>l!=""),
            datasets: [
            {
                fill: 'origin',
                label: 'Total',
                data: Object.values(pavimentos.historicosTotales).filter(l=>l!="Total"),
                backgroundColor: '#f3775e',
            }]
        },
        options: {
            scales: {
                
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        userCallback: function(value, index, values) {
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                            value = value.join(',');
                            return value;
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Costo anual en pesos mexicanos del 2019'
                    }
                }],
                xAxes:[{
                    scaleLabel: {
                        display: true,
                        labelString: 'Año'
                    }
                }]
            }
        }
    });
    //Reposicion de pavimientos
    var repsocicionTendencialContainer = document.getElementById('reposicionTendencial');
    var pavimentosTData = {
        label: 'Escenario Tendencial',
        data: [3582080933,1092159413,594911379,5269151724,19543818461,],
        backgroundColor: [
            'rgba(210, 65, 111)',
            'rgba(210, 65, 111)',
            'rgba(210, 65, 111)',
            'rgba(210, 65, 111)',
            'rgb(153,43,129)'
        ],
        borderColor: [
            'rgba(210, 65, 111)',
            'rgba(210, 65, 111)',
            'rgba(210, 65, 111)',
            'rgba(210, 65, 111)',
            'rgb(153,43,129)'
        ],
        borderWidth: 2,
        hoverBorderWidth: 0
    };
    var reposicionTendencial = new Chart(repsocicionTendencialContainer, {
        type: 'bar',
        data: {
            labels: ["Vialidades primarias", "Vialidades secundarias", "Vialidades locales", "Costo Total", "Gasto Municipal ZMM"],
            datasets: [pavimentosTData]
        },
        options: {
            tooltips: {
                callbacks: {
                      label: function(tooltipItem, data) {
                          var value = data.datasets[0].data[tooltipItem.index];
                          value = value.toString();
                          value = value.split(/(?=(?:...)*$)/);
                          value = value.join(',');
                          return value;
                      }
                } // end callbacks:
              }, //end tooltips
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        userCallback: function(value, index, values) {
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                            value = value.join(',');
                            return value;
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Costo anual en pesos mexicanos del 2019'
                    }
                }],
                xAxes:[{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0
                    },
                }]
            }
        }
    });




    var pavimentosOData = {
        label: 'Escenario Óptimo',
        data: [4513630853,1365199266,991518965,6870349084,19543818461],
        backgroundColor: [
            'rgba(210, 65, 111)',
            'rgba(210, 65, 111)',
            'rgba(210, 65, 111)',
            'rgba(210, 65, 111)',
            'rgb(153,43,129)'
        ],
        borderColor: [
            'rgba(210, 65, 111)',
            'rgba(210, 65, 111)',
            'rgba(210, 65, 111)',
            'rgba(210, 65, 111)',
            'rgb(153,43,129)'
        ],
        borderWidth: 2,
        hoverBorderWidth: 0
    };


    var repsocicionOptimaContainer = document.getElementById('reposicionOptima');
    var reposicionOptima = new Chart(repsocicionOptimaContainer, {
        type: 'bar',
        data: {
            labels: ["Vialidades primarias", "Vialidades secundarias", "Vialidades locales", "Costo Total", "Gasto Municipal ZMM"],
            datasets: [pavimentosOData]
        },
        options: {
            tooltips: {
                callbacks: {
                      label: function(tooltipItem, data) {
                          var value = data.datasets[0].data[tooltipItem.index];
                          value = value.toString();
                          value = value.split(/(?=(?:...)*$)/);
                          value = value.join(',');
                          return value;
                      }
                } // end callbacks:
              }, //end tooltips
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        userCallback: function(value, index, values) {
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                            value = value.join(',');
                            return value;
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Costo anual en pesos mexicanos del 2019'
                    }
                }],
                xAxes:[{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0
                    },
                }]
            }
        }
    });

    // Gráficas Costos Pavimentación 



    //----------------------------------Forma Urbana-------------------------------------------------------------

    let poblacionf = await d3.csv('./data/censo.csv');

    //Poblacion

}

readData(); 
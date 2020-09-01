//lectura de datos
async function readData(){
    let poblacion = await d3.csv('./data/Poblacion.csv');
    let densidad = await d3.csv('./data/DensidadPob.csv');
    let extension = await d3.csv('./data/Extensiones.csv');


    // Poblacion
    var populationContainer = document.getElementById('populationChart');
    var populationChart = new Chart(populationContainer, {
        type: 'bar',
        data: {
            labels: Object.keys(poblacion[2]).filter(l=>l!=""),
            datasets: [{
                label: 'Total',
                data: Object.values(poblacion[2]).filter(l=>l!="Total"),
                backgroundColor: [
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)'
                ],
                borderColor: [
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)'
                ],
                borderWidth: 1
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
                        labelString: 'Número de Habitantes'
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
    //Densidad
    var densityContainer = document.getElementById('densityChart');
    var densityChart = new Chart(densityContainer, {
        type: 'bar',
        data: {
            labels: Object.keys(densidad[2]).filter(l=>l!=""),
            datasets: [{
                label: 'Núcleo',
                data: Object.values(densidad[0]).filter(l=>l!="Nucleo"),
                backgroundColor: [
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)'
                ],
                borderColor: [
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)'
                ],
                borderWidth: 1
            },
            {
                label: 'Complemento',
                data: Object.values(densidad[1]).filter(l=>l!="Complemento"),
                backgroundColor: [
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)'
                ],
                borderColor: [
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)'
                ],
                borderWidth: 1
            },
            {
                label: 'Total',
                data: Object.values(densidad[2]).filter(l=>l!="Total"),
                backgroundColor: [
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)'
                ],
                borderColor: [
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)'
                ],
                borderWidth: 1
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
                        labelString: 'Número de habitantes / Kilómetros Cuadrados'
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
    //Extensiones
    var extensionsContainer = document.getElementById('extensionsChart');
    var extensionsChart = new Chart(extensionsContainer, {
        type: 'bar',
        data: {
            labels: Object.keys(extension[2]).filter(l=>l!=""),
            datasets: [{
                label: 'Total',
                data: Object.values(extension[2]).filter(l=>l!="Total"),
                backgroundColor: [
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)'
                ],
                borderColor: [
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)',
                    'rgba(210, 65, 111)'
                ],
                borderWidth: 1
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
                        labelString: 'Kilómetros cuadrados'
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

    //Costos
    var costContainer = document.getElementById('costChart');
    var costChart = new Chart(costContainer, {
        type: 'line',
        data: {
            labels: Object.keys(extension[2]).filter(l=>l!=""),
            datasets: [
            {
                fill: 'origin',
                label: 'Total',
                data: Object.values(extension[2]).filter(l=>l!="Total"),
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
                        labelString: 'Miles de millones de pesos mexicanos'
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
    var reposicionTendencial = new Chart(repsocicionTendencialContainer, {
        type: 'bar',
        data: {
            labels: Object.keys(extension[2]).filter(l=>l!=""),
            datasets: [
            {
                fill: 'origin',
                label: 'Total',
                data: Object.values(extension[2]).filter(l=>l!="Total"),
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
                        labelString: 'Miles de millones de pesos mexicanos'
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
    var repsocicionOptimaContainer = document.getElementById('reposicionOptima');
    var reposicionOptima = new Chart(repsocicionOptimaContainer, {
        type: 'bar',
        data: {
            labels: Object.keys(extension[2]).filter(l=>l!=""),
            datasets: [
            {
                fill: 'origin',
                label: 'Total',
                data: Object.values(extension[2]).filter(l=>l!="Total").map((l,i)=>l-10*i**2),
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
                        labelString: 'Miles de millones de pesos mexicanos'
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

    //----------------------------------Forma Urbana-------------------------------------------------------------

    let poblacionf = await d3.csv('./data/censo.csv');

    //Poblacion

}

readData(); 
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
                label: 'Núcleo',
                data: Object.values(poblacion[0]).filter(l=>l!="Nucleo"),
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
                data: Object.values(poblacion[1]).filter(l=>l!="Complemento"),
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
                data: Object.values(poblacion[2]).filter(l=>l!="Total"),
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
                        labelString: 'Habitantes'
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
                        labelString: 'Habitantes / Kilómetros Cuadrados'
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
                label: 'Núcleo',
                data: Object.values(extension[0]).filter(l=>l!="Nucleo"),
                backgroundColor: [
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)'
                ],
                borderColor: [
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)'
                ],
                borderWidth: 1
            },
            {
                label: 'Complemento',
                data: Object.values(extension[1]).filter(l=>l!="Complemento"),
                backgroundColor: [
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)'
                ],
                borderColor: [
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)'
                ],
                borderWidth: 1
            },
            {
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
                }]
            }
        }
    });

    //Costos
    var costContainer = document.getElementById('costChart');
    var costChart = new Chart(costContainer, {
        type: 'bar',
        data: {
            labels: Object.keys(extension[2]).filter(l=>l!=""),
            datasets: [{
                label: 'Costo de pavimentación',
                data: Object.values(extension[0]).filter(l=>l!="Nucleo"),
                backgroundColor: [
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)'
                ],
                borderColor: [
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)',
                    'rgba(252, 186, 128)'
                ],
                borderWidth: 1
            },
            {
                label: 'Tomas de agua',
                data: Object.values(extension[1]).filter(l=>l!="Complemento"),
                backgroundColor: [
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)'
                ],
                borderColor: [
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)',
                    'rgba(243, 119, 94)'
                ],
                borderWidth: 1
            },
            {
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
                        labelString: 'Pesos Mexicanos'
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
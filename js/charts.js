//lectura de datos
async function readData(){
    let poblacion = await d3.csv('./data/Poblacion.csv');
    let densidad = await d3.csv('./data/DensidadPob.csv');
    let extension = await d3.csv('./data/Extensiones.csv');
    let pavimentos = await d3.json('./data/pavimentos.json');

    // // Poblacion
    var populationContainer = document.getElementById('populationChart');
    var populationChart = new Chart(populationContainer, {
        type: 'line',
        data: {
            labels: Object.keys(poblacion[2]).filter(l=>l!=""),
            datasets: [{
                label: 'Número de habitantes por año',
                data: Object.values(poblacion[2]).filter(l=>l!="Total"),
                backgroundColor: 'rgba(210, 65, 111)',
                borderColor: '#f3719a',
                borderWidth: 2
            }]
        },
        options: {
            overlayText: 'x 1.8 veces',
            overlayTextColor: 'white',
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
                        labelString: 'Número de Habitantes'
                      }
                }],
                xAxes:[{
                    maxBarThickness: 30, 
                    scaleLabel: {
                        display: true,
                        labelString: 'Año', 
                      }
                }]
            }

        }
    });
    //Densidad
    var densityContainer = document.getElementById('densityChart');
    var densityChart = new Chart(densityContainer, {
        type: 'line',
        data: {
            labels: Object.keys(densidad[2]).filter(l=>l!=""),
            datasets: [
            {
                label: 'Número de habitantes por kilómetro cuadrado',
                data: Object.values(densidad[2]).filter(l=>l!="Total"),
                backgroundColor: 'rgba(210, 65, 111)',
                borderColor: '#f3719a',
                borderWidth: 2
            }]
        },
        options: {
            overlayText: '-32%',
            overlayTextColor: 'white',
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
                        labelString: 'Número de habitantes / Kilómetros Cuadrados'
                      }
                }],
                xAxes:[{
                    maxBarThickness: 30, 
                    scaleLabel: {
                        display: true,
                        labelString: 'Año', 
                      }
                }]
            }
        }
    });
    //Extensiones
    var extensionsContainer = document.getElementById('extensionsChart');
    var extensionsChart = new Chart(extensionsContainer, {
        type: 'line',
        data: {
            labels: Object.keys(extension[2]).filter(l=>l!=""),
            datasets: [
                {
                label: 'Kilómetros cuadrados por año',
                data: Object.values(extension[2]).filter(l=>l!="Total"),
                backgroundColor: 'rgba(210, 65, 111)',
                borderColor: '#f3719a',
                borderWidth: 2
            }]
        },
        options: {
            overlayText: "x 2.7 veces",
            overlayTextColor: 'white',
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
                    maxBarThickness: 50,
                    scaleLabel: {
                        display: true,
                        labelString: 'Año', 
                      }
                }]
            }
        }
    });
}

Chart.pluginService.register({
    afterDraw: function(chart) {
      var width = chart.chart.width,
          height = chart.chart.height,
          ctx = chart.chart.ctx,
          opts = chart.options;
        let text = opts.overlayText || "";
        ctx.fillStyle = opts.overlayTextColor || 'black';
        ctx.restore();
        var fontSize = (height / 200).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";

        var textX = Math.round((chart.chartArea.left + chart.chartArea.right - ctx.measureText(text).width) / 2),
            textY = height/1.5;
            
        ctx.fillText(text, textX, textY);
        ctx.save();
    }
});



readData();  
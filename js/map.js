var mySlider = new rSlider({
    target: '#sampleSlider',
    values: [1990, 1995, 2000, 2005, 2010, 2015, 2018, 2019],
    range: false,
    tooltip: false,
    scale: true,
    labels: true,
    set: [1990]
});

// Callback
mySlider.onChange(function (values) { 
    console.log(slider.getValue());
    console.log("hola=")
});

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function playSlider(){
    var values = [1990, 1995, 2000, 2005, 2010, 2015, 2018, 2019];
    for(let i=0;i<8;i++){
        mySlider.setValues(values[i])
    }
}

// document.querySelector('#slider').addEventListener('change', (e)=>{
//     let value = e.target.value;
//     let years = [1990, 1995, 2000, 2005, 2010, 2015, 2019];
//     let selectedYear = years[value-1]
//     document.querySelector('#year').innerText = `Año seleccionado: ${selectedYears}`;
// });


var rows;

d3.csv("./data/FishnetRecortadoT.csv", function(loadedRows) {
    rows = loadedRows;
    console.log(rows)

    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9wb25teCIsImEiOiJjazg1OHpseHcwMG1lM2VrbGo1emY5enVzIn0.v27OOfnnNHFavaO04-affQ';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-100.309, 25.6714],
    zoom: 8
    });
    
    map.on('load', function() {
        d3.json(
        './data/gridDef2.geojson',
        function(err, data) {
        if (err) throw err;
        

        
        map.addSource('expansion', {
        'type': 'geojson',
        data: data
        });
        
        map.addLayer({
            'id': 'id',
            'type': 'fill',
            'source': 'expansion',
            'layout': {},
            'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.8
            }
        });
            
        
        }
        );
    });


});




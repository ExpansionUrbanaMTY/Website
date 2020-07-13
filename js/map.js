// var mySlider = new rSlider({
//     target: '#sampleSlider',
//     values: [1990, 1995, 2000, 2005, 2010, 2015, 2018, 2019],
//     range: false,
//     tooltip: false,
//     scale: true,
//     labels: true,
//     set: [1990]
// });

// // Callback
// mySlider.onChange(function (values) { 
//     console.log(slider.getValue());
//     console.log("hola=")
// });
const years = [1990, 1995, 2000, 2005, 2010, 2015, 2019]

function onChange(value){
    let year = years[value]
    document.querySelector('#year').innerHTML = `Año seleccionado: ${year}`;
    map2.setLayoutProperty(year.toString(), 'visibility', 'visible');

    setTimeout(()=>{
        years.forEach(y=>{
            map2.setLayoutProperty(y.toString(), 'visibility', y==year ? 'visible' : 'none');
        })
    }, 900);

    
}

document.querySelector('#slider').addEventListener('change', (e)=>{
    onChange(e.target.value)
})

function playSlider(){
    for(let i=0;i<7;i++){
        setTimeout(()=>{
            document.querySelector('#slider').value = i;
            onChange(i)
        }, 1000 * (i+1));
    }
    return;
}

// Generar mapa
mapboxgl.accessToken = 'pk.eyJ1Ijoicm9wb25teCIsImEiOiJjazg1OHpseHcwMG1lM2VrbGo1emY5enVzIn0.v27OOfnnNHFavaO04-affQ';
let map2 = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-100.309, 25.6714],
    zoom: 8
});
loadMap()

// Cargar datos de csv y geojson al mapa
async function loadMap(){
    map2.resize();
    let rows = await d3.csv('./data/FishnetRecortado.csv');
    let geojson = await d3.json('./data/gridDef2.geojson')
    map2.on('load', (e)=>{
        map2.addSource('expansion', {
            type: 'geojson', 
            data: geojson
        });
        years.forEach((year)=>{
            var expression = ['match', ['get', 'Id']];
            rows.forEach(function(row) {
                if(row['MU'+year]=='1'){
                    expression.push(Number(row['Id']), '#088');
                } else {
                    expression.push(Number(row['Id']), 'transparent');
                }
            });
            expression.push('#fff')
            map2.addLayer({
                'id': year.toString(),
                'type': 'fill',
                'source': 'expansion',
                // 'source-layer': 'expansion',
                'layout': {},
                'paint': {
                    'fill-color': expression,
                    // 'fill-color': '#088',
                    'fill-opacity': 0.8
                }
            });
            map2.setLayoutProperty(year.toString(), 'visibility', 'none');
        })
        map2.setLayoutProperty(years[0].toString(), 'visibility', 'visible');
    })
}




// var rows;

// d3.csv("./data/FishnetRecortadoT.csv", function(loadedRows) {
//     rows = loadedRows;
//     // console.log(rows)
//     var map = new mapboxgl.Map({
//         container: 'map',
//         style: 'mapbox://styles/mapbox/streets-v11',
//         center: [-100.309, 25.6714],
//         zoom: 8
//     });
    
//     map.on('load', ()=>{
//         d3.json('./data/gridDef2.geojson', (err, data)=>{
//             if (err) throw err;
//             map.addSource('expansion', {
//                 'type': 'geojson',
//                 data: data
//             });
        
//             map.addLayer({
//                 'id': 'id',
//                 'type': 'fill',
//                 'source': 'expansion',
//                 'layout': {},
//                 'paint': {
//                 'fill-color': '#088',
//                 'fill-opacity': 0.8
//                 }
//             });
            
        
//         });
//     });


// });




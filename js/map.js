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
let years = [1990, 1995, 2000, 2005, 2010, 2015, 2019]

function onChange(element){
    let year = years[element.value]
    document.querySelector('#year').innerHTML = `Año seleccionado: ${year}`
    document.querySelectorAll('.map>*').forEach(l=>{l.style.display='none'})
    document.querySelector('#map-'+year).style.display = 'block'
}

document.querySelector('#slider').addEventListener('change', (e)=>{
    onChange(e.target)
})

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function playSlider(){
    var values = [1990, 1995, 2000, 2005, 2010, 2015, 2019];
    for(let i=0;i<7;i++){
        setTimeout(()=>{
            document.querySelector('#slider').value = i;
            onChange(document.querySelector('#slider'))
        }, 1000 * i);
    }
    return;
}

// document.querySelector('#slider').addEventListener('change', (e)=>{
//     let value = e.target.value;
//     let years = [1990, 1995, 2000, 2005, 2010, 2015, 2019];
//     let selectedYear = years[value-1]
//     document.querySelector('#year').innerText = `Año seleccionado: ${selectedYears}`;
// });

// Eato hace el mapa

loadMap(1990)
loadMap(1995)
loadMap(2000)
loadMap(2005)
loadMap(2010)
loadMap(2015)
loadMap(2019)

document.querySelector('#map-1990').style.display = 'block'
// Esto hace lo mismo que lo de abajo pero más
// Esto es para añadirle los datos según el año
// Ando leyendolo de acá, mira: https://docs.mapbox.com/mapbox-gl-js/example/data-join/ 
async function loadMap(year){

    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9wb25teCIsImEiOiJjazg1OHpseHcwMG1lM2VrbGo1emY5enVzIn0.v27OOfnnNHFavaO04-affQ';
    let map2 = new mapboxgl.Map({
        container: 'map-'+year,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-100.309, 25.6714],
        zoom: 8
    });
    map2.resize();
    document.querySelector('#map-'+year).style.display = 'none'

    let rows = await d3.csv('./data/FishnetRecortado.csv');
    let geojson = await d3.json('./data/gridDef2.geojson')
    
    map2.on('load', (e)=>{
        map2.addSource('expansion', {
            type: 'geojson', 
            data: geojson
        });
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
            'id': 'id',
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




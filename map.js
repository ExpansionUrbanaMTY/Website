const years = [1990, 1995, 2000, 2005, 2010, 2015, 2019];

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9wb25teCIsImEiOiJjazg1OHpseHcwMG1lM2VrbGo1emY5enVzIn0.v27OOfnnNHFavaO04-affQ';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-100.8126957, 25.801482],
    zoom: 8.8
});

let changeLayer = (value)=>{
    let year = years[value]; 
    document.querySelector('#title').innerHTML = `Extensión Territorial de la Zona Metropolitana de Monterrey`;
    map.setLayoutProperty(year.toString(), 'visibility', 'visible');
    setTimeout(()=>{
        years.filter(y=>y!=year).forEach(y=>{
            map.setLayoutProperty(y.toString(), 'visibility', 'none');
        })
    }, 1000)
    d3.csv('./data/Extensiones.csv').then(data=>{
        console.log(data)
        document.querySelector("#superficie-año").innerHTML = data[2][year] || data[2]["2019*"]
    });
}

let autoplay = (i)=>(
    new Promise((resolve, reject)=>{
        setTimeout(()=>{
            if(i<=7){
                document.querySelector("#slider").value = i-1;
                changeLayer(i-1);
            }
            resolve("Done")    
            console.log(i-1);    
        }, 1500*i)
    })
)

let loadMap = async ()=>{
    map.resize();
    let rows = await d3.csv('./data/FishnetRecortado.csv');
    let geojson = await d3.json('./data/gridDef2.geojson');
    map.addSource('expansion', {
        type: 'geojson',
        data: geojson
    });
    years.forEach((year)=>{
        var expression = ['match', ['get', 'Id']];
        rows.forEach(function(row) {
            if(row['MU'+year]=='1'){
                expression.push(Number(row['Id']), '#F3775D');
            } else {
                expression.push(Number(row['Id']), 'transparent');
            }
        });
        expression.push('#fff')
        map.addLayer({
            'id': year.toString(),
            'type': 'fill',
            'source': 'expansion',
            'layout': {},
            'paint': {
                'fill-color': expression,
                'fill-opacity': 0.8
            }
        });
        map.setLayoutProperty(year.toString(), 'visibility', 'none');
    });
    map.setLayoutProperty(years[6].toString(), 'visibility', 'visible');
}

loadMap()

document.querySelector('#slider').addEventListener('change', (e)=>{
    changeLayer(e.target.value)
})

document.querySelector('#autoplay').addEventListener('click', ()=>{
    document.getElementById("autoplay").setAttribute("disabled","true");
    let promises = [];
    for(let i=1;i<=8;i++){
        promises.push( autoplay(i) );
    }
    Promise.all(promises).then(()=>{
        document.querySelector("#slider").value = 6;
        changeLayer(6);
        document.getElementById("autoplay").removeAttribute("disabled");
    })
    return;
})
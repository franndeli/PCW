'use strict'
let currentPage = 1;

function mostrarFotos(pagina, inicio, fin) { 
    if (pagina) {
        currentPage = pagina;
    }
    if(pagina == 1){
        inicio = 0; fin = 5;
    }
    if (inicio < 0) {
        inicio = 0;
        fin = 5;
    }
    if (pagina < 1) {
        pagina = 1;
    }
    if (fin < inicio) {
        fin = inicio + 5;
    }
    let son = [];
    let xhr = new XMLHttpRequest(),
    url = `api/publicaciones?pag=${currentPage}`;
    xhr.open('GET', url, true);
    xhr.onload = function() {
        let respuesta = JSON.parse(xhr.responseText),
            html = '';
        
        respuesta.FILAS.forEach(function(e) {
          son.push(e);
        });
        let contador = 0;
        let longitud = son.length; 
        if(fin > longitud){
            fin = longitud - 1;
        }
        if(contador < 6){
            for(let i = inicio; i<=fin; i++) {
                if (son[i]) {
                    const fecha = new Date(son[i].fechaCreacion);
                    const fechaString = `${('0' + fecha.getDate()).slice(-2)}-${('0' + (fecha.getMonth() + 1)).slice(-2)}-${fecha.getFullYear()} `;
                    //console.log(i);
                    //console.log(son[i]);
                    html += `<li><a href="publicacion.html?id=${son[i].id}" title="${son[i].titulo}">
                        <div class="imagen"><img src="fotos/pubs/${son[i].imagen}" width="280" height="210" alt="${son[i].titulo}"></div>
                        <h3>${son[i].titulo}</h3></a>
                        <p>${son[i].autor}</p>
                        <p>${fechaString}</p>
                        </li>`;
                }
            }
            contador++;
        }        
        document.querySelector('#publi').innerHTML = html;
        // calcular la cantidad de páginas necesarias
        let totalPublicaciones = respuesta.FILAS.length;
        let cantidadPaginas = Math.ceil(totalPublicaciones / 6);

        // actualizar el texto de la barra de navegación
        let currentElement = document.querySelector('#current');
        currentElement.innerHTML = `Página ${pagina} de ${cantidadPaginas}`;

        // desactivar o activar los botones de navegación según corresponda
        let firstButton = document.querySelector('#first');
        let previousButton = document.querySelector('#previous');
        let nextButton = document.querySelector('#next');
        let lastButton = document.querySelector('#last');

        if (pagina === 1) {
            firstButton.disabled = true;
            previousButton.disabled = true;
        } else {
            firstButton.disabled = false;
            previousButton.disabled = false;
        }

        if (pagina === cantidadPaginas) {
            nextButton.disabled = true;
            lastButton.disabled = true;
        } else {
            nextButton.disabled = false;
            lastButton.disabled = false;
        }

        // agregar los event listeners a los botones de navegación
        firstButton.addEventListener('click', function() {
            inicio=0;
            fin=5;
            mostrarFotos(1, inicio);
        });
        previousButton.addEventListener('click', function() {
            mostrarFotos(pagina - 1, inicio - 5, fin - 5);
        });
        nextButton.addEventListener('click', function() {
            mostrarFotos(pagina + 1, inicio + 6, fin + 6);
        });
        lastButton.addEventListener('click', function() {
            let ultimaPagina = cantidadPaginas;
            let inicioUltimaPagina = (ultimaPagina - 1) * 6;
            let finUltimaPagina = totalPublicaciones - 1;
            mostrarFotos(ultimaPagina, inicioUltimaPagina, finUltimaPagina);
          });
    };

    xhr.send();
}
/*
function mostrarFotos(){
    let xhr = new XMLHttpRequest(),
        url = 'api/publicaciones';
    xhr.open('GET', url, true);
    xhr.onload = function() {
        console.log(xhr.responseText)
        let respuesta = JSON.parse(xhr.responseText),
            html = '',
            contador = 0;
        console.log(respuesta);
        respuesta.FILAS.forEach(function(e) {
            console.log('fechaCreacion:', e.fechaCreacion);
            const fecha = new Date(e.fechaCreacion);
            console.log('fecha:', fecha);
            const fechaString = `${('0' + fecha.getDate()).slice(-2)}-${('0' + (fecha.getMonth() + 1)).slice(-2)}-${fecha.getFullYear()} `;
            if (contador < 6) {
                html += `<li><a href="publicacion.html?id=${e.id}" title="${e.titulo}">
                    <div class="imagen"><img src="fotos/pubs/${e.imagen}" width="280" height="210" alt="${e.titulo}"></div>
                    <h3>${e.titulo}</h3></a>
                    <p>${e.autor}</p>
                    <p>${fechaString}</p>
                    </li>`;
                contador++;
            }
        });
        document.querySelector('#publi').innerHTML = html;
    }
    xhr.send();
}
function paginas(){

}*/
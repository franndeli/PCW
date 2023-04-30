'use strict'

function mostrarFotos(pagina) {
    const registrosPorPagina = 6;
    let xhr = new XMLHttpRequest(),
        url = `api/publicaciones?pag=${pagina}&lpag=${registrosPorPagina}`;
    xhr.open('GET', url, true);
    xhr.onload = function() {
        let respuesta = JSON.parse(xhr.responseText),
            html = '';

        respuesta.FILAS.forEach(function(e) {
            const fecha = new Date(e.fechaCreacion);
            const fechaString = `${('0' + fecha.getDate()).slice(-2)}-${('0' + (fecha.getMonth() + 1)).slice(-2)}-${fecha.getFullYear()} `;
            html += `<li><a href="publicacion.html?id=${e.id}" title="${e.titulo}">
                <div class="imagen"><img src="fotos/pubs/${e.imagen}" width="280" height="210" alt="${e.titulo}"></div>
                <h3>${e.titulo}</h3></a>
                <p>${e.autor}</p>
                <p>${fechaString}</p>
                </li>`;
        });

        document.querySelector('#publi').innerHTML = html;

        // Convertir los valores de PAG y LPAG a números
        const paginaActual = parseInt(respuesta.PAG, 10);
        const totalPublicaciones = parseInt(respuesta.TOTAL_COINCIDENCIAS, 10);
        const totalPaginas = Math.ceil(totalPublicaciones / registrosPorPagina);

        // actualizar el texto de la barra de navegación
        let currentElement = document.querySelector('#current');
        currentElement.innerHTML = `Página ${paginaActual + 1} de ${totalPaginas}`;

        // desactivar o activar los botones de navegación según corresponda
        let firstButton = document.querySelector('#first');
        let previousButton = document.querySelector('#previous');
        let nextButton = document.querySelector('#next');
        let lastButton = document.querySelector('#last');

        firstButton.disabled = paginaActual === 0;
        previousButton.disabled = paginaActual === 0;
        nextButton.disabled = paginaActual === (totalPaginas - 1);
        lastButton.disabled = paginaActual === (totalPaginas - 1);

        // agregar los event listeners a los botones de navegación
        firstButton.onclick = function() {
            mostrarFotos(0);
        };
        previousButton.onclick = function() {
            mostrarFotos(paginaActual - 1);
        };
        nextButton.onclick = function() {
            mostrarFotos(paginaActual + 1);
        };
        lastButton.onclick = function() {
            mostrarFotos(totalPaginas - 1);
        };
    };

    xhr.send();
}

// Llama a la función al cargar la página para mostrar las primeras 6 publicaciones
document.addEventListener('DOMContentLoaded', function() {
    mostrarFotos(0);
});

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
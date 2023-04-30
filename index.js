'use strict'

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
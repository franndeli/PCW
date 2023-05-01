'use strict'

document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();
    buscar();
});

function mostrarResultados(publicaciones, totalPublicaciones, pagina) {
    let html = '';
    publicaciones.forEach(function(e) {
        const fecha = new Date(e.fechaCreacion);
        const fechaString = `${('0' + fecha.getDate()).slice(-2)}-${('0' + (fecha.getMonth() + 1)).slice(-2)}-${fecha.getFullYear()} `;
        html += `<li><a style="text-decoration: none; color: black;" href="publicacion.html?id=${e.id}" title="${e.titulo}">
            <div class="imagen"><img src="fotos/pubs/${e.imagen}" width="280" height="210" alt="${e.titulo}"></div>
            <h3>${e.titulo}</h3></a>
            <p>${e.autor}</p>
            <p>${fechaString}</p>
            </li>`;
    });
    document.querySelector('#publi').innerHTML = html;
    
    const totalPaginas = Math.ceil(totalPublicaciones / 6);
    const paginationElement = document.getElementById('pagination');
    
    if (totalPublicaciones > 0) {
        paginationElement.style.display = 'block';
        document.querySelector('#current').innerHTML = `Página ${pagina + 1} de ${totalPaginas}`;
    } else {
        paginationElement.style.display = 'none';
    }
}

function buscar(pagina = 0) {
    let texto = document.getElementById("nombrebuscar").value;
    let fechaDesde = document.getElementById("start").value;
    let fechaHasta = document.getElementById("end").value;
    let zona = document.getElementById("zona").value;
    let registrosPorPagina = 6;

    let url = "api/publicaciones?";
    let parametros = [];

    if (texto) {
        parametros.push("t=" + encodeURIComponent(texto));
    }
    if (fechaDesde) {
        parametros.push("fd=" + encodeURIComponent(fechaDesde));
    }
    if (fechaHasta) {
        parametros.push("fh=" + encodeURIComponent(fechaHasta));
    }
    if (zona) {
        parametros.push("z=" + encodeURIComponent(zona));
    }
    parametros.push("pag=" + encodeURIComponent(pagina));
    parametros.push("lpag=" + encodeURIComponent(registrosPorPagina));

    url += parametros.join("&");

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la petición: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.RESULTADO === "OK") {
                mostrarResultados(data.FILAS, data.TOTAL_COINCIDENCIAS, pagina);
                actualizarBotones(data.TOTAL_COINCIDENCIAS, pagina);
            }
        })
        .catch(error => {
            console.error("Error al realizar la búsqueda: ", error);
        });
}

function buscarPorUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const nombreZona = urlParams.get("nombreZona");
    if (nombreZona) {
        document.getElementById("zona").value = nombreZona;
        buscar();
    }
}

function actualizarBotones(totalPublicaciones, paginaActual) {
    const totalPaginas = Math.ceil(totalPublicaciones / 6);
    document.querySelector('#first').disabled = paginaActual === 0;
    document.querySelector('#previous').disabled = paginaActual === 0;
    document.querySelector('#next').disabled = paginaActual === (totalPaginas - 1);
    document.querySelector('#last').disabled = paginaActual === (totalPaginas - 1);

    document.querySelector('#first').onclick = function() {
        buscar(0);
    };
    document.querySelector('#previous').onclick = function() {
        buscar(paginaActual - 1);
    };
    document.querySelector('#next').onclick = function() {
        buscar(paginaActual + 1);
    };
    document.querySelector('#last').onclick = function() {
        buscar(totalPaginas - 1);
    };
}

function pedirZonas() {
    let xhr = new XMLHttpRequest(),
        url = 'api/zonas';

    xhr.open('GET', url, true);
    xhr.onload = function() {
        let respuesta = JSON.parse(xhr.responseText),
            html = '';
        //console.log(respuesta);
        respuesta.FILAS.forEach(function(e) {
            //console.log(e);
            html += `<option>${e.nombre}</option>`;
        });
        document.querySelector('#zonas').innerHTML = html;
    };
    xhr.send();
}

window.addEventListener('DOMContentLoaded', buscarPorUrl);

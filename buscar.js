'use strict'

document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();
    buscar();
  });

  function mostrarResultados(publicaciones) {
    let html = '';
    publicaciones.forEach(function(e) {
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
    }
  
  function buscar() {
    // Obtener la información de los campos del formulario
    let nombreBuscar = document.getElementById("nombrebuscar").value;
    let fechaInicio = document.getElementById("start").value;
    let fechaFin = document.getElementById("end").value;
    let ubicacion = document.getElementById("nivel").value;
  
    // Realizar la búsqueda con la información obtenida
    buscarPublicaciones(nombreBuscar, fechaInicio, fechaFin, ubicacion);
  }
  
  function buscarPublicaciones(nombreBuscar, fechaInicio, fechaFin, ubicacion) {
    // Ejemplo de cómo mostrar las publicaciones filtradas en el elemento con id "publi"
    let publi = document.getElementById("publi");
    let publicacionesFiltradas = []; // Aquí se deben almacenar las publicaciones filtradas según los criterios de búsqueda
  
    publicacionesFiltradas.forEach((publicacion) => {
      let listItem = document.createElement("li");
      listItem.innerHTML = publicacion; // Aquí debes adaptar el código para mostrar la información de cada publicación de manera adecuada
      publi.appendChild(listItem);
    });
  }

    function buscarPorUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const nombreZona = urlParams.get("nombreZona");
        if (nombreZona) {
            document.getElementById("nivel").value = nombreZona;
            buscar();
        }
    }

    function buscar() {
        let texto = document.getElementById("nombrebuscar").value;
        let fechaDesde = document.getElementById("start").value;
        let fechaHasta = document.getElementById("end").value;
        let zona = document.getElementById("nivel").value;
        let pagina = 0;
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
                    mostrarResultados(data.FILAS);
                }
            })
            .catch(error => {
                console.error("Error al realizar la búsqueda: ", error);
            });
    }

window.addEventListener('DOMContentLoaded', buscarPorUrl);


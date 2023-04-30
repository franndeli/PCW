'use strict'

function redirigir() {
    if(window.location.href == "lugar.html")
        window.location.href = "index.html";
}

function obtenerLugar() {
    let params = new URLSearchParams(location.search);
    var id = params.get('id');

    let xhr = new XMLHttpRequest(),
        url = 'api/zonas/';
    url += id;

    console.log(url);

    xhr.open('GET', url, true);
    xhr.onload = function() {
        let respuesta = JSON.parse(xhr.responseText),
            html = '';
        console.log(respuesta);

        let valoracion = parseInt(respuesta.FILAS[0].valoracion_media, 10);
        let estrellas = creaEstrellas(valoracion);

        html +=
        `<div>
            <h4><b>NOMBRE: </b>${respuesta.FILAS[0].nombre}</h4>
            <h4><b>Dirección: </b>${respuesta.FILAS[0].direccion}</h4>
            <h4><b>Población: </b>${respuesta.FILAS[0].poblacion}</h4>
            <h4><b>Provincia: </b>${respuesta.FILAS[0].provincia}</h4>
            <h4><b>Valoración media: </b>` + estrellas +
            `<a href="#valoraciones">nº de valoraciones: ${respuesta.FILAS[0].nvaloraciones}</a></h4>
            </h4>
            <h4><b>Comentario:<br></b></h4>
            <textarea rows="4" cols="50" readonly>${respuesta.FILAS[0].comentario}</textarea>
            <h4><b>Etiquetas: </b> ${respuesta.FILAS[0].etiquetas}</h4>
            <p id="nombre-fecha">${respuesta.FILAS[0].login} - <time>${respuesta.FILAS[0].fecha_alta}</time></p>
        </div>
        <div>
            <h4><b>Fotos del lugar:<br></b></h4>
            <img src="fotos/lugares/${respuesta.FILAS[0].imagen}" alt="${respuesta.FILAS[0].nombre}" width="650">
        </div>`;

        document.querySelector('#section1').innerHTML = html;
    }

    xhr.send();

}

function obtenerValoraciones() {
    let params = new URLSearchParams(location.search);
    var id = params.get('id');

    let xhr = new XMLHttpRequest(),
        url = 'api/lugares/';
    url += id + '/valoraciones';

    xhr.open('GET', url, true);
    xhr.onload = function() {
        let respuesta = JSON.parse(xhr.responseText),
            html = '';
        console.log(respuesta);

        respuesta.FILAS.forEach(function(e) {
            let valoracion = respuesta.FILAS[0].puntuacion;
            let estrellas = creaEstrellas(valoracion);

            html +=
            `<div>
                <h4>Valoración:` + estrellas + `</h4>
                <p>${e.usuario} - <time>${e.fecha}</time></p>
                <img src="fotos/usuarios/${e.foto_usuario}" alt="${e.usuario}" height="80" width="80">
                <textarea rows="4" cols="50" readonly>${e.texto}</textarea>
            </div>`;
        });

        document.querySelector('#section2').innerHTML = html;

    }

    xhr.send();

}

function cargarFormulario() {
    if(localStorage.getItem('login') || sessionStorage.getItem('login')){
        let url = 'frmLugar.html';

        fetch(url).then(function(respuesta) {
        if(respuesta.ok) {
            respuesta.text().then(function(html) {
                document.querySelector('#section3').innerHTML = html;
            });
        } else {
            console.log('No se encuentra el fichero');
        }
        }).catch(function(error) {
            console.log('Error: ' + error);
        });
    } else {
        let html = `<a href="login.html">Para poder dejar una valoración debes estar logueado</a>`
        document.querySelector('#section3').innerHTML = html;
    }
}

function dejarValoracion(frm) {
    let params = new URLSearchParams(location.search);
    var id = params.get('id');

    let xhr = new XMLHttpRequest(),
        fd = new FormData(frm),
        url = 'api/lugares/',
        user;
    url += id + '/valoracion';

    if(localStorage.getItem('login'))
        user = JSON.parse(localStorage.getItem('login'));
    else
        user = JSON.parse(sessionStorage.getItem('login'));

    xhr.open('POST', url, true);
    xhr.onload = function() {
        let respuesta = JSON.parse(xhr.responseText);
        console.log(respuesta);

        obtenerLugar();
        obtenerValoraciones();
        document.getElementById('frmLugar').reset();

        let correcto = document.querySelector('#valCorrecta');

        correcto.onclose=function(){
        if(correcto.returnValue=='cerrar')
            console.log('Valoración correcta');
        }
        correcto.showModal();
    }

    xhr.setRequestHeader('Authorization', user.LOGIN + ':' + user.TOKEN);
    xhr.send(fd);

    return false;

}

function creaEstrellas(val) {
    let html = '';

    for(var i=0; i<val; i++) {
        html += `<span class="icon-star"></span>`;
    }

    return html;
}
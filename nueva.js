'use strict'

function usuario(){
    let user;
    if(localStorage.getItem('datos'))
        user = JSON.parse(localStorage['datos']);
    else
        user = JSON.parse(sessionStorage['datos']);

    console.log(user.LOGIN);
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

function abrirFicha() {
    document.getElementById("fichaFoto").style.display = "block";
}

let hayFoto = false;

function fotosPublicacion(foto){
    const maxSize = 300 * 1024;
    let fichero = foto.files[0];

    if(fichero && fichero.size <= maxSize){
        foto.parentNode.querySelector('img').src = URL.createObjectURL(fichero);
        hayFoto = true;
    } else{
        foto.value = '';
        let incorrecto = document.querySelector('#fotoGrande');
        
        incorrecto.onclose = function(){
        if(incorrecto.returnValue == 'cerrar')
            console.log('ERROR: añadir foto');
        }
        incorrecto.showModal();
    }
}

function restaurarFoto(){
    document.querySelector('#imgFoto').src = 'imagenes/nofoto.png';
    document.querySelector('#foto').value = '';
    hayFoto = false;
}

function crearPublicacion(evt){
    evt.preventDefault();
    if(!hayFoto){
        let incorrecto = document.querySelector('#faltaFoto');
        
        incorrecto.onclose = function(){
        if(incorrecto.returnValue == 'cerrar')
            console.log('ERROR: añadir foto');
        }
        incorrecto.showModal();
    }
    else{
        let xhr = new XMLHttpRequest(),
        url = 'api/publicaciones',
        fd = new FormData(evt.currentTarget),
        user;
        if(localStorage.getItem('datos'))
            user = JSON.parse(localStorage['datos']);
        else
            user = JSON.parse(sessionStorage['datos']);
        //console.log(user.LOGIN);
        xhr.open('POST', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            let respuesta = xhr.response;
            console.log(respuesta);
            console.log(hayFoto);
            
            let correcto = document.querySelector('#lugarGuardado');

            correcto.onclose = function(){
            if(correcto.returnValue == 'cerrar')
                console.log('Lugar guardado');
                window.location.href = "index.html";
            }
            correcto.showModal();
            
        }
        xhr.setRequestHeader('Authorization', user.LOGIN + ':' + user.TOKEN);
        xhr.send(fd);
        return false;
    }
}
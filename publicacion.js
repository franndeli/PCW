'use strict';

let publicacionId;

function init() {
    const publicacionId = obtenerPublicacion();
    obtenerFotos();
    mostrarFotos();
    if (publicacionId){
        obtenerComentarios(publicacionId);
    }
}

function obtenerPublicacion() {
    let params = new URLSearchParams(location.search);
    let publicationId = params.get('id');

    publicacionId = publicationId;

    if (!publicationId) {
        console.error("No se proporcionó un ID de publicación.");
        return;
    }

    console.log('publicationId:', publicationId);

    let url = 'api/publicaciones/' + publicationId;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error al obtener los datos de la publicación");
            }
        })
        .then(data => {
            if (data.CODIGO === 200 && data.RESULTADO === 'OK' && data.FILAS && data.FILAS.length > 0) {
                const publication = data.FILAS[0];
                displayPublicationData(publication);
            } else {
                console.error('Error al obtener los datos de la publicación:', data);
                window.location.href = "index.html";
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos de la publicación:', error);
            window.location.href = "index.html";
        });
    
    return publicationId;
}


function displayPublicationData(publication) {
    console.log('displayPublicationData called with:', publication);

    const titleElement = document.getElementById("publication-title");
    const locationElement = document.getElementById("publication-location");
    const authorDateElement = document.getElementById("publication-author-date");
    const authorPhoto = document.getElementById("publication-author-photo");
    const textElement = document.getElementById("publication-text");
    const meGustaElement = document.getElementById("publication-megusta");
    const nomeGustaElement = document.getElementById("publication-nomegusta");

    locationElement.href = `buscar.html?nombreZona=${encodeURIComponent(publication.nombreZona)}`;

    titleElement.innerText = publication.titulo || "";
    locationElement.innerText = publication.nombreZona || "";
    authorDateElement.innerText = publication.autor + ', ' + formatDate(publication.fechaCreacion) || "";
    authorPhoto.innerHTML = `
    <img src="fotos/usuarios/${publication.fotoAutor}" alt="Foto de ${publication.fotoAutor}"></img>
    `
    textElement.innerHTML = publication.texto;
    meGustaElement.innerHTML = publication.nMeGusta;
    nomeGustaElement.innerHTML = publication.nNoMeGusta;
}

function obtenerFotos() {
    let params = new URLSearchParams(location.search);
    let publicationId = params.get('id');

    if (!publicationId) {
        console.error("No se proporcionó un ID de publicación.");
        return;
    }

    let url = 'api/publicaciones/' + publicationId + '/fotos';

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error al obtener las fotos de la publicación");
            }
        })
        .then(data => {
            if (data.CODIGO === 200 && data.RESULTADO === 'OK' && data.FILAS && data.FILAS.length > 0) {
                displayPublicationPhotos(data.FILAS);
            } else {
                console.error('Error al obtener las fotos de la publicación:', data);
            } 
        })
        .catch(error => {
            console.error('Error al obtener las fotos de la publicación:', error);
        });
}


function displayPublicationPhotos(photos) {
    console.log(photos);
    let photosContainer = document.getElementById('photos-container');
    photosContainer.innerHTML = '';

    photos.forEach(function (photo) {
        let imgElement = document.createElement('img');
        imgElement.src = "fotos/pubs/" + photo.archivo;
        imgElement.alt = photo.descripcion || "Foto de la publicación";
        imgElement.width = 300;
        imgElement.style.margin = '5px';

        photosContainer.appendChild(imgElement);
    });
}

function mostrarFotos() {
    let togglePhotosButton = document.getElementById("toggle-photos-btn");
    let photosContainer = document.getElementById("photos-container");

    togglePhotosButton.addEventListener("click", function () {
        if (photosContainer.style.display === "none") {
            photosContainer.style.display = "block";
            togglePhotosButton.textContent = "Ocultar fotos";
        } else {
            photosContainer.style.display = "none";
            togglePhotosButton.textContent = "Mostrar fotos";
        }
    });
}

function obtenerComentarios(idPublicacion) {
    fetch(`api/publicaciones/${idPublicacion}/comentarios`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error al obtener los comentarios");
            }
        })
        .then(comentarios => {
            console.log('Comentarios recibidos:', comentarios);
            mostrarComentarios(comentarios.FILAS);
            actualizarContadorComentarios(comentarios.FILAS);
        })
        .catch(error => {
            console.error("Error al obtener los comentarios:", error);
        });
}

  
function mostrarComentarios(comentarios) {
    let comentariosContainer = document.getElementById("comentarios-container");
    comentariosContainer.innerHTML = "";

    comentarios.forEach(comentario => {
        let comentarioElement = document.createElement("div");
        comentarioElement.classList.add("comentario");

        let fecha = new Date(comentario.fechaHora);
        let fechaFormateada = fecha.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
        });

        comentarioElement.innerHTML = `
        <fieldset class="comentsolo">
            <legend>
                <img src="fotos/usuarios/${comentario.foto}" alt="Foto de ${comentario.nombre}">
                <p class="nombrecoment">${comentario.nombre}</p>
            </legend>
            <div>
                <div class="textopubli">
                    <p>${comentario.texto}</p>
                    <p class="fechacoment"><span class="icon-calendar"></span>${fechaFormateada}</p>
                </div>
            </div>
        </fieldset>
        `;

        comentariosContainer.appendChild(comentarioElement);
        actualizarContadorComentarios(comentarios);
    });
}

function crearComentario(frm) {
    let texto = document.getElementById("Comment").value;

    if (!texto) {
        return;
    }

    let xhr = new XMLHttpRequest();
    let url = `api/publicaciones/${publicacionId}/comentarios`,
        fd = new FormData(frm),
        user = JSON.parse(sessionStorage['datos']),
        auth;

    xhr.open("POST", url, true);
    xhr.responseType = 'json';

    xhr.onload = function(){
        let res = xhr.response;

        if ((xhr.status === 200 || xhr.status === 201) && res.RESULTADO === "OK") {
            // Llamar a la función obtenerComentarios para actualizar la lista
            obtenerComentarios(publicacionId);
            document.getElementById("Comment").value = '';

            // Crear el mensaje modal
            let dialogo = document.createElement('dialog');
            let html = '';

            html += '<h3>Su comentario se ha guardado correctamente</h3>';
            html += '<button onclick="cerrarDialogo();">Cerrar</button>';

            dialogo.innerHTML = html;

            document.body.appendChild(dialogo);

            dialogo.showModal();
        } else {
            console.error("Error al guardar el comentario", res);
        }
    }

    auth = user.LOGIN + ':' + user.TOKEN;
    console.log(auth);
    xhr.setRequestHeader('Authorization', auth);
    xhr.send(fd);
    
    return false;
}

function votePublication(idPublication, voteType) {
    let xhr = new XMLHttpRequest();
    let url = `api/publicaciones/${idPublication}/${voteType}`;
    let user = JSON.parse(sessionStorage['datos']);
    let auth;

    xhr.open("POST", url, true);
    xhr.responseType = 'json';

    xhr.onload = function() {
        let res = xhr.response;
    
        if ((xhr.status === 200 || xhr.status === 201) && res.RESULTADO === "OK") {
            document.getElementById("publication-megusta").innerText = res.nMeGusta;
            document.getElementById("publication-nomegusta").innerText = res.nNoMeGusta;
    
            let btnMeGusta = document.getElementById("btn-megusta");
            let btnNoMeGusta = document.getElementById("btn-nomegusta");
    
            // Habilita o deshabilita los botones
            if (res.meGusta === 1) {
                btnMeGusta.dataset.voted = "true";
                btnNoMeGusta.dataset.voted = "false";
            } else if (res.meGusta === 0) {
                btnNoMeGusta.dataset.voted = "true";
                btnMeGusta.dataset.voted = "false";
            } else {
                btnMeGusta.dataset.voted = "false";
                btnNoMeGusta.dataset.voted = "false";
            }
        } else {
            console.error("Error en la votación", res);
        }
    }
    

    auth = user.LOGIN + ':' + user.TOKEN;
    xhr.setRequestHeader('Authorization', auth);
    xhr.send();

    return false;
}

function actualizarContadorComentarios(comentarios) {
    const contadorComentarios = document.getElementById("publication-comments-count");
    const numComentarios = comentarios.length;

    contadorComentarios.textContent = `${numComentarios} comentario${numComentarios !== 1 ? 's' : ''}`;
}

function formatDate(dateString) {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + year;
}

function cerrarDialogo() {
    const dialogo = document.querySelector('dialog');
    dialogo.close();
    dialogo.remove();
}

document.addEventListener('DOMContentLoaded', init);

document.querySelector("#btn-megusta").addEventListener("click", () => {
    let idPublication = publicacionId;
    let btnNoMeGusta = document.getElementById("btn-nomegusta");

    if (btnNoMeGusta.dataset.voted !== "true") {
        votePublication(idPublication, "megusta");
    }
});

document.querySelector("#btn-nomegusta").addEventListener("click", () => {
    let idPublication = publicacionId;
    let btnMeGusta = document.getElementById("btn-megusta");

    if (btnMeGusta.dataset.voted !== "true") {
        votePublication(idPublication, "nomegusta");
    }
});

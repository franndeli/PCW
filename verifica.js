'use strict'

window.addEventListener('DOMContentLoaded', checkLoginStatus);

function checkLoginStatus() {
    const loggedIn = sessionStorage['datos'] !== undefined;
    const currentPage = window.location.pathname.split('/').pop();
  
    // Modificar el menú
    const loginLink = document.querySelector('#nav_login');
    const registerLink = document.querySelector('#nav_registro');
    const newPlaceLink = document.querySelector('#nav_nueva');
    const logoutLink = document.querySelector('#nav_logout');

    if (loginLink && registerLink && newPlaceLink && logoutLink) {
        if (loggedIn) {
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            newPlaceLink.style.display = 'block';
            logoutLink.style.display = 'block';

            const datos = JSON.parse(sessionStorage['datos']);
            logoutLink.innerHTML = `<span> logout (${datos.LOGIN})</span>`;
        } else {
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';
            newPlaceLink.style.display = 'none';
            logoutLink.style.display = 'none';
        }
    }

    if (currentPage === 'publicacion.html') {
        if (loggedIn) {
            cargarFormularioComentarios();
        } else {
            mostrarMensajeLogueo();
        }
    }

    if (loggedIn && (currentPage === 'login.html' || currentPage === 'registro.html')) {
        window.location.href = 'index.html';
    } else if (!loggedIn && currentPage === 'nueva.html') {
        window.location.href = 'index.html';
    }

    if (loggedIn) {
        logoutLink.addEventListener('click', logout);
    }

    return loggedIn;
}

function cargarFormularioComentarios() {
    fetch("formulario_comentarios.html")
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Error al obtener el formulario de comentarios");
        }
      })
      .then(html => {
        const formularioContainer = document.getElementById("formulario-container");
        formularioContainer.innerHTML = html;
      })
      .catch(error => {
        console.error("Error al obtener el formulario de comentarios:", error);
      });
}
  
function mostrarMensajeLogueo() {
    const mensaje = "Debes estar logueado para poder dejar un comentario. ";
    const enlace = '<a href="login.html">Inicia sesión o Regístrate</a>';
    const formularioContainer = document.getElementById("formulario-container");
    formularioContainer.innerHTML = `
    <fieldset class="publi">
        <article>
            <h4>${mensaje}${enlace}</h4>
        </article>
    </fieldset>
    `;
}

function logout() {
    sessionStorage.removeItem('datos');
    window.location.href = 'index.html';
    logoutLink.addEventListener('click', logout);
}
  
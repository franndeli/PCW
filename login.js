'use strict'

function mostrarMensajeError() {
  let dialogo = document.createElement('dialog'),
      html = '';

  html += '<h3>Error en el inicio de sesión</h3>';
  html += '<p>El nombre de usuario o la contraseña es incorrecto. Por favor, intentelo nuevamente.</p>';
  html += '<button onclick="cerrarDialogo(1);">Cerrar</button>';

  dialogo.innerHTML = html;

  document.body.appendChild(dialogo);

  dialogo.showModal();
}

function cerrarDialogo(tipo) {
  let dialogo = document.querySelector('dialog');
  dialogo.close();
  document.body.removeChild(dialogo);

  if (tipo === 1) {
      document.getElementsByName('nombre')[0].focus();
  } else if(tipo == 2){
    window.location.href = 'index.html';
  }
}

function hacerLogin(evt) {
  evt.preventDefault();

  let frm = evt.currentTarget,
      xhr = new XMLHttpRequest(),
      url = 'api/post/usuarios/login.php',
      fd = new FormData(frm);

  fd.append('login', frm.elements['nombre'].value);
  fd.append('pwd', frm.elements['contraseña'].value);

  xhr.open('POST', url, true);
  xhr.responseType = 'json';

  xhr.onload = function () {
      let res = xhr.response;

      if (res.RESULTADO == 'OK') {
          console.log(res);
          let dialogo = document.createElement('dialog'),
              html = '';

          html += '<h3>Bienvenido ';
          html += res.NOMBRE;
          html += '</h3>';
          html += '<h4>Ultimo acceso: ';
          html += res.ULTIMO_ACCESO;
          html += '</h4>';
          html += '<button onclick="cerrarDialogo(2);">Cerrar</button>';

          dialogo.innerHTML = html;

          document.body.appendChild(dialogo);

          dialogo.showModal();

          sessionStorage['datos'] = JSON.stringify(res);

          let datos = JSON.parse(sessionStorage['datos']);
          console.log(datos.LOGIN);

      } else {
          console.log('error');
          mostrarMensajeError();
      }

  }

  xhr.send(fd);
}

'use strict'

function hacerRegistro(frm) {
    let xhr = new XMLHttpRequest(),
        url = 'api/usuarios/registro',
        fd = new FormData(frm);
    let login = frm.login.value,
        pwd = frm.pwd.value,
        pwd2 = frm.pwd2.value;

    xhr.open('POST', url, true);
    xhr.responseType = 'json';
    xhr.onload = function(){
        let respuesta = xhr.response,
            html = '';
        console.log(respuesta);

        if (respuesta != null) {
            if(respuesta.RESULTADO == "ERROR") {
                if(pwd != pwd2) {
                    html += `<p style="color: red; font-weight: bold;">LAS CONTRASEÑAS NO COINCIDEN</p>`;
                    document.querySelector('#error').innerHTML = html;
                }else {
                    html += `<p style="color: red; font-weight: bold;">ESTE USUARIO YA EXISTE</p>`;
                    document.querySelector('#error').innerHTML = html;
                }
            } 
            else {
                var save = document.querySelector('#formulario');
                sessionStorage.setItem('login', save.login.value);
                let correcto = document.querySelector('#registroCorrecto');
                correcto.onclose = function(){
                    if(correcto.returnValue=='cerrar')
                        console.log('Registro correcto');
                        window.location.href = "login.html";
                }
                correcto.showModal();
            }
        }
        else {
            html += `<p style="color: red; font-weight: bold;">ERROR EN EL SERVIDOR</p>`;
            document.querySelector('#error').innerHTML = html;
            console.log("La respuesta del servidor es nula");
        }
    }
    xhr.send(fd);
    return false;
}

function mostrarFoto(inpFile){
    const maxSize = 300 * 1024;
    let foto = inpFile.files[0];

    if (foto && foto.size > maxSize) {
        html += `<p style="color: red; font-weight: bold;">FOTO NO VALIDA</p>`;
        document.querySelector('#error').innerHTML = html;
    }
    else if(foto && foto.size < maxSize){
        document.querySelector('#imgFoto').src = URL.createObjectURL(foto);
        console.log('Imagen introducida correctamente');
    }
}

function restaurarFoto(){
    document.querySelector('#imgFoto').src = 'imagenes/vacia.png'
}
'use strict'

let hayFoto = false;

function hacerRegistro(evt) {
    evt.preventDefault();
    
    let pwd = evt.currentTarget.pwd.value,
        pwd2 = evt.currentTarget.pwd2.value,
        foto = evt.currentTarget.foto.value;
    if(foto != ""){
        hayFoto=true;
    }
    if(!hayFoto){
        let html = '';
        html += `<p style="color: red; font-weight: bold;">FOTO NECESARIA</p>`;
        document.querySelector('#error').innerHTML = html;
    }
    else{
        let xhr = new XMLHttpRequest(),
        url = 'api/usuarios/registro',
        fd = new FormData(evt.currentTarget);
        xhr.open('POST', url, true);
        xhr.responseType = 'json';
        xhr.onload = function(){
            let respuesta = xhr.response,
                html = '';
            console.log(respuesta);

            if (respuesta != null) {
                if(respuesta.RESULTADO == "ERROR" || foto == "") {
                    if(pwd != pwd2) {
                        html += `<p style="color: red; font-weight: bold;">LAS CONTRASEÑAS NO COINCIDEN</p>`;
                        document.querySelector('#error').innerHTML = html;
                    }else {
                        html += `<p style="color: red; font-weight: bold;">FOTO NECESARIA</p>`;
                        document.querySelector('#error').innerHTML = html;
                    }
                } 
                else {
                    var save = document.querySelector('#formulario');
                    sessionStorage.setItem('login', save.login.value);
                    sessionStorage.setItem('token', respuesta.token);
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
    
}

function mostrarFoto(inpFile){
    const maxSize = 300 * 1024;
    let foto = inpFile.files[0];
    let html = '';

    if (foto && foto.size > maxSize) {
        html += `<p style="color: red; font-weight: bold;">FOTO NO VALIDA</p>`;
        document.querySelector('#error').innerHTML = html;
        inpFile.value= '';
    }
    else if(foto && foto.size < maxSize){
        document.querySelector('#imgFoto').src = URL.createObjectURL(foto);
        console.log('Imagen introducida correctamente');
    }
}

function restaurarFoto(){
    document.querySelector('#imgFoto').src = 'imagenes/vacia.png'
}

function comprobarLogin(login) {
    fetch(`api/usuarios/${login}`)
        .then(response => response.json())
        .then(data => {
            if (data.DISPONIBLE === false) {
                document.querySelector("#errorLogin").innerHTML = "El usuario ya existe.";
                document.querySelector("#formulario input[type=submit]").disabled = true;
            } else {
                document.querySelector("#errorLogin").innerHTML = "";
                document.querySelector("#formulario input[type=submit]").disabled = false;
            }
        })
        .catch(error => {
            console.error("Error al comprobar el login: ", error);
        });
}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("login").addEventListener("blur", function() {
        const login = this.value;
        if (login) {
            comprobarLogin(login);
        } else {
            document.querySelector("#errorLogin").innerHTML = "";
        }
    });
});
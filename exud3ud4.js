const URL_SERVER='http://54.175.234.31:3000/';

document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('btnUsuarioNuevo').addEventListener('click', mostrarRegistro);
    document.getElementById('nombreLector').addEventListener('blur',validarNombre);
    document.getElementById('apellidosLector').addEventListener('blur',validarApellidos);
    document.getElementById('nombreUsuario').addEventListener('blur',validarUsuario);
    document.getElementById('nombreUsuario').addEventListener('focus',sugerirUsuario);
    document.getElementById('password').addEventListener('blur',validarContraseña);
    document.getElementById('repetirPassword').addEventListener('blur',validarContraseñaRepetida);
    // document.getElementById('email').addEventListener('blur',validarEmail);
    // document.getElementById('condiciones').addEventListener('blur',validarCondiciones);
    document.getElementById('btnRegistrarUsuario').addEventListener('click',validarFormulario);
    document.getElementById('btnIniciarSesion').addEventListener('click',login);
})



function mostrarRegistro(e){
    const formulario = document.getElementById('datosLector');
    if(formulario.classList.contains('oculto')){
        formulario.classList.remove('oculto');
    } else {
        formulario.classList.add('oculto');
    }
}

function validarNombre(e){
    const input = document.getElementById('nombreLector');
    const span = document.getElementById('errorNombre');


    if(input.value.length === 0){
        span.innerText='Campo obligatorio';
        return false;
    } else {
        span.innerText='';
        input.value = transformarNombre(input.value);
        return true;
    
    }
}

function transformarNombre(nombre){
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

function validarApellidos(e){
    const input = document.getElementById('apellidosLector');
    const span = document.getElementById('errorApellidos');

    if(input.value.length<3){
        span.innerText='Longitud mínima de 3';
        return false;
    } else {
        span.innerText='';
        input.value = transformarApellidos(input.value);
        return true;
    }
}

function transformarApellidos(apellidos){
    return apellidos.split(' ').map((apellido)=> transformarNombre(apellido)).join(' ');
}

function validarUsuario(e){
    const input = document.getElementById('nombreUsuario');
    const span = document.getElementById('errorNombreUsuario');


    if(input.value.length===0){
        span.innerText='Campo obligatorio';
        return false;
    } else {
        span.innerText='';
        return true;
    }
}

function sugerirUsuario(e){
    const nombre = document.getElementById('nombreLector').value;
    const apellidos = document.getElementById('apellidosLector').value;

    const input = document.getElementById('nombreUsuario');

    input.placeholder = nombre.charAt(0).toLowerCase()+(apellidos.split(' '))[0].toLowerCase();
}

function validarContraseña(e){
    const input = document.getElementById('password');
    const span = document.getElementById('errorPassword');

    const patron = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ ;

    if(!patron.test(input.value)){
        span.innerText='Contraseña no segura';
        return false;
    } else {
        span.innerText='';
        return true;
    }
}


function validarContraseñaRepetida(e){
    const contraseña = document.getElementById('password').value;
    const contraseña2 = document.getElementById('repetirPassword').value;
    const span = document.getElementById('errorRepetirPassword');

    if(contraseña !== contraseña2){
        span.innerText='Las contraseñas no coinciden';
        return false;
    } else {
        span.innerText='';
        return true;
    }

}

function validarEmail(e){
    const input = document.getElementById('email');
    const novedades = document.getElementById('news');
    const span = document.getElementById('errorEmail');
    const patron = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    if (novedades.checked) {
      if (input.value === 0) {
        span.innerText = "Campo obligatorio";
        return false;
      } else if (!patron.test(input.value)) {
        span.innerText = "E-mail inválido";
        return false;
      } else {
        span.innerText = "";
        return true;
      }
    } else {
        return true;
    }

}

function validarCondiciones(e){
    if(document.getElementById('condiciones').checked){
        document.getElementById('errorCondiciones').innerText='';
        return true;
    } else {
        document.getElementById('errorCondiciones').innerText='Debe aceptar las condiciones';
        return false;
    }
}

function validarFormulario(e){
    const span = document.getElementById('errorRegistro');
    e.preventDefault();

    if(!validarNombre(e)){
        span.innerText='Revisar nombre';
        return false;
    } else if(!validarApellidos(e)){
        span.innerText='Revisar apellido';
        return false;
    } else if(!validarUsuario(e)){
        span.innerText='Revisar usuario';
        return false;
    } else if(!validarContraseña(e)){
        span.innerText='Revisar Contraseña';
        return false;
    } else if(!validarContraseñaRepetida(e)){
        span.innerText='Revisar contraseña';
        return false;
    } else if(!validarEmail(e)){
        span.innerText='Revisar E-mail';
        return false;
    } else if(!validarCondiciones(e)){
        span.innerText='Revisar Condiciones';
        return false;
    } else {
        span.innerText='';
        postUsuario();
        rellenarLogin();
        limpiarForm();
        mostrarRegistro();
    }
}

function limpiarForm(){
    document.getElementById('registroForm').reset();
    const input = document.getElementById('nombreUsuario');
    input.placeholder='';
}




async function postUsuario(){
    const usuario = {
        nombre: document.getElementById('nombreLector').value,
        apellidos: document.getElementById('apellidosLector').value,
        usuario: document.getElementById('nombreUsuario').value,
        password: document.getElementById('repetirPassword').value,
        email: document.getElementById('email').value,
        news : document.getElementById('news').checked
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(usuario)
    }
    
    try {
        let response = await fetch(URL_SERVER+'usuarios',options);
        if(response.ok){
            try {
                let data = response.json();
                console.log(data);
            } catch (error) {
                console.error('error de parseo');
            }
        } else {
            console.error('error código: ', response.status)
        }
    } catch (error) {
        console.error('error de petición');
    }
}


function rellenarLogin(){
    const usuario = document.getElementById('nombreUsuario').value;
    const contraseña = document.getElementById('repetirPassword').value;

    document.getElementById('username').value = usuario;
    document.getElementById('contraseña').value = contraseña;
}


// async function logIn(e) {
//     const username = document.getElementById("username").value;
//     const contraseña = document.getElementById("contraseña").value;
//     const span = document.getElementById("mensajesLogin");

//     let response = await fetch(
//         URL_SERVER + `usuarios?usuario=${username}&&password=${contraseña}`
//     );
//     if (response.ok) {
//         let usuario = response.json();
//         if (usuario.length > 0) {
//             console.log(usuario[0]["password"]);
//             if (contraseña === usuario[0]["password"]) {
//                 alert("login correcto");
//             } else {
//                 span.innerText = "datos incorrectos";
//             }
//         }
//     } else {
//         span.innerText = "datos incorrectos";
//     }
// }

async function login(){
    const username = document.getElementById('username').value;
    const contraseña = document.getElementById('contraseña').value;
    const span = document.getElementById("mensajesLogin");

    let response = await fetch(URL_SERVER+`usuarios?usuario=${username}&&password=${contraseña}`);
    if(response.ok){
        let usuario = await response.json();
        if(usuario.length > 0){
            console.log(usuario[0]["usuario"],usuario[0]["password"]);
            if(contraseña ===  usuario[0]["password"]){
                guardarSesion(usuario);
                ocultarLogin();
                span.innerHTML=`<h2>Bienvenido, ${username}</h2>`;
                obtenerLibrosDisponiblesprueba();
            } else {
                span.innerText='datos incorrectos';
            }
        } else {
            span.innerText='datos incorrectos';
        }
    } else {
        console.error('código de error: ', response.status);
    }
}


function ocultarLogin(){
    document.getElementById('datosLogin').classList.add('oculto');
    document.getElementById('btnIniciarSesion').classList.add('oculto');
    document.getElementById('btnUsuarioNuevo').classList.add('oculto');
    document.getElementById('btnCerrarSesion').classList.remove('oculto');
}


function guardarSesion(usuario){
    sessionStorage.setItem('sesionIniciada', JSON.stringify(usuario));
}


async function obtenerLibrosDisponibles() {
    const listalibros = document.getElementById('librosDisponibles');
    try {
        let response = await fetch(URL_SERVER + `libros?id_prestamo=0`);
        if (response.ok) {
            let libros = response.json();
            console.log(libros[0]["titulo"]);
        } else {
            console.error('código de error:', response.status)
        }
    } catch (error) {
        console.error('error de peticion');
    }

}

async function obtenerLibrosDisponiblesprueba(e){
    const lista = document.getElementById('librosDisponibles');
    const ols = document.createElement('ol');
    
    let response = await fetch(URL_SERVER+`libros?id_prestamo=0`);
    if(response.ok){
        let libros = await response.json();
        if(libros.length > 0){
            console.log(libros[0]["titulo"]);
            libros.forEach(libro => {
                lista.append(`<ol>${libro["titulo"]}</ol>`);
            });
        } else{
            console.error('libros no encontrados')
        }
    } else {
        console.error('código de error: ', response.status);
    }
}




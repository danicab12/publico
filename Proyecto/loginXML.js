/* 
JavaScript / XML
web o pagina: ejercicios de XML y JavaScript
autor: Prof. Carlos Boni
fecha: 25 mayo 2021
resumen: lectura y carga en array bidimensional de un XML

sintesis:
la lógica se basa en el uso de tres variables de tipo sessionStorage
usuarioLogueado : si existe, su valor es el nombre de usuario en sesion
usuarioIntentando y claveIntentando: si existen significa que debemos
validarlas para crear usuarioLogueado si corresponde
*/

// variable global de la pagina

// las siguientes variables estarán como sessionStorage
let usrIntentando = "";
let claveIntentando = "";

function controlar(){
	// determinamos en qué estado se carga la página:
	// 1 - sin usuario
	// 2 - usuario intentando ingresar
	// 3 - usuario con sesion iniciada
	$("#ingresar").show();
	$("#desconectar").hide();
	for(let timer=1;timer<5000000;timer++);	
			
	if (sessionStorage.getItem("usuarioLogueado")) {
		// estado 3 de nuestro diagrama de estados - con usuario
		// estamos cargando la página teniendo un usuario logueado previamente
		// y con la sesión activa pues no se ha desconectado aún
		// ocultamos formulario de login y mostramos desconectar
		$("#ingresar").hide();
		$("#desconectar").show();	
		
	} else {
		if (sessionStorage.getItem("usuarioIntentando")) {
			// estado 2 de nuestro diagrama de estados - transición
			// estamos recargando luego de que haya un intento de login
			// debemos validar si el usuario existe
			validarXML();
			// tardo un poco en recargar para dar tiempo a AJAX?
			for(let timer=1;timer<5000000;timer++);
			$("#ingresar").hide();
			$("#desconectar").show();	
			
		} else {
			// estado 1 de nuestro diagrama de estados - sin usuario
			// mostramos formulario de login y ocultamos desconectar
			$("#ingresar").show();
			$("#desconectar").hide();
		}
	}
}
	
	function intentar(){
		if (typeof(Storage) !== "undefined") {
		  
		  // oculta la opción de login 
		  $("#ingresar").hide();
		  
		  // Almacena un valor usando el método setItem del objeto localStorage
		  var x=document.forms["miFormulario"]["formUsuario"].value;
		  var y=document.forms["miFormulario"]["formClave"].value;
		  sessionStorage.setItem("usuarioIntentando", x);
		  sessionStorage.setItem("claveIntentando", y);
		  
		  // ya tengo en memoria webStorage lo que puso en el formulario
		  // al recargarse la página podré recordar esta información

		} else {
		  document.getElementById("mensaje").innerHTML = "Este navegador no soporta web storage...";
		}
	}
	
	function validarXML() {
		
		// lee desde aquí.
		usuarioIntentando=sessionStorage.getItem("usuarioIntentando");
		claveIntentando=sessionStorage.getItem("claveIntentando");
		sessionStorage.removeItem("usuarioIntentando");
		sessionStorage.removeItem("claveIntentando");
		
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				miFuncion(this);
			}
		};
		xhr.open("GET", "https://carlosboniniklison.github.io/publico/ejercicios/xml/registrados.xml", true);
		xhr.send();
	}

	function miFuncion(xml) {
	  var i;
	  var usrNom;
	  var usrPsw;
	  var usuario = [];
	  var xmlDoc = xml.responseXML;
	  var x = xmlDoc.getElementsByTagName("usuario");
	  sessionStorage.removeItem("usuarioLogueado");
	  
	  for (i = 0; i <x.length; i++) { 
		// leo las etiquetas que me interesan del objeto
		usrNom = x[i].getElementsByTagName("nombre")[0].childNodes[0].nodeValue;
		usrPsw = x[i].getElementsByTagName("clave")[0].childNodes[0].nodeValue;
		// actualizo la tabla de visualización
		if ((usrNom == usuarioIntentando) && (usrPsw == claveIntentando)) {
		  // destaca el usuario que coincide con lo que buscamos
		  sessionStorage.setItem("usuarioLogueado",usuarioIntentando);
		}
	  }
	}

	function desconectar(){
		sessionStorage.removeItem("usuarioLogueado");
		sessionStorage.removeItem("usuarioIntentando");
		sessionStorage.removeItem("claveIntentando");
		window.location.reload();
	}
	

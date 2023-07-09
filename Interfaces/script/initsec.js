 // Obtén el valor del parámetro "error" de la URL
 var mensaje_error = localStorage.getItem('login_status');
 localStorage.removeItem('login_status');
 if(mensaje_error){
  mostrarError(mensaje_error);
 }
 // Función para mostrar el div de error si el parámetro de error está presente
 function mostrarError(error) {
   switch (error) {
     case "0":
       var errorDiv = document.getElementById("errorDiv");
       errorDiv.style.display = "block";
       break;
     case "1":
       var errorMSG = document.getElementById("errorMSG");
       errorMSG.innerHTML = "Usuario no encontrado.\n Inténtelo otra vez";
       var errorDiv = document.getElementById("errorDiv");
       errorDiv.style.display = "block";
       break;
     case "2":
       var errorMSG = document.getElementById("errorMSG");
       errorMSG.innerHTML = "Usuario no Válido.\n Inténtelo otra vez";
       var errorDiv = document.getElementById("errorDiv");
       errorDiv.style.display = "block";
       break;
      case "3":
        var errorMSG = document.getElementById("errorMSG");
        errorMSG.innerHTML = "El usuario no tiene permisos para acceder a esta página.\n Inténtelo otra vez";
        var errorDiv = document.getElementById("errorDiv");
        errorDiv.style.display = "block";
        break;
        case "4":
          var errorMSG = document.getElementById("errorMSG");
          errorMSG.innerHTML = "Debe iniciar sesión para continuar.";
          var errorDiv = document.getElementById("errorDiv");
          errorDiv.style.display = "block";
          break;
     default:
       break;
   }
  
 }
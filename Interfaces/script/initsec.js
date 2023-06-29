 // Obtén el valor del parámetro "error" de la URL
 const urlParams = new URLSearchParams(window.location.search);
 const error = urlParams.get('error');
 mostrarError(error);
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
     default:
       break;
   }
  
 }
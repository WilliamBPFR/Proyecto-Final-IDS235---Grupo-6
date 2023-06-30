$(document).ready(function() {
    // Aquí va el código jQuery que deseas ejecutar al cargar la página
    console.log('La página se ha cargado completamente');
    var carrera = localStorage.getItem('carreras');
    var rol = localStorage.getItem('roles');
    var estado = localStorage.getItem('estados');
    if(carrera){
      var carreras = JSON.parse(carrera);
      var select = $("#cb_carrera");
      console.log(select);
      carreras.forEach(function(carr) {
        var value = carr.id_carrera;
        var text = carr.nombre_carrera;
        var option = $('<option></option>').val(value).text(text);
        select.append(option);
      });
  }
      if(rol){
        var rols = JSON.parse(rol);
        var select = $("#cb_rol");
        console.log(select);
        rols.forEach(function(role) {
          var value = role.id_rol;
          var text = role.nombre_rol;
          var option = $('<option></option>').val(value).text(text);
          select.append(option);
        });
    }
    if(estado){
        var est = JSON.parse(estado);
        var select = $("#cb_estado");
        console.log(select);
        est.forEach(function(estd) {
          var value = estd.id_estado;
          var text = estd.nombre_estado;
          var option = $('<option></option>').val(value).text(text);
          select.append(option);
        });
    }
    // Código jQuery adicional...
  });
  
  $(document).ready(function() {
    const form = $('#component-48');
    const errorDiv = $('#div_mensaje_error');
    const labelerror = $('#label_error');
  
    form.on('submit', function(event) {
      event.preventDefault(); // Evitar el envío del formulario
  
      // Obtener los valores del formulario
      const formData = form.serializeArray();
      const data = {};
  
      $.each(formData, function(index, field) {
        data[field.name] = field.value;
      });
  
      // Enviar los datos al backend utilizando AJAX
      $.ajax({
        url: '/crear-usuario',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(response) {
          console.log(response);
          window.location.href = '/nav_admin?id=2';
        },
        error: function(xhr, status, error) {
          var resp = parseInt(xhr.responseText);
          switch (resp) {
            case 0:
              labelerror.text("Matrícula o ID ya Existente");
              errorDiv.show();
              break;
            case 1:
              labelerror.text("Error al crear el usuario");
              errorDiv.show();
              break;
            case 2:
              labelerror.text("Matrícula o ID Inválido");
              errorDiv.show();
              break;
            case 3:
              labelerror.text("Email Inválido");
              errorDiv.show();
              break;
            default:
              console.log('Error desconocido')
              break;
          }
          setTimeout(function() {
            errorDiv.fadeOut();
          }, 5000);
        }
      });
    });
    $("#btn_Cancelar").click(function() {
      window.location.href = '/nav_admin?id=2';
    });
  });
  
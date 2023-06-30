$(document).ready(function() {
    // Aquí va el código jQuery que deseas ejecutar al cargar la página
    console.log('La página se ha cargado completamente');
    var asignatura = localStorage.getItem('asignaturas');
    var docente = localStorage.getItem('docentes');
    var modalidad = localStorage.getItem('modalidades')
    
    if(asignatura){
      var asignaturas = JSON.parse(asignatura);
      var select = $("#sel_asignatura");
      console.log(select);
      asignaturas.forEach(function(asig) {
        var value = asig.id_asignatura;
        var text = asig.nombre_asignatura;
        var option = $('<option></option>').val(value).text(text);
        select.append(option);
      });
  }
      if(docente){
        var roles = JSON.parse(docente);
        var select = $("#sel_docente");
        console.log(select);
        docentes.forEach(function(docente) {
          var value = docente.id_rol;
          var text = docente.nombre_rol;
          var option = $('<option></option>').val(value).text(text);
          select.append(option);
        });
    }

    if(modalidad){
        var modalidades = JSON.parse(modalidad);
        var select = $("#sel_modalidad");
        console.log(select);
        modalidades.forEach(function(mod) {
          var value = mod.id_modalidad;
          var text = mod.nombre_modalidad;
          var option = $('<option></option>').val(value).text(text);
          select.append(option);
        });
    }
    // Código jQuery adicional...
  });
  
  
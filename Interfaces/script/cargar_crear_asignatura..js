$(document).ready(function() {
  // Aquí va el código jQuery que deseas ejecutar al cargar la página
  console.log('La página se ha cargado completamente');
  var carrera = localStorage.getItem('carreras');
  var tipo_asignatura = localStorage.getItem('tipoasignatura');
  if(carrera){
    var carreras = JSON.parse(carrera);
    var select = $("#sel_Carrera_Pertenence");
    console.log(select);
    carreras.forEach(function(carr) {
      var value = carr.id_carrera;
      var text = carr.nombre_carrera;
      var option = $('<option></option>').val(value).text(text);
      select.append(option);
    });
}
    if(tipo_asignatura){
      var tipos = JSON.parse(tipo_asignatura);
      var select = $("#sel_Asignatura_Tipo");
      console.log(select);
      tipos.forEach(function(tipo) {
        var value = tipo.id_tipo_asignatura;
        var text = tipo.nombre_tipo_asignatura;
        var option = $('<option></option>').val(value).text(text);
        select.append(option);
      });
  }
  $("#bt_Cancelar").click(function() {
    window.location.href = '/nav_admin?id=1';
  });
  // Código jQuery adicional...
});


$(document).ready(function(){
    var asignaturas = [];
    $.ajax({
        url: '/cargar_secciones_retiro',
        method: 'GET',
        dataType: 'json',
        success: function(data) {  
            console.log('toy aqui');
            console.log(data);
            if(data.asig_actualizadas.length > 0){
                var i = 0;
            data.asig_actualizadas.forEach(element => {
                var contenedor = $("#rectangle-parent")
                // Crear el elemento button con la clase y estilo especificados
                var button = $('<button>').addClass('clase_btn_general').attr('id', 'btn_asignatura');
        
                // Crear los elementos div y agregar las clases correspondientes
                var divChild = $('<div>').addClass('component-63-child');
                divChild.attr('value', element.id_registro);
                var divLabel = $('<div>').addClass('clase_label_div').text(element.Asignatura.nombre_asignacion);
        
                // Crear el elemento img y establecer los atributos src y alt
                var imgIcon = $('<img>').addClass('image-19-icon').attr('src', './../../public/image-18@2x.png').attr('alt', '');
                
                button.css('top', i*16+'%');
                i++;
                if(element.calificacion_num == null){
                    button.click(function(){
                        $('#label_asig').attr('value',element.id_registro);
                        $('#label_asig').text(element.Asignatura.cod_asignatura + ' - ' + element.Asignatura.nombre_asignacion + ' - Sec ' + element.Seccion.num_seccion);
                        $('#div_asig_ret').css('display', 'block');
                        divChild.css('background-color', 'rgb(238, 229, 106);');
                    });
                }else if(element.calificacion_num>=0)
                {
                    divChild.css('background-color', '#8af3ea');
                }else{
                    button.click(function(){
                        alert("La asignatura ya ha sido retirada");
                    });
                    divChild.css('background-color', 'rgb(241, 164, 164);#FF0000');
                }
                // Adjuntar los elementos al botón
                button.append(divChild, divLabel, imgIcon);
                // Adjuntar el botón a un contenedor existente en el DOM
                contenedor.append(button);
            }); 
        }else{
            var contenedor = $("#rectangle-parent")
            // Crear el elemento button con la clase y estilo especificados
            var button = $('<button>').addClass('clase_btn_general').attr('id', 'btn_asignatura');
    
            // Crear los elementos div y agregar las clases correspondientes
            var divChild = $('<div>').addClass('component-63-child');
            var divLabel = $('<div>').addClass('clase_label_div').text('Sin asignatura por Retirar');
    
            // Crear el elemento img y establecer los atributos src y alt
            var imgIcon = $('<img>').addClass('image-19-icon').attr('src', './../../public/image-18@2x.png').attr('alt', '');
            button.css('top', i*16+'%');
            // Adjuntar los elementos al botón
            button.append(divChild, divLabel, imgIcon);
            // Adjuntar el botón a un contenedor existente en el DOM
            contenedor.append(button);
        }
        },
        error: function(error) {
            console.log(error);
        }
    });
    $('#boton_cancelar').click(function(){
        window.location.href = '/retirar-asignatura.html';
    });
    
        $('#boton_confirmar').click(function(){
            if($('#label_asig').attr('value') != undefined ){
                if($('#password').val() != ''){
                $.ajax({
                    url: '/retirar_asignatura',
                    method: 'GET',
                    data:{
                        id_registro: $('#label_asig').attr('value'),
                        contrasena: $('#password').val()
                    },
                    contentType: 'application/json',
                    success: function(data) {  
                        console.log('toy aqui');
                        alert("Asignatura retirada con exito");
                        $('.clase_btn_general').find('.component-63-child').each(function(){
                            if($(this).attr('value') == $('#label_asig').attr('value')){
                                $(this).css('background-color', 'rgb(241, 164, 164);#FF0000');
                            }
                        });
                    },
                    error: function(xhr,error) {
                        var resp = parseInt(xhr.responseText);
                        switch(resp){
                            case 1:
                                alert('No se puede retirar la asignatura, pues la contraseña no coincide con la guardada');
                                break;
                            case 0:
                                alert('Ha ocurrido un error al retirar la asignatura');
                                break;
                            }
                        console.log(error);
                    }
                });
                }else{
                    alert('Ingrese la contraseña para retirar la asignatura');
                }
            }else{
                alert('Seleccione una asigmatura a retirar');
            }
        });
    $('.clase_btn_general').hover(
        function() {
          $(this).find('.component-63-child').addClass('hovered');
        },
        function() {
          $(this).find('.component-63-child').removeClass('hovered');
        }
      );
});
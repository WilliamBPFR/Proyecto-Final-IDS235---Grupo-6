$(document).ready(function(){
	var estado = false;
	var div_arriba = $('[name="div_arriba"]');
	$('#btn-toggle').on('click',function(){
		$('.seccionToggle').slideToggle();
		if (estado == true) {
			// $(this).text("⬇️");
			$('body').css({
				"overflow": "auto"
			});
			estado = false;
		} else {
			// $(this).text("⬆️");
			$('body').css({
				"overflow": "hidden"
			});
			estado = true;
		}
	});
});

/*------------------ INICIO DE SESION --------------------*/

var iniciarSesion = true;
$('button#btnRegistrarse').css('background-color', '#42a5f5');
//$('input#apellido, input#nombre, input#repeatPassword').css('display', 'none');
if ($('input#nombre').attr('class') != "desplegado"){
	$('button#btnIniciar').css('background-color', '#1976d2');
	$('button#btnRegistrarse').css('background-color', '#42a5f5');
	$('input#apellido, input#nombre, input#repeatPassword').css('display', 'none');
}else{
	$('button#btnIniciar').css('background-color', '#42a5f5');
	$('button#btnRegistrarse').css('background-color', '#1976d2');
	iniciarSesion = false;
}

$('button#btnRegistrarse').click(function () {
	iniciarSesion = false;
	$('form').attr('action', '/register');
	$('button#btnIniciar').css('background-color', '#42a5f5');
	$('button#btnRegistrarse').css('background-color', '#1976d2');
	$('input#apellido, input#nombre, input#repeatPassword').slideDown();
	//$('header').slideUp();
});
$('button#btnIniciar').click(function () {
	iniciarSesion = true;
	$('form').attr('action', '/login');
	$('button#btnIniciar').css('background-color', '#1976d2');
	$('button#btnRegistrarse').css('background-color', '#42a5f5');
	$('input#apellido, input#nombre, input#repeatPassword').slideUp();
	//$('header').slideDown();
});

$('div.mensajes div').click(function(){
	$(this).slideUp();
});

/*------------------ PANTALLA PRINCIPAL --------------------*/

$('span#addFriend, button#addFriend').click(function(){
	$('div.buscar').css('display','flex').animate({
		backgroundColor:"rgba(30,136,229,0.9)",
		paddingTop:"6em"
	}, 500);
});
$('div.buscar').click(function(){
	$(this).animate({
		backgroundColor:"rgba(30,136,229,0.9)",
		paddingTop:"8em"
	}, 500, function(){
		$(this).css('display', 'none');
	});
});

/*------------------ EXPORTS --------------------*/

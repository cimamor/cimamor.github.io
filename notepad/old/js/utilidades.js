/* ============ UTILS ============= */
function logger(mensaje){
	alert(mensaje);
}

function getGUID(){ 
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); }); 
}

/* ============ CREACIÓN HTML =============== */
function insertNewNoteHTML(guid, titulo, color, mensaje)
{
	$('#seleccionNotaPrincipal').append('<div id="nota_'+ guid +'" class="notaPrincipal" style="background-color:'+ color +';"><section name="title" class="title"><input id="closeNotaId_'+ guid +'" type="image" src="img/icono_close.png" class="inputCloseNota"/><h1>'+ titulo +'</h1></section><section name="message" class="message"><p>'+ mensaje +'</p></section><input type="image" src="img/icono_delete.png" class="inputDeleteNota" id="deleteNotaId_'+ guid +'"/></div>');

	$('#closeNotaId_'+ guid +'').on("click", function(){
		accionCerrarNota(guid);
	});
	$('#deleteNotaId_'+ guid +'').on("click", function(){
		accionEliminarNota(guid);
	});
}

function insertNewItemListNoteHTML(guid, titulo, color)
{
	$('#listadoNotas').append('<div class="nota" id="'+ guid +'" style="background-color:'+ color +';"><h1>'+ titulo +'</h1></div>');
	$('#'+ guid +'').on("click", function(){
		accionNota(guid);
	});
}


function insertFormularioHTML()
{
	$('#seleccionNotaFormulario').append('<div id="notaFormulario"><section name="formulario" class="formularioNota"><form id="formularioNotaId" method="post" onsubmit="return accionSubmitFormulario(this)"><label class="labelForm">Nueva Nota</label><input id="titleNote" type="text" maxlength="25" class="inputTitle" value="" placeholder="Título de la nota" pattern="^([a-zA-Z0-9 _%+-\¡!\¿\?ªº,.:áéíóúÁÉÍÓÚÑñ\(\))]){1,25}$" required></input><textArea id="messageNote" class="textAreaMessage" placeholder="Mensaje de la nota" pattern="^([a-zA-Z0-9 _%+-\¡!\¿\?ªº,.:áéíóúÁÉÍÓÚÑñ\(\))])*$" required></textArea><input id="colorNote" type="color" class="colorNota" value="#d698f3"> Color de la Nota</input><input type="image" src="img/icono_save.png" class="inputSaveNota" id="saveNotaId" onclick=""/></form>');
}

function removeAllItemListNoteHTML()
{
	var myNode = document.getElementById('listadoNotas');
	while (myNode.firstChild){
		myNode.removeChild(myNode.firstChild);
	}
}


/* =================== NOTA VISIBLE ==================== */
function recuperarNotaVisible()
{
	var notaVisible = sessionStorage.getItem('notaVisible');
	return notaVisible;
}

function almacenarNotaVisible(id)
{
	sessionStorage.setItem('notaVisible', id);
}


/* ==================== ANIMACIONES ====================== */
function recuperarListadoDeNotas()
{
	//localStorage.clear();
	var listadoNotas = JSON.parse(localStorage.getItem('notas'));
	if(listadoNotas == null){ return;}

	var len = listadoNotas.length;
	var notaSeleccionada;
	for(var i=0; i< len; i++){
		var notaIndex = listadoNotas[i];
		var titulo = notaIndex.titulo;
		var guid = notaIndex.guid;

		var notaStorage = JSON.parse(localStorage.getItem(guid));
		if(notaStorage == null){ continue;}

		var color = notaStorage.color;

		insertNewItemListNoteHTML(guid, titulo, color);
		insertNewNoteHTML(guid, notaStorage.titulo, notaStorage.color, notaStorage.mensaje);
	}
}


function almacenarNota(formulario)
{

	//localStorage.clear();
	//Recogemos los datos a almacenar
	var titulo = formulario.titleNote.value;
	var descripcion = formulario.messageNote.value;
	var color = formulario.colorNote.value;
	var indice = getGUID();
	
	//Recogemos todas las notas que tengamos almacenadas
	var notaNuevaIndice = new indiceNota(titulo, indice);
	var notaNueva = new nota(titulo, descripcion, color, indice);
	
	//Recogemos de almacenamiento el indice de notas
	var listadoNotas = JSON.parse(localStorage.getItem('notas'));
	//Creamos el nuevo array
	var nuevaLista = null;
	if(listadoNotas == null){
		nuevaLista = new Array();
		nuevaLista.push(notaNuevaIndice);
	}
	else{
		listadoNotas.push(notaNuevaIndice);
		nuevaLista = listadoNotas;
	}

	//Almacenamos la nueva nota dentro del índice de notas
	var nuevaListaStr = JSON.stringify(nuevaLista);
	localStorage.setItem('notas',nuevaListaStr);
	
	//Almacenamos la nota
	localStorage.setItem(indice, JSON.stringify(notaNueva));
	
	//Actualizamos el campo visible
	insertNewItemListNoteHTML(indice, titulo, color);
	insertNewNoteHTML(indice, titulo, color, descripcion);
	sessionStorage.clear();
	
	//Devolvemos el nuevo indice para generar una nueva nota
	return indice;
}


function recogerNota(identificador)
{
	var notaJson = localStorage.getItem(identificador);
	if(notaJson == null) return null;
	
	var nota = JSON.parse(notaJson);
	
	insertNewNoteHTML(guid, titulo, color, mensaje);
	return nota;
}


function findAndRemove(array, property, value) {

	var len = array.length;
	var encontrado = false;
	var i = 0;
	var objeto;

	while ((i < len) && (!encontrado)){
		objeto = array[i];
		if(objeto[property] == value){
			array.splice(i, 1);
			encontrado = true;
		}
		i++;
	}
	return array;
}


function eliminarNota(guid)
{

	//Recogemos de almacenamiento el indice de notas
	var listadoNotas = JSON.parse(localStorage.getItem('notas'));
	var nuevoArray = findAndRemove(listadoNotas, 'guid', guid);

	//Almacenamos la nueva nota dentro del índice de notas
	var nuevaListaStr = JSON.stringify(nuevoArray);
	localStorage.setItem('notas',nuevaListaStr);

	//Eliminamos la nota
	localStorage.removeItem(guid);

	//Eliminamos la nota
	$('#'+ guid +'').remove();
}


/* ================ ACCIONES ================ */
/* Cargamos la página y por ente lo valores por defecto */
function accionLoad(){
	
	//localStorage.clear();
	//Insertamos las notas de la parte de la izquierda
	recuperarListadoDeNotas();
		
	//Por defecto colocamos la nota del formulario
	//Dibujamos el formulario
	insertFormularioHTML();
	$("#notaFormulario").removeClass("animacionQuitarNota");
	$("#notaFormulario").addClass("animacionPonerNota");
	//Almacenamos la nota visible
	almacenarNotaVisible('notaFormulario');
}

/* Acción de almacenar una nueva nota */
function accionSubmitFormulario(formulario)
{
	almacenarNota(formulario);
	$("#notaFormulario").removeClass("animacionPonerNota");
	$("#notaFormulario").addClass("animacionQuitarNota");

	//Borramos los valores del formulario
	formulario.reset();

	return false;
}

/* Acción para cerrar la nota */
function accionCerrarNota(id)
{
	//Animamos la nota para quitarla
	$('#nota_'+ id +'').removeClass("animacionPonerNota");
	$('#nota_'+ id +'').addClass("animacionQuitarNota");
	
	
	//Reseteamos la nota visible
	sessionStorage.clear();
}

function accionEliminarNota(id){
	//Eliminamos la nota del Storage
	eliminarNota(id);

	//Animamos la nota para quitarla
	$('#nota_'+ id +'').removeClass("animacionPonerNota");
	$('#nota_'+ id +'').addClass("animacionQuitarNota");


	//Reseteamos la nota visible
	sessionStorage.clear();
}

function accionNuevaNota(){

	var notaVisible = recuperarNotaVisible();
	if (notaVisible == 'notaFormulario'){
		return;
	}
	else if (notaVisible != null){
		//Cerramos la nota visible
		$('#nota_'+ notaVisible +'').removeClass("animacionPonerNota");
		$('#nota_'+ notaVisible +'').addClass("animacionQuitarNota");
		
	}

	//Dibujamos el formulario
	$("#notaFormulario").removeClass("animacionQuitarNota");
	$("#notaFormulario").addClass("animacionPonerNota");
	
	//Almacenamos la nota visible
	almacenarNotaVisible('notaFormulario');
}

/* Función encargada de evaluar el resultado de hacer click para 
crear una nueva nota */
function accionNota(id)
{
	//Recogemos la variable de Session para comprobar cual esta vigente
	var notaVisible = recuperarNotaVisible();
	//var notaSeleccionada = JSON.parse(localStorage.getItem(id));

	//Se encuentra el formulario visible
	if(notaVisible == 'notaFormulario'){

		//Cerrar el formulario
		$("#notaFormulario").removeClass("animacionPonerNota");
		$("#notaFormulario").addClass("animacionQuitarNota");
	}
	//Hay una nota visible
	else if(notaVisible != null){

		//Cerramos la nota visible
		$('#nota_'+ notaVisible +'').removeClass("animacionPonerNota");
		$('#nota_'+ notaVisible +'').addClass("animacionQuitarNota");
	}
	
	$('#nota_'+ id +'').removeClass("animacionQuitarNota");
	$('#nota_'+ id +'').addClass("animacionPonerNota");
	//Almacenamos la nota visible
	almacenarNotaVisible(id);
}
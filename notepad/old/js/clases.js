function nota (pTitulo, pMensaje, pColor, pGuid)
{
	this.titulo = pTitulo;
	this.mensaje = pMensaje;
	this.guid = pGuid;
	this.color = pColor;
	
	this.getTitulo = function(){ return this.titulo;};
	this.setTitulo = function(pTitulo){ this.titulo = pTitulo;};
	
	this.getMensaje = function(){ return this.mensaje;};
	this.setMensaje = function(pMensaje){ this.mensaje = pMensaje;};
	
	this.getGuid = function (){ return this.guid;};
	this.guid = function(pGuid){ this.guid = pGuid;};

	this.getColor = function(){return this.color;};
	this.setColor = function(pColor){this.color = pColor;};
}


function indiceNota (pTitulo, pGuid)
{
	this.titulo = pTitulo;
	this.guid = pGuid;
	
	this.getTitulo = function(){ return this.titulo;};
	this.setTitulo = function(pTitulo){ this.titulo = pTitulo;};
	
	this.getGuid = function (){ return this.guid;};
	this.setGuid = function(pGuid){ this.guid = pGuid;};	
}
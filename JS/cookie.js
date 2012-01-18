/**
var cookie = new Cookie();

cookie.set(value);
cookie.get();
cookie.clear();

*/

(function( window ) {

var Cookie = function(){
	
	
	this.set = function(name, value, timestamp)
	{
		document.cookie = name +' =' + value + (value && timestamp == 0 ? '' : '; expires='+ timestamp);
	},

	this.get = function(name)
	{
		var cookie = document.cookie.match('/' + name + '="[^;]*/');
		
		return cookie;
	},

	this.clear = function()
	{
		Cookie.setCookie('', 0);
	},
	
	this.echo = function(){
		console.log(document.cookie);
	}
};

	window.Cookie = Cookie;

})(window);

var cookie = new Cookie();

var t = new Date();
t.setSeconds(t.getSeconds() + 10);

cookie.set("coucou", "coucou", t.toUTCString());
cookie.set("hello", "hello", t.toUTCString());
value = cookie.get("coucou");
console.log(value);
cookie.echo();
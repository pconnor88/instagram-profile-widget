$(window).load(function() {
	
	var sampler = $("#demo-image").ImageColor();	
	$("#color-swatch").css("background-color", sampler.ImageColor("averageColor"));
});
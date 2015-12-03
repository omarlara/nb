$(document).ready(function(){
	$(".icon").click(function(e){
		$(".icon").next().css("display","none");
		 $(e.currentTarget).next().css("display","inherit");
	});

	$(".cross").click(function(e){
		$(e.currentTarget).parent().css("display","none");
	});

});

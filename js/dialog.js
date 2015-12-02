function opendialog(e)
{
	switch(e.id)
	{
		case 'green':
			var dialog = "#movegreen";
		break;
	}
        var  button = $("body");
        $(dialog).dialog({
            resizable: false,
            height:240,
            width:720,
            modal: true,
            height:440
        });	
}
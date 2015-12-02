

function opendialog(e)
{
	switch(e.id)
	{
		case 'green':
			var dialog = "#existingcustomers";
		break;

		case 'blue':
			var dialog = "#newcustomers";
		break;

		case 'gray':
			var dialog = "#postalcode";
		break;

		case 'yellow':
			var dialog = "#movingout";
		break;
	}

	
        $(dialog).dialog({
        	autoOpen:true,
            resizable: false,
            height:400,
            width:720,
            modal: true,
            height:440
        });
        
        
        
    
	
}
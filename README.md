## ThePIPP
This single page template is the second iteration in me learning bootstrap; using its sass base directly.

#### Preview





#### General File Structure

    /
	index.html <--Main single page template
	port-item.html <--Portfolio item template to allow degrading gracefully on portfolio section
    	Assets/
        	css/ <--Generated css files
            scss/ <--Source Sass files
                    _functions.scss
				            _variables.scss
				            _vendor.scss <--Includes specific thirdparty files
				            _mixins.scss
				            main.scss <--Main Sass file
				            custom/ <--Custom code for theme
				            vendor/ <-- Third party SCSS/CSS Directory(including bootstrap)
            scripts/ <--Javascript files
            fonts/ <--Font files
            ...


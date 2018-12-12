
/**
 * Responsive Full Page Slider
 * @desc - transitions between sections of a single page template
 * @param {0bject} - object containing options to override defaults
 *        -slideSelector    : selector for sections
 *        -navLinksSelector : selector for links that trigger transitions
 *        -minimalSlideWidth: width to disable slide and return to full page template
 *
 *
 * @return {0bject} - standard return of jQuery object created by selector intializer to allow chaining
 * 
**/
(function( $ ) {
    //check if jQuery is available
	if('undefined' === typeof $) {
		if('console' in window){ window.console.info('responsiveFullPageSlider needs jQuery.'); }
		return;
	}
    
    // export of code as jQuery plugin
    $.fn.responsiveFullPageSlider = function( opts ){
        //define default options
        var defaults = {
            slideSelector : '.section',
            navLinksSelector: '.nav-link, .about-btn',
            minimalSlideWidth : 992
        };
        //override defaults with options passed in
        opts = $.extend({}, defaults, opts);
        
        // declare variables in this scope to be available throughout plugin
		var $this = $(this);
        var blocking = false;
        var slideList = $this.children(opts.slideSelector);
        var curSlide = slideList[0];
        
        // OnClick method for links that trigger transitions
        $( opts.navLinksSelector ).click(function() {
            // get target section ID
            var nextSlide = slideList.filter($(this).attr('href'));
            
            //if currentSlide  is the one clicked nothing to be done - return 
            if(curSlide.attr('id') == nextSlide.attr('id')){return;}
            
            // Position next slide behind current and make visible
            nextSlide.css({
                "opacity": 1,
                "display":"block",
                "z-index":0
            });
            
            // Only transition between sections if width of view larger then setting and not currently with in transition
            if ( $(window).width() >= opts.minimalSlideWidth && blocking == false ) {
                //set blocking so no other links take affect until this transition is done
                blocking = true;
                
                // animate left all children elements of current section with '.slide-left' class
                curSlide.find('.slide-left').each(function (index) {       
                    TweenMax.to(
                        $(this), 
                        1, 
                        { 
                            css: { 
                                "margin-left": '-1000px',
                                "opacity": 0
                            }, 
                            ease:Expo.easeOut, 
                        }
                    ); 
                });  
                // animate right all children elements of current section with '.slide-right' class                          
                curSlide.find('.slide-right').each(function (index) {                                
                    TweenMax.to(
                        $(this), 
                        0.5, 
                        { 
                            css: { 
                                 "margin-left": '1000px',
                                 "opacity": 0 
                            }, 
                            ease:Expo.easeOut, 
                            overwrite: 'all',
                            onComplete: function(){ // OnComplete function to execute once previous transition finishes.
                                //Fade out current section to reveal next section
                                TweenMax.to(
                                    curSlide, 
                                    1, 
                                    { 
                                        css: { 
                                           opacity: '0' 
                                        }, 
                                        ease:Expo.easeOut, 
                                        overwrite: 'all' ,
                                        onComplete : function(){ // OnComplete function to execute once previous transition finishes.
                                            //reset all settings to hide current slide
                                            curSlide.css({
                                                "opacity": 0,
                                                "display":"none",
                                                "z-index":0
                                            });                                            
                                            // Slide into frame .slide-left and .slide-right child elements of next slide
                                            nextSlide.css({"z-index":1}).find('.slide-left, .slide-right').each(function (index) {                                
                                                TweenMax.to(
                                                    $(this), 
                                                    0.5, 
                                                    { 
                                                        css: { 
                                                            "margin-left": '0px',
                                                            "opacity": 1 
                                                        }, 
                                                        ease:Expo.easeOut
                                                    }
                                                ); 
                                            });      
                                            // Set current slide to next and stop blocking 
                                            curSlide = nextSlide;
                                            blocking = false;
                                            
                                        }
                                    }
                                ); 
                                
                            }
                        }
                    ); 
                });
            
            }
            else{ // When on smaller screen just slide down/ up between sections
                $("html, body").animate({
                    scrollTop: $($(this).attr("href")).offset().top
                }, 500);
            }
        });
        
        
        // Reset on resize and/or setup on page load
        var mOnResize = function(){ 
            slideList.each(function (index) {
                    // SMALL SCREEN
                    if ( $(window).width() < opts.minimalSlideWidth ) { 
                        // Set all sections to display
                        $(this).css({
                            "position" : "relative",
                            "display"  : "block",
                            "opacity"  : 1,
                            "top"      : 0                           
                        });                        
                        // Transition all child elements to within view
                        $(this).find('.slide-left, .slide-right').each(function (index) {                                
                            TweenMax.to(
                                $(this), 
                                1, 
                                { 
                                    css: { 
                                        
                                        "margin-left": '0px',
                                            "opacity": 1  
                                        
                                    }, 
                                    ease:Expo.easeOut, 
                                    overwrite: 'all' 
                                }
                            ); 
                        });      
                    }
                    // LARGER SCREENS
                    else{
                        // If not first section hide all sections and transition out of view appropriate children
                        if(index > 0){
                            $(this).css({
                                "position" : "absolute",
                                "display"  : "none",
                                "top"      : 0,
                                "z-index"  : 0                            
                            });
                            $(this).find('.slide-left').each(function (index) {                                
                                TweenMax.to(
                                    $(this), 
                                    1, 
                                    { 
                                        css: { 
                                            "margin-left": '-1000px'  ,
                                            "opacity": 0
                                        }, 
                                        ease:Expo.easeOut, 
                                        overwrite: 'all' 
                                    }
                                ); 
                            });                            
                            $(this).find('.slide-right').each(function (index) {                                
                                TweenMax.to(
                                    $(this), 
                                    1, 
                                    { 
                                        css: { 
                                            "margin-left": '1000px',
                                            "opacity": 0
                                        }, 
                                        ease:Expo.easeOut, 
                                        overwrite: 'all' 
                                    }
                                ); 
                            });
                            
                        }
                        // Show first section and transition into view all appropriate children 
                        else{
                            $(this).css({
                                "position" : "relative",
                                "display"  : "block",
                                "top"      : 0 ,
                                "z-index"  : 1,
                                "opacity"  : 1
                            });
                            curSlide = $(this);
                            $(this).find('.slide-left, .slide-right').each(function (index) {                                
                                TweenMax.to(
                                    $(this), 
                                    1, 
                                    { 
                                        css: { 
                                            "margin-left": '0px',
                                            "opacity": 1
                                        }, 
                                        ease:Expo.easeOut, 
                                        overwrite: 'all' 
                                    }
                                ); 
                            });      
                        }
                    }
            });
        }
        // Initialize and setup onResize to reset
        mOnResize();
        $(window).on('resize', mOnResize);
        //return standard jQuery object representing desired object for chaining
        return this;
    };
})( jQuery );


/**
 * Parallax mouseover affect
 * @desc - transitions between sections of a single page template
 * @param {0bject} - object containing options to override defaults
 *        -backgroundElement   : options for background element that moves opposite of foreground elements to create affect
 *                           - className : selector for backgroundElement
 *                           - distance  : distance to move backgroundElement around in all directions
 *        -foregroundElements  : options for foreround elements that moves opposite of background element to create affect
 *                           - className : selector for foregroundElements
 *                           - distance  : distance to move foregroundElement around in all directions
 *        -disableBelowWidth   : width to disable affect
 *
 *
 *
 * @return {0bject} - standard return of jQuery object created by selector intializer to allow chaining
 * 
**/

(function( $ ) {
    //check if jQuery is available
	if('undefined' === typeof $) {
		if('console' in window){ window.console.info('parallaxMouseOver needs jQuery.'); }
		return;
	}
    
    // export of code as jQuery plugin
    $.fn.parallaxMouseOver = function(opts){
        //define default options
        var defaults = {
            backgroundElement: {
                className:  ".street-background",
                distance:   18   
            },
            foregroundElements:{
                className:  ".street-foreground",
                distance:   20
            },
            disableBelowWidth: 992
        };
        //override defaults with options passed in
        opts = $.extend({}, defaults, opts);
        
        // declare variables in this scope to be available throughout plugin
		var $this = $(this);      
        var mouseLeft = 0, mouseTop = 0,
            bgLeft = 0,    bgTop = 0,
            fgleft = 0,    fgbottom = 0;        
        
        // OnMouseMove method to trigger animations
        $this.on( 'mousemove.parallax', function( event ) {
            //Only on Larger screens then setting
            if ( $(window).width() >= opts.disableBelowWidth ) { 
                // get background
                var background = $this.children( opts.backgroundElement.className );
                
                // calculate next movement amounts 
                if( event.pageX > mouseLeft ){
                    bgLeft = (bgLeft+1 >opts.backgroundElement.distance) ? bgLeft = opts.backgroundElement.distance : bgLeft+1;
                    fgleft= (fgleft-1 <(-opts.foregroundElements.distance)) ? fgleft = -opts.backgroundElement.distance : fgleft-1;
                    mouseLeft=event.pageX;
                }
                else{
                    bgLeft = (bgLeft-1 < (-opts.backgroundElement.distance)) ? bgLeft = -opts.backgroundElement.distance : bgLeft-1;
                    fgleft= (fgleft+1 >opts.foregroundElements.distance) ? fgleft = opts.backgroundElement.distance : fgleft+1;
                    mouseLeft=event.pageX;
                }
                if( event.pageY > mouseTop ){
                    bgTop = (bgTop+1 >opts.backgroundElement.distance) ? bgTop = opts.backgroundElement.distance : bgTop+1;
                    fgbottom= (fgbottom-1 <(-opts.foregroundElements.distance)) ? fgbottom = -opts.backgroundElement.distance : fgbottom-1;
                    mouseTop=event.pageY;
                }
                else{
                    bgTop = (bgTop-1 < (-opts.backgroundElement.distance)) ? bgTop = -opts.backgroundElement.distance : bgTop-1;
                    fgbottom= (fgbottom+1 >opts.foregroundElements.distance) ? fgbottom = opts.backgroundElement.distance : fgbottom+1;
                    mouseTop=event.pageY;                
                }
                
                //Move background
                TweenMax.to(
                    background, 
                    1, 
                    { 
                        css: { 
                            transform: 'translateX(' + bgLeft  + 'px) translateY(' + bgTop + 'px)' 
                        }, 
                        ease:Expo.easeOut, 
                        overwrite: 'all' 
                    }
                );
                
                //Move foreground elements
                $this.children( opts.foregroundElements.className ).each( function(){                
                    TweenMax.to(
                        $(this), 
                        1, 
                        { 
                            css: { 
                                transform: 'translateX(' + fgleft  + 'px) translateY(' + fgbottom + 'px)' 
                            }, 
                            ease:Expo.easeOut, 
                            overwrite: 'all' 
                        }
                    );                
                });    
            }
        });
        return this;
    };
})( jQuery );




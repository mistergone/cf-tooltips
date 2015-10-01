

/**
 * cf-tooltips
 * https://github.com/cfpb/cf-tooltips
 *
 * A public domain work of the Consumer Financial Protection Bureau
 */

( function( $ ) {
  'use strict';

  var ToolTipper = function( element, options ) {
    var defaults = {
      pagePadding: 10,
      verticalPadding: 10
    },
    // settings is defaults combined with user options
    settings = {},
    // $tooltip is built from the .tooltip-container element
    $tooltip = $( element ),
    tooltipName = $tooltip.attr( 'data-tooltip__name' ),
    // $target is any element which opens the tooltip on click
    $target = $( '[data-tooltip__target="' + tooltipName + '"]' ),
    $currentTarget = null;

    /**
     * Initializes the ToolTipper
     * @param { object } options - Customizble options object
     */
    function _init( options ) {
      settings = $.extend( {}, defaults, options );
      _targetHandler();
    }

    /**
     * Handler for click events on the tooltip's target element
     * No parameters
     */
    function _targetHandler() {
      $target.click( function( ev ) {
        // set the current target
        $currentTarget = $( this );

        // Show the tooltip
        $tooltip.show();

        _reposition();

        // Stop event propogation, add the hideHandler
        ev.stopPropagation();
        _hideHandler();

      });
    }

    /**
     * Repositions the tooltip based on $currentTarget
     * No parameters
     */
    function _reposition() {
      var newTop,
          newLeft,
          $elem = $currentTarget;

      newTop = $elem.offset().top - $tooltip.outerHeight() - settings.verticalPadding;
      newLeft = $elem.offset().left + ( $elem.outerWidth() / 2 ) - ( $tooltip.outerWidth(true) / 2 );

      // Prevent tooltip from falling off the left side of screens
      if ( newLeft < settings.pagePadding ) {
        newLeft = settings.pagePadding;
      }

      // Prevent tooltip from falling off the right side of screens
      if ( $tooltip.offset().left + $tooltip.outerWidth(true) > $( window ).width() ) {
        var offset = $tooltip.outerWidth(true) - settings.pagePadding
        newLeft = $( window ).width() - offset;
      }

      // position the tooltip
      $tooltip.css( { 'top': newTop, 'left': newLeft } );
    }

    /**
     * Adds a handler to hide the tooltip container on body clicks
     * No parameters
     */
    function _hideHandler() {
      // if userAgent is an iPhone, iPad, iPod, make the body clickable
      if ( /iP/i.test(navigator.userAgent) ) {
        // Yes, changing the cursor makes it clickable. Seriously.
        $( 'body' ).css( 'cursor', 'pointer' ); 
      }

      $( 'html' ).on( 'click', 'body', function() {
        $tooltip.hide();
        $currentTarget = null;
        $( 'html' ).off( 'click' );
        $( 'body' ).css( 'cursor', 'inherit' );
      });      
    }

    _init();
  }

  /**
   * Instatiates the ToolTipper
   */
  $.fn.toolTipper = function( options ) {
    return this.each( function() {
      ( options || ( options = {} ) ).$element = $( this );
      var scol = new ToolTipper( this, options );
    });
  };

  $( document ).ready( function() {
    $( '.tooltip__container' ).toolTipper();    
  });

}( jQuery ));

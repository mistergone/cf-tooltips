

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
      verticalPadding: 22
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

        // reposition the tooltip
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
      var absTop,
          absLeft,
          newLeft,
          newTop,
          tooltipHeight = $tooltip.outerHeight(),
          tooltipWidth = $tooltip.outerWidth(true),
          $elem = $currentTarget,
          targetTop = $elem.offset().top,
          targetLeft = $elem.offset().left,
          halfTargetWidth = Math.floor( $elem.outerWidth() / 2 ),
          halfTooltipWidth = Math.floor( tooltipWidth / 2 ),
          relativeTop,
          relativeLeft;

      // Calculate new position for tooltip
      absTop = targetTop - tooltipHeight - settings.verticalPadding;
      absLeft = targetLeft + halfTargetWidth - halfTooltipWidth;

      // Prevent tooltip from falling off the left side of screens
      if ( absLeft < settings.pagePadding ) {
        absLeft = settings.pagePadding;
      }

      // Prevent tooltip from falling off the right side of screens
      if ( $tooltip.offset().left + tooltipWidth > $( window ).width() ) {
        var offset = tooltipWidth - settings.pagePadding;
        absLeft = $( window ).width() - offset;
      }

      // Given current tooltip position, determine new tooltip positioning
      newLeft = absLeft - $tooltip.offset().left + $tooltip.position().left; 
      newTop = absTop - $tooltip.offset().top + $tooltip.position().top; 

      // position the tooltip
      $tooltip.css( { 'top': absTop, 'left': newLeft } );
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

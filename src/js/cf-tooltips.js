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
      verticalPadding: 10,
      triangleWidth: 6,
      borderWidth: 1
    },
    // settings is defaults combined with user options
    settings = {},
    // $tooltip is built from the .tooltip-container element
    $tooltip = $( element ),
    // The following elements represent the 'triangle' part
    // of the tooltip.
    $innerTriangle,
    $outerTriangle,
    tooltipName = $tooltip.attr( 'data-tooltip__name' ),
    // $target is any element which opens the tooltip on click
    $target = $( '[data-tooltip__target="' + tooltipName + '"]' );

    /**
     * Initializes the ToolTipper
     * @param { object } options - Customizble options object
     */
    function _init( options ) {
      settings = $.extend( {}, defaults, options );
      _targetHandler();
      _createTriangle();
      _resizeHandler();
    }

    /**
     * Function to elegantly close any open tooltips
     * No parameters
     */
    function _closeAllTooltips() {
      var openTips = $( '.tooltip__container:visible' );

      if ( openTips.length > 0 ) {
        openTips.data( 'CFTooltips' ).close();
      }
    }

    /**
     * Function to open a tooltip
     * No parameters
     */
    function _open() {
      // Show the tooltip, activate it
      $tooltip.show();
      $target.addClass( 'activated' );
    }

    /**
     * Function to open a tooltip
     * No parameters
     */
    function _close() {
      // Hide the tooltip, deactivate it
      $tooltip.hide();
      $target.removeClass( 'activated' );
    }

    /**
     * Handler for click events on the tooltip's target element
     * No parameters
     */
    function _targetHandler() {
      $target.click( function( ev ) {
        // Close other tooltips, open this one
        _closeAllTooltips();
        _open();

        // reposition this tooltip
        _reposition();

        // Stop event propogation, add the hideHandler
        ev.stopPropagation();
        _hideHandler();
      });
    }

    /**
     * Handler for click events on the tooltip's target element
     * No parameters
     */
    function _createTriangle() {
      $tooltip.append( '<div class="triangle triangle-shadow"> </div>' );
      $tooltip.append( '<div class="triangle triangle-outer"> </div>' );
      $tooltip.append( '<div class="triangle triangle-inner"> </div>' );
    }

    /**
     * Repositions the tooltip based on $target
     * No parameters
     */
    function _reposition() {
      // absXXX values represent offsets to window
      // newXXX values represent new position
      // triXXX values refer to the triangle
      // targetXXX values refer to the tooltip target
      var absTop,
          absLeft,
          absRight,
          newLeft,
          newTop,
          triLeft,
          triWidth = settings.triangleWidth,
          tooltipHeight = $tooltip.outerHeight(),
          tooltipWidth = $tooltip.outerWidth(true),
          targetTop = $target.offset().top,
          targetLeft = $target.offset().left,
          targetCenter = Math.floor( $target.outerWidth() / 2 ) + targetLeft,
          halfTargetWidth = Math.floor( $target.outerWidth() / 2 ),
          halfTooltipWidth = Math.floor( tooltipWidth / 2 ),
          relativeTop,
          relativeLeft;

      // Calculate new position for tooltip and triangle
      absTop = targetTop - tooltipHeight - settings.verticalPadding;
      absLeft = targetLeft + halfTargetWidth - halfTooltipWidth;
      triLeft = Math.floor( tooltipWidth / 2 ) - Math.floor( triWidth / 2 );

      // Prevent tooltip from falling off the left side of screens
      if ( absLeft < settings.pagePadding ) {
        absLeft = settings.pagePadding;
        triLeft = targetCenter - absLeft;
      }

      absRight = absLeft + tooltipWidth;
      // Prevent tooltip from falling off the right side of screens
      if ( absRight >= $( window ).width() - settings.pagePadding ) {
        var offset = tooltipWidth + settings.pagePadding;
        absLeft = $( window ).width() - offset;
        triLeft = targetCenter - absLeft;
      }

      // Given current tooltip position, determine new tooltip positioning
      newLeft = absLeft - $tooltip.offset().left + $tooltip.position().left; 
      newTop = absTop - $tooltip.offset().top + $tooltip.position().top; 

      // position the tooltip
      $tooltip.css( { 'top': newTop, 'left': newLeft } );
      $tooltip.find( '.triangle' ).css( 'left', triLeft );
    }

    /**
     * Adds a handler to reposition the tooltip on window resize
     * No parameters
     */

     function _resizeHandler() {
      $( window ).resize( function() {
        _reposition();
      });
     }

    /**
     * Adds a handler to hide the tooltip container on body clicks
     * No parameters
     */
    function _hideHandler() {
      // if userAgent is an iPhone, iPad, iPod, make the body clickable
      if ( /iP/i.test( navigator.userAgent ) ) {
        // Yes, changing the cursor makes it clickable. Seriously.
        $( 'body' ).css( 'cursor', 'pointer' ); 
      }

      $( 'html' ).on( 'click', 'body', function() {
        _close();
        $( 'html' ).off( 'click' );
        $( 'body' ).css( 'cursor', 'inherit' );
      });      
    }

    /**
     * A public method that allows a tooltip to be opened without clicks
     * No parameters
     */

     this.open = function() {
      _open();
      _reposition();
      _hideHandler();

     };

    /**
     * A public method that allows a tooltip to be closed without clicks
     * No parameters
     */
     this.close = function() {
      $tooltip.hide();
      $( 'html' ).off( 'click' );
     };

    _init();
  };

  /**
   * Instatiates the ToolTipper
   */
  $.fn.toolTipper = function( options ) {
    return this.each( function() {
      ( options || ( options = {} ) ).$element = $( this );
      var tt = new ToolTipper( this, options );
      if ( $( this ).data( 'CFTooltips' ) === undefined ) {
        $( this ).data( 'CFTooltips', tt );
      }
    });
  };

  $( document ).ready( function() {
    $( '.tooltip__container' ).toolTipper();    
  });

}( jQuery ));

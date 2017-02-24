'use strict';

import React from 'react';
import assign from 'object-assign';
import classnames from 'classnames';

var getSlideClasses = (spec) => {
  var slickActive, slickCenter, slickCloned;
  var centerOffset, index;

  if (spec.rtl) {
    index = spec.slideCount - 1 - spec.index;
  } else {
    index = spec.index;
  }

  slickCloned = (index < 0) || (index >= spec.slideCount);
  if (spec.centerMode) {
    centerOffset = Math.floor(spec.slidesToShow / 2);
    slickCenter = (index - spec.currentSlide) % spec.slideCount === 0;
    if ((index > spec.currentSlide - centerOffset - 1) && (index <= spec.currentSlide + centerOffset)) {
      slickActive = true;
    }
  } else {
    slickActive = (spec.currentSlide <= index) && (index < spec.currentSlide + spec.slidesToShow);
  }

  return classnames({
    'slick-slide': true,
    'slick-active': slickActive,
    'slick-center': slickCenter,
    'slick-cloned': slickCloned
  });
};

var getSlideStyle = function (spec) {
  var style = {};

  if (spec.variableWidth === undefined || spec.variableWidth === false) {
    style.width = spec.slideWidth;
  }

  if (spec.fade) {
    style.position = 'relative';
    style.left = -spec.index * spec.slideWidth;
    style.opacity = (spec.currentSlide === spec.index) ? 1 : 0;
    style.transition = 'opacity ' + spec.speed + 'ms ' + spec.cssEase;
    style.WebkitTransition = 'opacity ' + spec.speed + 'ms ' + spec.cssEase;
  }

  // Project Dots : DOM control parameters
  if (spec.hoverZoom) {
    style.position = 'relative';
    style.left = 0;
    style.transform = 'scale(1.0)';
    style.WebkitTransform = 'scale(1.0)';
    style.MsTransform = 'scale(1.0)';
  }

  return style;
};

var getKey = (child, fallbackKey) => {
    // key could be a zero
    return (child.key === null || child.key === undefined) ? fallbackKey : child.key;
};

var RenderSlides = React.createClass({
  getInitialState() {
    // number of slides
    var count = React.Children.count(this.props.spec.children);

    // arrays
    var preScale = [];
    var postScale = [];
    var scale = [];
    var preShift = [];
    var postShift = [];
    var shift = [];

    // initialize the states
    for (var i = 0; i < count; i++){
      preScale[i] = 1.0;
      postScale[i] = 1.0;
      scale[i] = 1.0;
      preShift[i] = 0;
      postShift[i] = 0;
      shift[i] = 0;
    }

    return {
      count: count,
      shift: shift,
      preShift: preShift,
      postShift: postShift,
      scale: scale,
      preScale: preScale,
      postScale: postScale,
    };
  },

  // mouse click event
  onClick(key,e) {
    //console.log("onClick");
    /* original code
    child.props && child.props.onClick && child.props.onClick(e)
    if (spec.focusOnSelect) {
      spec.focusOnSelect(childOnClickOptions)
    }
    */
  },

  // mouse over event
  onMouseOver(key,e) {
    //console.log("onMouseOver");

    // if hover zoom is enabled
    if(this.props.spec.hoverZoom){
      // scale and shift amount
      var scaleUp = this.props.spec.hoverZoomScale;
      var shiftLength = (this.props.spec.hoverZoomScale-1.0)*this.props.spec.slideWidth/2;
      var shiftLengthEdge = shiftLength/scaleUp;

      // new arrays
      var newShift = [];
      var newPreShift = [];
      var newPostShift = [];
      var newScale = [];
      var newPreScale = [];
      var newPostScale = [];

      // number of slides
      var count = this.props.spec.children.length;

      // if the slide in focus on the edge of the list
      var leftEdge = (key==this.props.spec.currentSlide);
      var rightEdge =  (key==(this.props.spec.currentSlide+count-1));

      // edge
      if(leftEdge||rightEdge){
        if(leftEdge){
          // add shift and scale parameters
          if((key >= 0) && (key < count)){
            for (var j = 0; j < count; j++){
              if(j < key){
                newShift[j] = 0;
                newScale[j] = 1.0;
              }
              if(j == key){
                newShift[j] = shiftLengthEdge;
                newScale[j] = scaleUp;
              }
              if(j > key){
                newShift[j] = shiftLength*2;
                newScale[j] = 1.0;
              }
              newPreScale[j] = 1.0;
              newPostScale[j] = 1.0;
              newPreShift[j] = 0;
              newPostShift[j] = shiftLength*2;
            }
          }
          if(key < 0){
            for (var j = 0; j < count; j++){
              if(j < (key + count)){
                newPreShift[j] = 0;
                newPreScale[j] = 1.0;
              }
              if(j == (key + count)){
                newPreShift[j] = shiftLengthEdge;
                newPreScale[j] = scaleUp;
              }
              if(j > (key + count)){
                newPreShift[j] = shiftLength*2;
                newPreScale[j] = 1.0;
              }
              newScale[j] = 1.0;
              newPostScale[j] = 1.0;
              newShift[j] = shiftLength*2;
              newPostShift[j] = shiftLength*2;
            }
          }
          if(key >= count){
            for (var j = 0; j < count; j++){
              if(j < (key - count)){
                newPostShift[j] = 0;
                newPostScale[j] = 1.0;
              }
              if(j == (key - count)){
                newPostShift[j] = shiftLengthEdge;
                newPostScale[j] = scaleUp;
              }
              if(j > (key - count)){
                newPostShift[j] = shiftLength*2;
                newPostScale[j] = 1.0;
              }
              newPreScale[j] = 1.0;
              newScale[j] = 1.0;
              newPreShift[j] = 0;
              newShift[j] = 0;
            }        
          }
        }
        if(rightEdge){
          // add shift and scale parameters
          if((key >= 0) && (key < count)){
            for (var j = 0; j < count; j++){
              if(j < key){
                newShift[j] = -shiftLength*2;
                newScale[j] = 1.0;
              }
              if(j == key){
                newShift[j] = -shiftLengthEdge;
                newScale[j] = scaleUp;
              }
              if(j > key){
                newShift[j] = 0;
                newScale[j] = 1.0;
              }
              newPreScale[j] = 1.0;
              newPostScale[j] = 1.0;
              newPreShift[j] = -shiftLength*2;
              newPostShift[j] = 0;
            }
          }
          if(key < 0){
            for (var j = 0; j < count; j++){
              if(j < (key + count)){
                newPreShift[j] = -shiftLength*2;
                newPreScale[j] = 1.0;
              }
              if(j == (key + count)){
                newPreShift[j] = -shiftLengthEdge;
                newPreScale[j] = scaleUp;
              }
              if(j > (key + count)){
                newPreShift[j] = 0;
                newPreScale[j] = 1.0;
              }
              newScale[j] = 1.0;
              newPostScale[j] = 1.0;
              newShift[j] = 0;
              newPostShift[j] = 0;
            }
          }
          if(key >= count){
            for (var j = 0; j < count; j++){
              if(j < (key - count)){
                newPostShift[j] = -shiftLength*2;
                newPostScale[j] = 1.0;
              }
              if(j == (key - count)){
                newPostShift[j] = -shiftLengthEdge;
                newPostScale[j] = scaleUp;
              }
              if(j > (key - count)){
                newPostShift[j] = 0;
                newPostScale[j] = 1.0;
              }
              newPreScale[j] = 1.0;
              newScale[j] = 1.0;
              newPreShift[j] = -shiftLength*2;
              newShift[j] = -shiftLength*2;
            }        
          }
        }
      } else{
        // add shift and scale parameters
        if((key >= 0) && (key < count)){
          for (var j = 0; j < count; j++){
            if(j < key){
              newShift[j] = -shiftLength;
              newScale[j] = 1.0;
            }
            if(j == key){
              newShift[j] = 0;
              newScale[j] = scaleUp;
            }
            if(j > key){
              newShift[j] = shiftLength;
              newScale[j] = 1.0;
            }
            newPreScale[j] = 1.0;
            newPostScale[j] = 1.0;
            newPreShift[j] = -shiftLength;
            newPostShift[j] = shiftLength;
          }
        }
        if(key < 0){
          for (var j = 0; j < count; j++){
            if(j < (key + count)){
              newPreShift[j] = -shiftLength;
              newPreScale[j] = 1.0;
            }
            if(j == (key + count)){
              newPreShift[j] = 0;
              newPreScale[j] = scaleUp;
            }
            if(j > (key + count)){
              newPreShift[j] = shiftLength;
              newPreScale[j] = 1.0;
            }
            newScale[j] = 1.0;
            newPostScale[j] = 1.0;
            newShift[j] = shiftLength;
            newPostShift[j] = shiftLength;
          }
        }
        if(key >= count){
          for (var j = 0; j < count; j++){
            if(j < (key - count)){
              newPostShift[j] = -shiftLength;
              newPostScale[j] = 1.0;
            }
            if(j == (key - count)){
              newPostShift[j] = 0;
              newPostScale[j] = scaleUp;
            }
            if(j > (key - count)){
              newPostShift[j] = shiftLength;
              newPostScale[j] = 1.0;
            }
            newPreScale[j] = 1.0;
            newScale[j] = 1.0;
            newPreShift[j] = -shiftLength;
            newShift[j] = -shiftLength;
          }        
        }
      }

      // set states
      this.setState({
        scale: newScale, 
        preScale: newPreScale, 
        postScale: newPostScale, 
        shift: newShift, 
        preShift: newPreShift, 
        postShift: newPostShift
      });
      //console.log('key = ',key,' / shift = ',newPreShift,newShift,newPostShift);
    }
  },

  // mouse out event
  onMouseOut(key,e) {
    //console.log("onMouseOut");

    // number of slides
    var count = this.props.spec.children.length;

    // if hover zoom is enabled
    if(this.props.spec.hoverZoom){
      // new arrays
      var newShift = [];
      var newPreShift = [];
      var newPostShift = [];
      var newScale = [];
      var newPreScale = [];
      var newPostScale = [];

      // initialize all values        
      for (var j = 0; j < count; j++){
        newPreShift[j] = 0;
        newPostShift[j] = 0;
        newShift[j] = 0;
        newPreScale[j] = 1.0;
        newPostScale[j] = 1.0;
        newScale[j] = 1.0;
      }

      // set states
      this.setState({
        scale: newScale, 
        preScale: newPreScale, 
        postScale: newPostScale, 
        shift: newShift, 
        preShift: newPreShift, 
        postShift: newPostShift
      });
    }
  },

  render(){
    // slide objects
    var slides = [];

    // clone slides for left (pre) and right (post)
    var preCloneSlides = [];
    var postCloneSlides = [];

    // number of slides
    var count = React.Children.count(this.props.spec.children);

    // slide settings
    var spec = this.props.spec;

    // for all children objects
    React.Children.forEach(spec.children, (elem, index) => {
      // child will be a local variable
      let child;

      // onClick options
      var childOnClickOptions = {
        message: 'children',
        index: index,
        slidesToScroll: spec.slidesToScroll,
        currentSlide: spec.currentSlide
      };

      // lazyload vs normal load
      if (!spec.lazyLoad | (spec.lazyLoad && spec.lazyLoadedList.indexOf(index) >= 0)) {
        child = elem;
      } else {
        child = (<div></div>);
      }

      // get styles and classes
      var childStyle = getSlideStyle(assign({}, spec, {index: index}));

      // get slick classes
      var slickClasses = getSlideClasses(assign({index: index},spec));

      // add CSS classes if the element has children
      var cssClasses;
      if (child.props.className) {
          cssClasses = classnames(slickClasses, child.props.className);
      } else {
          cssClasses = slickClasses;
      }

      // slide index key
      var key = index;

      // transition style 
      var transitionStyle = {
        transition: 'transform ' + spec.speed + 'ms ' + spec.cssEase,
        WebkitTransition: '-webkit-transform ' + spec.speed + 'ms ' + spec.cssEase,
        msTransition: '-ms-transform ' + spec.speed + 'ms ' + spec.cssEase
      };

      // animation styles (linking state variables of RenderSlides components with DOM styles)
      var style = assign({}, child.props.style || {}, childStyle, {
        transform: 'scale('+this.state.scale[index]+') translate('+this.state.shift[index]+'px,0px)',
        WebkitTransform: 'scale('+this.state.scale[index]+') translate('+this.state.shift[index]+'px,0px)',
        msTransform: 'scale('+this.state.scale[index]+') translate('+this.state.shift[index]+'px,0px)'
      },transitionStyle);

      // main slide objects
      slides.push(React.cloneElement(child, {
        key: 'original' + getKey(child, index),
        'data-index': index,
        className: cssClasses,
        tabIndex: '-1',
        style: style,
        onClick: this.onClick.bind(this,key),
        onMouseOver: this.onMouseOver.bind(this,key),
        onMouseOut: this.onMouseOut.bind(this,key)
      }));

      // for infinite loop (variableWidth doesn't wrap properly)
      if (spec.infinite && spec.fade === false) {
        var infiniteCount = spec.variableWidth ? spec.slidesToShow + 1 : spec.slidesToShow;

        // preclone slides
        if (index >= (count - infiniteCount)) {
          // index key
          key = -(count - index);

          // animation styles (linking state variables of RenderSlides components with DOM styles)
          style = assign({}, child.props.style || {}, childStyle, {
            transform: 'scale('+this.state.preScale[key + count]+') translate('+this.state.preShift[key + count]+'px,0px)',
            WebkitTransform: 'scale('+this.state.preScale[key + count]+') translate('+this.state.preShift[key + count]+'px,0px)',
            msTransform: 'scale('+this.state.preScale[key + count]+') translate('+this.state.preShift[key + count]+'px,0px)'
          },transitionStyle);

          // preclone slide objects
          preCloneSlides.push(React.cloneElement(child, {
            key: 'precloned' + getKey(child, key),
            'data-index': key,
            className: cssClasses,
            style: style,
            onClick: this.onClick.bind(this,key),
            onMouseOver: this.onMouseOver.bind(this,key),
            onMouseOut: this.onMouseOut.bind(this,key)
          }));
        }

        // postclone slides
        if (index < infiniteCount) {
          // index key
          key = count + index;

          // animation styles (linking state variables of RenderSlides components with DOM styles)
          style = assign({}, child.props.style || {}, childStyle, {
            transform: 'scale('+this.state.postScale[key - count]+') translate('+this.state.postShift[key - count]+'px,0px)',
            WebkitTransform: 'scale('+this.state.postScale[key - count]+') translate('+this.state.postShift[key - count]+'px,0px)',
            msTransform: 'scale('+this.state.postScale[key - count]+') translate('+this.state.postShift[key + count]+'px,0px)'
          },transitionStyle);

          // postclone slide objects
          postCloneSlides.push(React.cloneElement(child, {
            key: 'postcloned' + getKey(child, key),
            'data-index': key,
            className: cssClasses,
            style: style,
            onClick: this.onClick.bind(this,key),
            onMouseOver: this.onMouseOver.bind(this,key),
            onMouseOut: this.onMouseOut.bind(this,key)
          }));
        }
      }
    });

    // put together all slides
    var slidesFinal = [];
    if (spec.rtl) {
      slidesFinal = preCloneSlides.concat(slides, postCloneSlides).reverse();
    } else {
      slidesFinal = preCloneSlides.concat(slides, postCloneSlides);
    }

    // return
    return(
      <div>{slidesFinal}</div>
    );
  }
});

export var Track = React.createClass({
  render(){
    return (
      <div className = 'slick-track' style = {this.props.trackStyle}>
        <RenderSlides spec={this.props}></RenderSlides>
      </div>
    );
  }
});

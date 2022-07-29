'use strict';
console.log('JS script working');

/*
    TRANSPARENT NAVBAR TRANSITION
*/
// define elements from DOM
const nav = document.querySelector('nav');
const slug = document.querySelector('.logo span');
const header = document.querySelector('header');
function checkScroll() { // callback function 
    let startY = header.offsetHeight * 0.6; //The point where the navbar changes in px
    // check whether scroll position is above/below target
    // toggle css styles accordingly
    if(window.scrollY > startY) { 
        nav.style.backgroundColor = 'black';
        slug.style.display = 'block';
    } else {
        nav.style.backgroundColor = 'transparent';
        slug.style.display = 'none';
    }
}
window.addEventListener('scroll', checkScroll);

/*
    DROPDOWN MENU
    Adapted from Erika Lee's I360 course: https://codepen.io/ebigalee/pen/dyydovo
*/
function toggleDropdown() {
    const socials = document.querySelector('.item');
    socials.classList.toggle('show');
}
document.querySelector('.toggle').addEventListener('click', toggleDropdown);

/*
    DATA SCROLL SPEED
*/
$.fn.moveIt = function() {
var $window = $(window);
var instances = [];

$(this).each(function() {
    instances.push(new moveItItem($(this)));
});

window.addEventListener('scroll', function() {
    var scrollTop = $window.scrollTop();
    instances.forEach(function(inst){
    inst.update(scrollTop);
    });
}, {passive: true});
}

var moveItItem = function(el) {
    this.el = $(el);
    this.speed = parseInt(this.el.attr('data-scroll-speed'));
};

moveItItem.prototype.update = function(scrollTop) {
    this.el.css('transform', 'translateY(' + -(scrollTop / this.speed) + 'px)');
};

// Initialization
$(function() {
    $('[data-scroll-speed]').moveIt();
});




//find all analysis clips
var analysis = document.querySelectorAll('.analysis');

//find all news clips
var news = document.querySelectorAll('.news');

var viz = document.querySelectorAll('.viz');

var audio = document.querySelectorAll('.audio');

var dev = document.querySelectorAll('.dev');

//find all 
var alls = document.querySelectorAll('.clip');

//function to initially loop through all items and hide them
function hide_init(){
   for (var i = 0; i < alls.length; ++i) { 
 alls[i].style.display = 'none'; 
}
}

function show_analysis(){  
//call the inital hide function
hide_init();
//loop through red-tagged items and show them  
   for (var i = 0; i < analysis.length; ++i) { 
 analysis[i].style.display = 'inline-block'; 
} 
}

function show_news(){  
    //call the inital hide function
    hide_init();
    //loop through red-tagged items and show them  
       for (var i = 0; i < news.length; ++i) { 
     news[i].style.display = 'inline-block'; 
    } 
}

function show_viz(){  
    //call the inital hide function
    hide_init();
    //loop through red-tagged items and show them  
       for (var i = 0; i < viz.length; ++i) { 
     viz[i].style.display = 'inline-block'; 
    } 
}

function show_audio(){  
    //call the inital hide function
    hide_init();
    //loop through red-tagged items and show them  
       for (var i = 0; i < audio.length; ++i) { 
     audio[i].style.display = 'inline-block'; 
    } 
}

function show_dev(){  
    //call the inital hide function
    hide_init();
    //loop through red-tagged items and show them  
       for (var i = 0; i < dev.length; ++i) { 
     dev[i].style.display = 'inline-block'; 
    } 
}



function show_all(){  
  //loop through all items and show them
   for (var i = 0; i < alls.length; ++i) { 
 alls[i].style.display = 'inline-block'; 
} 
}












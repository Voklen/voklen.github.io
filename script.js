/* LibreJS: script accepted. */
/*    
  @licstart  The following is the entire license notice for the 
	JavaScript code in this page.

	Copyright (C) 2021 Александр Горичев

	The JavaScript code in this page is free software: you can
	redistribute it and/or modify it under the terms of the GNU
	General Public License (GNU GPL) as published by the Free Software
	Foundation, either version 3 of the License, or (at your option)
	any later version.  The code is distributed WITHOUT ANY WARRANTY;
	without even the implied warranty of MERCHANTABILITY or FITNESS
	FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

	As additional permission under GNU GPL version 3 section 7, you
	may distribute non-source (e.g., minimized or compacted) forms of
	that code without the copy of the GNU GPL normally required by
	section 4, provided you include this license notice and a URL
	through which recipients can access the Corresponding Source.   


	@licend  The above is the entire license notice
	for the JavaScript code in this page.
*/

const FRAMERATE = 120
var r = document.querySelector(":root");

// Thanks to Matt DesLauriers for this beautiful lerp function
function lerp(start, end, t) {
  return start * (1 - t) + end * t
}

function convert(integer) {
  var str = parseInt(integer, 10).toString(16);
  return str.length == 1 ? "0" + str : str;
};
function to_hex(r, g, b) {
  return "#" + convert(r) + convert(g) + convert(b);
}

function fadeColour(css_var, target, elem) {
  let lerp_value = 0;
  original = getComputedStyle(document.documentElement).getPropertyValue(css_var);
  // Get rgb values and convert hex string to int with +
  let orig_r = +("0x" + original[1] + original[2]);
  let orig_g = +("0x" + original[3] + original[4]);
  let orig_b = +("0x" + original[5] + original[6]);
  let target_r = +("0x" + target[1] + target[2]);
  let target_g = +("0x" + target[3] + target[4]);
  let target_b = +("0x" + target[5] + target[6]);

  // Set up animation
  let id = setInterval(frame);
  let anim_duration = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--theme-animation-duration").slice(0, -1));

  function frame() { // Function frame() run every interval
    if (lerp_value > 0.99999) { // If done (> because it's a float)
      clearInterval(id);
      r.style.setProperty(css_var, target);
    } else { // Iterate
      r.style.setProperty(css_var, to_hex(  // Calculate, convert to hex, and set var to the colour
        lerp(orig_r, target_r, lerp_value), // Lerp the red value
        lerp(orig_g, target_g, lerp_value), // Lerp the green value
        lerp(orig_b, target_b, lerp_value)  // Lerp the blue value
        ));
      lerp_value += (1/FRAMERATE)/anim_duration;
    }
  }
} 

function switchTheme() {
  var maini = document.getElementsByTagName("main")[0];
  var rust_logo = document.getElementById("rust-logo-background");
  
  if (document.getElementById("switch-checkbox").checked) {
    // Dark mode
    fadeColour('--main-background','#1b1e27')
    fadeColour("--card-background", "#181b23");
    fadeColour("--light-shadow", "#d34ccc");
    fadeColour("--dark-shadow", "#3eb3bb");
    fadeColour("--text-high", "#dad7d6");
    rust_logo.style.filter ="invert(100%)";
  } else {
    // Light mode
    fadeColour("--main-background", "#f0f0f3");
    fadeColour("--card-background", "#e0e0e0");
    fadeColour("--light-shadow", "#d6d6d6");
    fadeColour("--dark-shadow", "#979189");
    fadeColour("--text-high", "#15163D");
    rust_logo.style.filter ="invert(0%)";
  }
}

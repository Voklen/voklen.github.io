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
const r = document.querySelector(':root')

// I want to replace this with @property in the CSS when/if it is supported (hopefully)
function switchTheme() {
	if (document.getElementById('switch-checkbox').checked) {
		// Dark mode
		fadeColour('--main-background', '#1b1e27')
		fadeColour('--card-background', '#181b23')
		fadeColour('--light-shadow', '#d34ccc')
		fadeColour('--dark-shadow', '#3eb3bb')
		fadeColour('--text-high', '#dad7d6')
		fadePercentage('--dark-percentage', '100')
	} else {
		// Light mode
		fadeColour('--main-background', '#f2ebeb')
		fadeColour('--card-background', '#fff7f7')
		fadeColour('--light-shadow', '#d6d6d6')
		fadeColour('--dark-shadow', '#979189')
		fadeColour('--text-high', '#15163D')
		fadePercentage('--dark-percentage', '0')
	}
}

function fadeColour(css_var, target) {
	const original = getProperty(css_var).trim()
	const orig_r = '0x' + original[1] + original[2]
	const orig_g = '0x' + original[3] + original[4]
	const orig_b = '0x' + original[5] + original[6]
	const target_r = '0x' + target[1] + target[2]
	const target_g = '0x' + target[3] + target[4]
	const target_b = '0x' + target[5] + target[6]

	const id = setInterval(frame, 1 / FRAMERATE)
	const anim_duration = parseInt(
		getProperty('--theme-animation-duration').slice(0, -1)
	)

	let lerp_value = 0
	function frame() {
		if (lerp_value > 0.99999) {
			clearInterval(id)
			r.style.setProperty(css_var, target)
			return
		}
		const interpolated = to_hex(
			lerp(orig_r, target_r, lerp_value), // Lerp the red value
			lerp(orig_g, target_g, lerp_value), // Lerp the green value
			lerp(orig_b, target_b, lerp_value) // Lerp the blue value
		)
		r.style.setProperty(css_var, interpolated)
		lerp_value += 1 / FRAMERATE / anim_duration
	}
}

function fadePercentage(css_var, target) {
	const original = getProperty(css_var).slice(0, -1)

	const id = setInterval(frame, 1 / FRAMERATE)
	const anim_duration = parseInt(
		getProperty('--theme-animation-duration').slice(0, -1)
	)

	let lerp_value = 0
	function frame() {
		if (lerp_value > 0.99999) {
			clearInterval(id)
			r.style.setProperty(css_var, target + '%')
			return
		}
		const interpolated = lerp(original, target, lerp_value)
		r.style.setProperty(css_var, interpolated + '%')
		lerp_value += 1 / FRAMERATE / anim_duration
	}
}

// Thanks to Matt DesLauriers for this beautiful lerp function
function lerp(start, end, t) {
	return start * (1 - t) + end * t
}

function convert(integer) {
	const str = parseInt(integer, 10).toString(16)
	return str.length == 1 ? '0' + str : str
}

function to_hex(r, g, b) {
	return '#' + convert(r) + convert(g) + convert(b)
}

function getProperty(property) {
	return getComputedStyle(document.documentElement).getPropertyValue(property)
}

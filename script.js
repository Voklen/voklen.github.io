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

const FRAMERATE = 60
const r = document.querySelector(':root')
const anim_duration = parseInt(
	getProperty('--theme-animation-duration').slice(0, -1)
)

async function switchTheme() {
	const toggle = document.getElementById('switch-checkbox')
	toggle.disabled = 'true'
	if (toggle.checked) {
		// Dark mode
		let lerp_funcs = [
			fadeColour('--main-background', '#222225'),
			fadeColour('--card-background', '#222225'),
			fadeColour('--light-shadow', '#2c2c30'),
			fadeColour('--dark-shadow', '#18181a'),
			fadeColour('--text-high', '#dad7d6'),
			fadePercentage('--dark-percentage', '100'),
		]
		runLerpFuncs(lerp_funcs)
		triggerAnimation('dayToNight')
	} else {
		// Light mode
		let lerp_funcs = [
			fadeColour('--main-background', '#f2ebeb'),
			fadeColour('--card-background', '#fff7f7'),
			fadeColour('--light-shadow', '#d6d6d6'),
			fadeColour('--dark-shadow', '#979189'),
			fadeColour('--text-high', '#15163D'),
			fadePercentage('--dark-percentage', '0'),
		]
		runLerpFuncs(lerp_funcs)
		triggerAnimation('nightToDay')
	}
	await sleep(anim_duration)
	toggle.disabled = ''
}

function fadeColour(css_var, target) {
	const original = getProperty(css_var).trim()
	const orig_r = '0x' + original[1] + original[2]
	const orig_g = '0x' + original[3] + original[4]
	const orig_b = '0x' + original[5] + original[6]
	const target_r = '0x' + target[1] + target[2]
	const target_g = '0x' + target[3] + target[4]
	const target_b = '0x' + target[5] + target[6]

	return (lerp_value) => {
		const interpolated = to_hex(
			lerp(orig_r, target_r, lerp_value), // Lerp the red value
			lerp(orig_g, target_g, lerp_value), // Lerp the green value
			lerp(orig_b, target_b, lerp_value) // Lerp the blue value
		)
		r.style.setProperty(css_var, interpolated)
	}
}

function fadePercentage(css_var, target) {
	const original = getProperty(css_var).slice(0, -1)
	return (lerp_value) => {
		const interpolated = lerp(original, target, lerp_value)
		r.style.setProperty(css_var, interpolated + '%')
	}
}

function runLerpFuncs(lerp_funcs) {
	let id = setTimeout(frame, 1000 / FRAMERATE)
	let lerp_value = 0
	function frame() {
		if (lerp_value > 0.99999) {
			clearTimeout(id)
			return
		}
		for (func of lerp_funcs) {
			func(lerp_value)
		}
		lerp_value += 1 / FRAMERATE / anim_duration
		id = setTimeout(frame, 1000 / FRAMERATE)
	}
}

function triggerAnimation(anim_name) {
	const toggle = document.getElementById('switch-svg').contentDocument

	const animation_elements = toggle.getElementsByClassName(anim_name)
	for (element of animation_elements) {
		element.beginElement()
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

function sleep(s) {
	return sleep_ms(s * 1000)
}

function sleep_ms(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

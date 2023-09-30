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
const animDuration = parseInt(
	getProperty('--theme-animation-duration').slice(0, -1)
)

const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
darkThemeMq.addEventListener('Media', onThemeChange)
addEventListener('load', onThemeChange)

function onThemeChange() {
	let isDarkMode = darkThemeMq.matches
	if (isDarkMode) {
		if (!document.getElementById('theme-toggle-checkbox').checked) {
			document.getElementById('theme-toggle-checkbox').click()
		} else {
			endAnimation('dayToNight')
		}
	}
}

async function switchTheme() {
	const toggle = document.getElementById('theme-toggle-checkbox')
	toggle.disabled = 'true'
	if (toggle.checked) {
		// Dark mode
		let lerpFuncs = [
			fadeColour('--main-background', '#222225'),
			fadeColour('--card-background', '#222225'),
			fadeColour('--light-shadow', '#2c2c30'),
			fadeColour('--dark-shadow', '#18181a'),
			fadeColour('--text-high', '#dad7d6'),
			fadePercentage('--dark-percentage', '100'),
		]
		runLerpFuncs(lerpFuncs)
		triggerAnimation('dayToNight')
	} else {
		// Light mode
		let lerpFuncs = [
			fadeColour('--main-background', '#f2ebeb'),
			fadeColour('--card-background', '#fff7f7'),
			fadeColour('--light-shadow', '#d6d6d6'),
			fadeColour('--dark-shadow', '#979189'),
			fadeColour('--text-high', '#15163D'),
			fadePercentage('--dark-percentage', '0'),
		]
		runLerpFuncs(lerpFuncs)
		triggerAnimation('nightToDay')
	}
	await sleep(animDuration)
	toggle.disabled = ''
}

function fadeColour(cssVar, target) {
	const original = getProperty(cssVar).trim()
	const origR = '0x' + original[1] + original[2]
	const origG = '0x' + original[3] + original[4]
	const origB = '0x' + original[5] + original[6]
	const targetR = '0x' + target[1] + target[2]
	const targetG = '0x' + target[3] + target[4]
	const targetB = '0x' + target[5] + target[6]

	return (lerpValue) => {
		const interpolated = toHex(
			lerp(origR, targetR, lerpValue), // Lerp the red value
			lerp(origG, targetG, lerpValue), // Lerp the green value
			lerp(origB, targetB, lerpValue) // Lerp the blue value
		)
		r.style.setProperty(cssVar, interpolated)
	}
}

function fadePercentage(cssVar, target) {
	const original = getProperty(cssVar).slice(0, -1)
	return (lerpValue) => {
		const interpolated = lerp(original, target, lerpValue)
		r.style.setProperty(cssVar, interpolated + '%')
	}
}

function runLerpFuncs(lerpFuncs) {
	let lerpValue = 0
	frame()
	function frame() {
		lerpValue += 1 / FRAMERATE / animDuration
		for (func of lerpFuncs) {
			func(lerpValue)
		}
		if (lerpValue < 0.99999) {
			setTimeout(frame, 1000 / FRAMERATE)
		}
	}
}

function triggerAnimation(animName) {
	const toggle = document.getElementById('theme-toggle-svg').contentDocument

	const animationElements = toggle.getElementsByClassName(animName)
	for (element of animationElements) {
		element.beginElement()
	}
}

function endAnimation(animName) {
	const toggle = document.getElementById('theme-toggle-svg').contentDocument

	const animationElements = toggle.getElementsByClassName(animName)
	for (element of animationElements) {
		// This is such a bodge to set the animation to the end
		element.beginElementAt(-0.999)
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

function toHex(r, g, b) {
	return '#' + convert(r) + convert(g) + convert(b)
}

function getProperty(property) {
	return getComputedStyle(document.documentElement).getPropertyValue(property)
}

function sleep(s) {
	return sleepMs(s * 1000)
}

function sleepMs(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

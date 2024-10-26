function currentTimeInTZ(tzString) {
	const currentTime = new Date();
	return currentTime.toLocaleString("en-GB", {
		timeZone: tzString,
		timeStyle: "long",
	});
}

function setFooterText() {
	const footer = document.getElementsByTagName("footer")[0];
	const currentTime = currentTimeInTZ("Europe/London");
	footer.innerHTML = `Location: Scotland | Local time: ${currentTime}`;
}

setFooterText();
setInterval(setFooterText, 1000);

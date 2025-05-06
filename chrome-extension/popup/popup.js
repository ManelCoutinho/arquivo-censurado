// popup.js
const censorButton = document.getElementById('censor-button');


censorButton.addEventListener('click', async () => {
	if (censorButton.disabled) return;

	await chrome.storage.local.set({ loading: true });
	censorButton.disabled = true;

	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.tabs.sendMessage(tab.id, { type: 'CENSOR_IFRAME' })
		.catch(err => {
			if (err?.message?.includes('Receiving end does not exist')) {
				chrome.storage.local.remove('loading');
				censorButton.disabled = false;
				console.warn('No content script in this tab; aborting.');
			} else {
				console.error(err);
			}
		});
});


chrome.runtime.onMessage.addListener((msg) => {
	if (msg.type === 'CENSOR_COMPLETE') {
		censorButton.disabled = false;
	}
});


async function getActiveTab() {
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true
	});
	return tab;
}

document.body.addEventListener('click', async (e) => {
	const link = e.target.closest('.link-same-tab');

	if (link) {
		e.preventDefault();
		const tab = await getActiveTab();
		chrome.tabs.update(tab.id, { url: link.href });
		window.close();
	}
});


const navMap = {
	home: 'nav-brand',
	about: 'nav-sobre'
};

const pageContentCache = {};
let isTyping = false;

function typewriterEffect(element, htmlContent, speed = 40) {
	return new Promise((resolve) => {
		element.innerHTML = '';
		let i = 0;
		let currentHTML = '';

		function type() {
			if (!isTyping) {
				element.innerHTML = htmlContent; // Show full content immediately
				resolve();
				return;
			}

			if (i < htmlContent.length) {
				let char = htmlContent[i];
				let delay = speed; // Default delay for regular characters

				if (char === '<') {
					// Found the start of a potential tag
					const tagEndIndex = htmlContent.indexOf('>', i);
					if (tagEndIndex !== -1) {
						const tag = htmlContent.substring(i, tagEndIndex + 1);
						currentHTML += tag;
						i = tagEndIndex + 1;
						delay = 0; // No delay
					} else {
						// Malformed tag or just a '<' character - treat as literal text.
						currentHTML += char;
						i++;
					}
				}
				else {
					currentHTML += char;
					i++;
				}

				element.innerHTML = currentHTML;

				if (i < htmlContent.length) {
					setTimeout(type, delay);
				} else {
					element.innerHTML = currentHTML;
					resolve(); // Typing finished
				}
			} else {
				element.innerHTML = currentHTML; // Ensure final content is set
				resolve(); // Typing finished
			}
		}

		setTimeout(type, speed);
	});
}


async function showPage(id) {
	if (isTyping) {
		isTyping = false;
		// Instantly show the target page content without animation if switching rapidly
		document.querySelectorAll(".page").forEach(section => {
			section.classList.remove("visible");
			// Restore full content immediately if cached
			if (pageContentCache[section.id]) {
				pageContentCache[section.id].elements.forEach(item => {
					item.element.innerHTML = item.originalHTML;
				});
			}
		});
		const targetPage = document.getElementById(id);
		if (targetPage) {
			targetPage.classList.add("visible");
			// Restore target page content
			if (pageContentCache[id]) {
				pageContentCache[id].elements.forEach(item => {
					item.element.innerHTML = item.originalHTML;
				});
			}
		}
		document.querySelectorAll("nav span").forEach(span => span.classList.remove("active"));
		document.getElementById(navMap[id])?.classList.add("active");
		return; // Exit early
	}

	const pageToShow = document.getElementById(id);
	if (!pageToShow) return;

	document.querySelectorAll(".page").forEach(section => section.classList.remove("visible"));
	const elementsToAnimate = pageToShow.querySelectorAll('h1, h2, h3, h4, h5, h6, p');

	// Cache original content if not already done
	if (!pageContentCache[id]) {
		pageContentCache[id] = { elements: [] };
		elementsToAnimate.forEach(el => {
			pageContentCache[id].elements.push({
				element: el,
				originalHTML: el.innerHTML
			});
		});
	}

	pageContentCache[id].elements.forEach(item => {
		item.element.innerHTML = '';
	});

	// Make the page container visible
	pageToShow.classList.add("visible");

	// Update nav underline
	document.querySelectorAll("nav span").forEach(span => span.classList.remove("active"));
	document.getElementById(navMap[id])?.classList.add("active");


	// Start typing animation
	isTyping = true;
	try {
		for (const item of pageContentCache[id].elements) {
			if (!isTyping) break;
			await typewriterEffect(item.element, item.originalHTML, 30); // Adjust speed (e.g., 30ms)
		}
	} catch (error) {
		console.error("Typing animation error:", error);
		// Ensure full content is restored on error
		if (pageContentCache[id]) {
			pageContentCache[id].elements.forEach(item => {
				item.element.innerHTML = item.originalHTML;
			});
		}
	} finally {
		isTyping = false; // Animation finished or stopped
	}

}


document.getElementById("nav-brand").addEventListener("click", () => showPage("home"));
document.getElementById("nav-sobre").addEventListener("click", () => showPage("about"));



document.addEventListener('DOMContentLoaded', async () => {

	const data = await chrome.storage.local.get('loading');
	console.log("Loading state: ", data.loading)
	censorButton.disabled = !!data.loading;


	// Footer dash
	const dashLineEl = document.getElementById('dashLine');
	if (dashLineEl) {
		dashLineEl.textContent = '-'.repeat(100);
	}

	// Navbar dashes
	Object.values(navMap).forEach(id => {
		const el = document.getElementById(id);
		if (!el) return;
		el.dataset.dash = '-'.repeat(el.textContent.length);
	});
	// Anchor dashes
	document.querySelectorAll("a").forEach(a => {
		a.dataset.dash = '-'.repeat(a.textContent.length);
	});

	// Load Home
	document.getElementById("home")?.classList.add("visible");
	document.getElementById("nav-brand")?.classList.add("active");
});
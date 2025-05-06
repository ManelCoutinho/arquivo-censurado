// contentScript.js
if (chrome.storage?.local) {
	chrome.storage.local.remove('loading');
}

(async () => {
	// dynamic import so the browser treats lib/index.js as a real module
	const { default: nanomorph } = await import(
		chrome.runtime.getURL('lib/index.js')
	);

	chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
		if (request.type !== 'CENSOR_IFRAME') return;

		let iframeDoc;

		try {

			// Get iframe
			const iframe = document.querySelector('iframe');
			if (!iframe) {
				console.warn("No iframe found on this page!");
				return;
			}

			iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
			if (!iframeDoc) {
				console.warn("Unable to access iframe document (cross-origin issue?)");
				return;
			}

			iframeDoc.getElementById('censor-stamp')?.remove();
			showOverlay(iframeDoc);

			const clonedBody = iframeDoc.body.cloneNode(true);

			// Remove scripts, styles, and links
			const removedScripts = removeTags(clonedBody, 'script');
			const removedStyles = removeTags(clonedBody, 'style');
			const removedLinks = removeTags(clonedBody, 'link');

			// Compress
			const classMap = new Map();
			const inputMap = new Map();
			const allElements = clonedBody.querySelectorAll('*');
			allElements.forEach(elem => {
				// classes
				if (elem.hasAttribute('class')) {
					const oldClass = elem.getAttribute('class');
					if (!classMap.has(oldClass)) {
						const compressedClass = `c${classMap.size}`;
						classMap.set(oldClass, compressedClass);
					}
					const newClass = classMap.get(oldClass);
					elem.setAttribute('class', newClass);
				}

				// input
				if (elem.tagName === 'INPUT' && elem.hasAttribute('value')) {
					const oldValue = elem.getAttribute('value');
					if (oldValue.trim() !== '') {
						if (!inputMap.has(oldValue)) {
							const compressedVal = `v${inputMap.size}`;
							inputMap.set(oldValue, compressedVal);
						}
						const newValue = inputMap.get(oldValue);
						elem.setAttribute('value', newValue);
					}
				}
			});

			console.log("Sending text to censor");

			const response = await fetch('https://www.arquivocensurado.pt/api/censor', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					text: clonedBody.innerHTML,
					model_name: "gemini-2.5-flash-preview-04-17",
					opening_censor_tag: "<span class='censored'>",
					closing_censor_tag: "</span>"
				})
			});
			if (!response.ok) {
				console.error(`Censor API returned HTTP ${response.status}`);
				sendResponse({ success: false, status: response.status });
				return;
			}

			console.log("Censor response: ", response.status);
			const data = await response.json();
			// console.log("Censor response data: ", data.censored_text);

			const censoredHTML = data.censored_text || '';

			const tempDiv = iframeDoc.createElement('body');
			tempDiv.innerHTML = censoredHTML;

			// Restore original class and input
			const newElements = tempDiv.querySelectorAll('*');
			newElements.forEach(elem => {
				// restore class
				if (elem.hasAttribute('class')) {
					const compressedClass = elem.getAttribute('class');
					// TODO: better way to find class
					for (const [orig, comp] of classMap.entries()) {
						if (comp === compressedClass) {
							elem.setAttribute('class', orig);
							break;
						}
					}
				}

				// restore input
				if (elem.tagName === 'INPUT' && elem.hasAttribute('value')) {
					const compVal = elem.getAttribute('value');
					// TODO: better way to find class
					for (const [origVal, comp] of inputMap.entries()) {
						if (comp === compVal) {
							elem.setAttribute('value', origVal);
							break;
						}
					}
				}
			});


			// Append to the end
			removedLinks.forEach(lnk => iframeDoc.body.appendChild(lnk));
			removedStyles.forEach(st => iframeDoc.body.appendChild(st));
			removedScripts.forEach(scr => iframeDoc.body.appendChild(scr));

			// Substitute
			const hasCuts = tempDiv.querySelector('.censored') !== null;

			nanomorph(iframeDoc.body, tempDiv);
			ensureIframeStylesheet(iframeDoc);

			showStamp(hasCuts ? 'censored' : 'approved', iframeDoc);

			sendResponse({ success: true });
		} catch (err) {
			console.error("Error censoring iframe body:", err);
			sendResponse({ success: false, error: err.message });
		} finally {
			chrome.storage.local.remove('loading');
			chrome.runtime.sendMessage({ type: 'CENSOR_COMPLETE' });
			hideOverlay(iframeDoc);
		}


		return true;
	});
})();


function showOverlay(doc) {
	// Overlay
	const ov = doc.createElement('div');
	ov.id = 'censor-overlay';
	Object.assign(ov.style, {
		position: 'fixed',
		inset: '0',
		zIndex: '9999',
		background: 'rgba(255,255,255,.5)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily: '"Special Elite", monospace',
		fontSize: '1.5rem',
		color: '#222',
		userSelect: 'none',
		letterSpacing: '2px'
	});

	// "Censurando …"
	const label = doc.createElement('div');
	Object.assign(label.style, {
		display: 'inline-flex',
		alignItems: 'center',
	});

	// Dots
	const dots = doc.createElement('span');
	Object.assign(dots.style, {
		display: 'inline-block',
		width: '3ch',
		textAlign: 'left',
	});
	dots.textContent = '';

	const text = doc.createElement('span');
	text.textContent = ' Censurando';

	label.append(text, dots);
	ov.appendChild(label);

	let count = 0;
	const timer = setInterval(() => {
		count = (count + 1) % 4;
		dots.textContent = '.'.repeat(count);
	}, 450); // same cadence as the webpage

	ov.dataset.timerId = timer;
	doc.body.appendChild(ov);
	return ov;
}

function hideOverlay(doc) {
	const ov = doc.getElementById('censor-overlay');
	if (!ov) return;
	clearInterval(Number(ov.dataset.timerId));
	ov.remove();
}


function removeTags(body, tagName) {
	const removedTags = Array.from(body.querySelectorAll(tagName));
	removedTags.forEach(el => el.remove());
	return removedTags
}


function ensureIframeStylesheet(iframeDoc) {
	if (iframeDoc.getElementById('censor-style')) return;
	const style = iframeDoc.createElement('style');
	style.id = 'censor-style';
	style.textContent = `
	  .censored{
		position:relative;
		display:inline;
		background-image:url("${chrome.runtime.getURL('imgs/scribble.png')}");
		background-repeat:repeat;
		background-size:auto 1.3em;
		box-decoration-break:clone;
		-webkit-box-decoration-break:clone;
	  }
	  .censored,
	  .censored * { pointer-events: none; }
	`;
	iframeDoc.head.appendChild(style);
}


function showStamp(status, doc) {
	// status: 'approved' | 'censored'
	const existing = doc.getElementById('censor-stamp');
	if (existing) existing.remove();

	const src = chrome.runtime.getURL(
		status === 'approved'
			? 'imgs/aprovado.png'
			: 'imgs/autorizado-com-cortes.png'
	);

	const stamp = doc.createElement('img');
	stamp.id = 'censor-stamp';
	stamp.src = src;

	Object.assign(stamp.style, {
		position: 'absolute',
		top: '200px',
		left: '50px',
		maxWidth: '50%',
		zIndex: '999',
		pointerEvents: 'none',
		userSelect: 'none',
		opacity: '0',
		transform: 'scale(0.5)',
		transition: 'transform 1s ease-out, opacity 1s ease-out'
	});

	doc.body.appendChild(stamp);
	// kick off the zoom‑in / fade‑in
	requestAnimationFrame(() => {
		stamp.style.opacity = '1';
		stamp.style.transform = 'scale(1)';
	});
}

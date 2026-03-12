/**
 * splitChars — splits element text into individually animatable char spans.
 * Reads innerText so <br> tags become \n, which we treat as word boundaries.
 * Words are wrapped in inline-block spans to preserve natural line-wrapping.
 */
export function splitChars(element: HTMLElement) {
    const text = element.innerText || "";
    // Normalise all whitespace (including \n from <br>) into single spaces
    const normalised = text.replace(/\s+/g, " ").trim();
    element.innerHTML = "";
    element.style.whiteSpace = "normal";

    const words = normalised.split(" ");
    words.forEach((word, i) => {
        const wordSpan = document.createElement("span");
        wordSpan.style.display = "inline-block";

        word.split("").forEach((char) => {
            const charSpan = document.createElement("span");
            charSpan.textContent = char;
            charSpan.style.display = "inline-block";
            charSpan.style.opacity = "0";
            charSpan.dataset.char = "true";
            wordSpan.appendChild(charSpan);
        });

        element.appendChild(wordSpan);

        // Append a real space text node between words so the browser wraps naturally
        if (i < words.length - 1) {
            element.appendChild(document.createTextNode(" "));
        }
    });

    return {
        chars: element.querySelectorAll("[data-char='true']") as NodeListOf<HTMLElement>,
        revert: () => {
            element.innerHTML = normalised;
            element.style.whiteSpace = "";
        },
    };
}

/**
 * splitLines — wraps rendered visual lines in overflow-hidden mask divs
 * so lines can slide in from below (reveal effect).
 * Uses innerText to normalise <br> tags before splitting.
 */
export function splitLines(element: HTMLElement) {
    const text = element.innerText || "";
    const normalised = text.replace(/\s+/g, " ").trim();
    const words = normalised.split(" ");
    element.innerHTML = "";

    // 1. Place each word in a span so we can measure offsetTop
    const wordSpans: HTMLElement[] = [];
    words.forEach((word, i) => {
        const span = document.createElement("span");
        span.textContent = word + (i < words.length - 1 ? " " : "");
        span.style.display = "inline-block";
        span.style.whiteSpace = "pre";
        element.appendChild(span);
        wordSpans.push(span);
    });

    // 2. Group spans by their visual line (offsetTop)
    const lines: HTMLElement[][] = [];
    let currentLine: HTMLElement[] = [];
    let lastTop = -1;

    wordSpans.forEach(span => {
        const top = span.offsetTop;
        if (lastTop !== -1 && Math.abs(top - lastTop) > 5) {
            lines.push(currentLine);
            currentLine = [];
        }
        currentLine.push(span);
        lastTop = top;
    });
    if (currentLine.length > 0) lines.push(currentLine);

    // 3. Rebuild with overflow-hidden wrappers (the mask)
    element.innerHTML = "";
    const innerLines: HTMLElement[] = [];

    lines.forEach(lineWords => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        wrapper.style.display = "block";

        const inner = document.createElement("div");
        inner.style.display = "block";
        inner.style.opacity = "0";
        inner.dataset.line = "true";

        lineWords.forEach(wordSpan => inner.appendChild(wordSpan.cloneNode(true)));

        wrapper.appendChild(inner);
        element.appendChild(wrapper);
        innerLines.push(inner);
    });

    return {
        lines: innerLines,
        revert: () => {
            element.innerHTML = normalised;
        },
    };
}


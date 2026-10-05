
document.addEventListener("DOMContentLoaded", () => {
    const mermaidBlocks = document.querySelectorAll(".mermaid");

    mermaidBlocks.forEach((mermaid) => {
        if (mermaid.parentElement.classList.contains("mermaid-zoom-wrapper")) {
            return;
        }

        const wrapper = document.createElement("div");
        wrapper.className = "mermaid-zoom-wrapper";

        const controls = document.createElement("div");
        controls.className = "mermaid-zoom-controls";

        const zoomOut = document.createElement("button");
        zoomOut.type = "button";
        zoomOut.textContent = "−";
        zoomOut.title = "کاهش اندازه";

        const zoomReset = document.createElement("button");
        zoomReset.type = "button";
        zoomReset.textContent = "↺";
        zoomReset.title = "بازنشانی";

        const zoomIn = document.createElement("button");
        zoomIn.type = "button";
        zoomIn.textContent = "+";
        zoomIn.title = "افزایش اندازه";

        controls.append(zoomOut, zoomReset, zoomIn);

        mermaid.parentNode.insertBefore(wrapper, mermaid);
        wrapper.append(controls, mermaid);

        let scale = 1;

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let scrollLeft = 0;
        let scrollTop = 0;

        const applyZoom = () => {
            mermaid.style.transform = `scale(${scale})`;
        };

        zoomIn.addEventListener("click", () => {
            scale = Math.min(scale + 0.1, 3);
            applyZoom();
        });

        zoomOut.addEventListener("click", () => {
            scale = Math.max(scale - 0.1, 0.5);
            applyZoom();
        });

        zoomReset.addEventListener("click", () => {
            scale = 1;
            wrapper.scrollLeft = 0;
            wrapper.scrollTop = 0;
            applyZoom();
        });

        /*
         * Drag
         */
        wrapper.addEventListener("pointerdown", (event) => {
            if (event.target.closest(".mermaid-zoom-controls")) {
                return;
            }

            isDragging = true;

            startX = event.clientX;
            startY = event.clientY;

            scrollLeft = wrapper.scrollLeft;
            scrollTop = wrapper.scrollTop;

            wrapper.classList.add("is-dragging");

            wrapper.setPointerCapture(event.pointerId);
        });

        wrapper.addEventListener("pointermove", (event) => {
            if (!isDragging) {
                return;
            }

            const x = event.clientX - startX;
            const y = event.clientY - startY;

            wrapper.scrollLeft = scrollLeft - x;
            wrapper.scrollTop = scrollTop - y;
        });

        const stopDragging = (event) => {
            if (!isDragging) {
                return;
            }

            isDragging = false;
            wrapper.classList.remove("is-dragging");

            if (wrapper.hasPointerCapture(event.pointerId)) {
                wrapper.releasePointerCapture(event.pointerId);
            }
        };

        wrapper.addEventListener("pointerup", stopDragging);
        wrapper.addEventListener("pointercancel", stopDragging);
    });
});

import React, { useState, useRef, useEffect } from 'react';

const PptxTextBlock = ({ block, index, onUpdate }) => {
    const [segments, setSegments] = useState(block);
    const editableDivRef = useRef(null);
    const lastSelectionRef = useRef(null);

    // Save selection before updates
    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && editableDivRef.current?.contains(selection.anchorNode)) {
            lastSelectionRef.current = selection.getRangeAt(0);
        }
    };

    // Restore selection after updates
    const restoreSelection = () => {
        if (lastSelectionRef.current && editableDivRef.current) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(lastSelectionRef.current);
        }
    };

    useEffect(() => {
        if (!editableDivRef.current) return;

        saveSelection();

        editableDivRef.current.innerHTML = '';
        segments.forEach(segment => {
            const span = document.createElement('span');
            span.textContent = segment.text;
            span.dataset.id = segment.id;
            span.dataset.slide = segment.slide;
            span.dataset.shapeId = segment.shapeId;

            span.style.margin = '0 1px';
            span.style.display = 'inline';
            span.style.whiteSpace = 'pre-wrap';

            editableDivRef.current.appendChild(span);
        });

        restoreSelection();
    }, [segments]);

    const handlePaste = (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        document.execCommand('insertText', false, text);
        setTimeout(handleBlur, 0);
    };

    const handleBlur = () => {
        if (!editableDivRef.current) return;

        const spans = editableDivRef.current.querySelectorAll('span');
        const newSegments = Array.from(spans).map((span, i) => ({
            ...segments[i] || {},
            text: span.textContent
        }));

        const hasChanges = newSegments.some((newSeg, i) =>
            i >= segments.length || newSeg.text !== segments[i].text
        );

        if (hasChanges) {
            setSegments(newSegments);
            onUpdate(index, newSegments);
        }
    };

    return (
        <div
            ref={editableDivRef}
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={handleBlur}
            onPaste={handlePaste}
            className="p-2 dark:text-white bg-white border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 focus:border-orange-400 outline-none"
            style={{
             width: '100%',
                overflow: 'hidden',
                textAlign: 'start',
                fontSize: '14px',
                lineHeight: '1.5',
                minHeight: '20px'
            }}
        />
    );
};

export default PptxTextBlock;
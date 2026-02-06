/**
 * Code Editor Enhancements
 */

class CodeEditor {
    constructor(textareaId) {
        this.textarea = document.getElementById(textareaId);
        if (!this.textarea) return;

        this.initializeEditor();
    }

    initializeEditor() {
        // Add tab support
        this.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertTab();
            }
        });

        // Auto-indent on Enter
        this.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleEnter(e);
            }
        });

        // Bracket matching
        this.textarea.addEventListener('keydown', (e) => {
            this.handleBrackets(e);
        });
    }

    insertTab() {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const value = this.textarea.value;

        // Insert 2 spaces as tab
        this.textarea.value = value.substring(0, start) + '  ' + value.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
    }

    handleEnter(e) {
        const start = this.textarea.selectionStart;
        const value = this.textarea.value;

        // Get current line
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const currentLine = value.substring(lineStart, start);

        // Count leading whitespace
        const indent = currentLine.match(/^(\s*)/)[1];

        // Check if we should add extra indent (after certain keywords)
        let extraIndent = '';
        const trimmedLine = currentLine.trim();
        if (trimmedLine.endsWith('{') ||
            trimmedLine.match(/^(FOREACH|SPLIT)\s+.*\{$/)) {
            extraIndent = '  ';
        }

        // Insert newline with same indentation
        if (indent || extraIndent) {
            e.preventDefault();
            const insertion = '\n' + indent + extraIndent;
            this.textarea.value = value.substring(0, start) + insertion + value.substring(start);
            this.textarea.selectionStart = this.textarea.selectionEnd = start + insertion.length;
        }
    }

    handleBrackets(e) {
        const pairs = {
            '(': ')',
            '[': ']',
            '{': '}',
            "'": "'"
        };

        if (pairs[e.key]) {
            const start = this.textarea.selectionStart;
            const end = this.textarea.selectionEnd;

            // Only auto-close if nothing is selected
            if (start === end) {
                e.preventDefault();
                const value = this.textarea.value;
                const insertion = e.key + pairs[e.key];
                this.textarea.value = value.substring(0, start) + insertion + value.substring(end);
                this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;
            }
        }
    }

    setValue(value) {
        this.textarea.value = value;
    }

    getValue() {
        return this.textarea.value;
    }

    focus() {
        this.textarea.focus();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.codeEditor = new CodeEditor('code-editor');
});

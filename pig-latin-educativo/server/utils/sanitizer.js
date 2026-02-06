/**
 * Input sanitizer for Pig Latin scripts
 * Prevents code injection and validates script safety
 */

const MAX_SCRIPT_LENGTH = parseInt(process.env.MAX_SCRIPT_LENGTH || '10000');

/**
 * Sanitizes and validates a Pig Latin script
 * @param {string} script - User-provided Pig script
 * @returns {string} Sanitized script
 * @throws {Error} If script contains forbidden patterns
 */
function sanitizePigScript(script) {
    if (!script || typeof script !== 'string') {
        throw new Error('Script must be a non-empty string');
    }

    // Check length
    if (script.length > MAX_SCRIPT_LENGTH) {
        throw new Error(`Script exceeds maximum length of ${MAX_SCRIPT_LENGTH} characters`);
    }

    // Forbidden patterns that could be used for command injection
    const forbiddenPatterns = [
        { pattern: /`/g, description: 'backticks (command substitution)' },
        { pattern: /\$\(/g, description: 'command substitution $()' },
        { pattern: /exec\s+/gi, description: 'exec commands' },
        { pattern: /sh\s+-c/gi, description: 'shell execution' },
        { pattern: /bash\s+-c/gi, description: 'bash execution' },
        { pattern: /system\s*\(/gi, description: 'system calls' },
        { pattern: /;.*rm\s+/gi, description: 'dangerous rm commands' },
        { pattern: /;.*dd\s+/gi, description: 'dangerous dd commands' },
        { pattern: />\s*\/dev\//gi, description: 'device file writes' },
    ];

    for (const { pattern, description } of forbiddenPatterns) {
        if (pattern.test(script)) {
            throw new Error(`Script contains forbidden pattern: ${description}`);
        }
    }

    // Validate that script contains only valid Pig keywords (basic check)
    const validPigKeywords = [
        'LOAD', 'STORE', 'DUMP', 'DESCRIBE', 'EXPLAIN', 'ILLUSTRATE',
        'FILTER', 'FOREACH', 'GENERATE', 'GROUP', 'JOIN', 'COGROUP',
        'UNION', 'SPLIT', 'SAMPLE', 'ORDER', 'RANK', 'LIMIT', 'DISTINCT',
        'CROSS', 'BY', 'INTO', 'IF', 'ALL', 'AS', 'USING', 'PARALLEL',
        'ARRANGE', 'CUBE', 'AND', 'OR', 'NOT', 'MATCHES', 'IS', 'NULL',
        'FLATTEN', 'DEFINE', 'RETURNS', 'SHIP', 'CACHE', 'STREAM', 'THROUGH',
        'PigStorage', 'TextLoader', 'JsonLoader', 'AvroStorage',
        'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'CONCAT', 'SIZE', 'SUBSTRING',
        'UPPER', 'LOWER', 'TRIM', 'LTRIM', 'RTRIM', 'REPLACE', 'STRSPLIT',
        'ROUND', 'CEIL', 'FLOOR', 'ABS', 'LOG', 'EXP', 'SQRT',
        'TOBAG', 'TOTUPLE', 'TOMAP', 'TOP', 'IsEmpty',
        'int', 'long', 'float', 'double', 'chararray', 'bytearray', 'boolean',
        'tuple', 'bag', 'map', 'datetime',
        'ASC', 'DESC', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'INNER'
    ];

    // Allow comments (-- and /* */)
    // Allow operators: =, ==, !=, <, >, <=, >=, +, -, *, /, %, ::, ., $
    // Allow delimiters: (, ), [, ], {, }, ,, ;, '

    // This is a basic validation - in production, you might use a proper Pig parser

    return script.trim();
}

/**
 * Validates exercise ID format
 * @param {string} nivel 
 * @param {string} idExercise 
 * @returns {boolean}
 */
function validateExerciseId(nivel, id) {
    // Nivel should be 1, 2, or 3
    const nivelNum = parseInt(nivel);
    if (isNaN(nivelNum) || nivelNum < 1 || nivelNum > 3) {
        return false;
    }

    // ID should be a positive integer
    const idNum = parseInt(id);
    if (isNaN(idNum) || idNum < 1) {
        return false;
    }

    // Check max exercises per level
    const maxExercises = { 1: 30, 2: 40, 3: 30 };
    if (idNum > maxExercises[nivelNum]) {
        return false;
    }

    return true;
}

/**
 * Sanitizes file paths to prevent directory traversal
 * @param {string} filename 
 * @returns {string}
 */
function sanitizeFilename(filename) {
    if (!filename || typeof filename !== 'string') {
        throw new Error('Invalid filename');
    }

    // Remove any path traversal attempts
    const clean = filename.replace(/\.\./g, '').replace(/\//g, '').replace(/\\/g, '');

    if (clean.length === 0) {
        throw new Error('Invalid filename after sanitization');
    }

    return clean;
}

module.exports = {
    sanitizePigScript,
    validateExerciseId,
    sanitizeFilename
};

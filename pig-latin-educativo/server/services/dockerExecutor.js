const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execPromise = promisify(exec);

const DOCKER_CONTAINER = process.env.DOCKER_CONTAINER_NAME || 'hadoop-pig-executor';
const SCRIPT_TIMEOUT = parseInt(process.env.SCRIPT_TIMEOUT_MS || '30000');
const SCRIPTS_DIR = path.join(__dirname, '../../docker/scripts');

/**
 * Executes a Pig Latin script in Docker container
 * @param {string} script - Pig Latin script content
 * @param {string} exerciseId - Exercise identifier for temp file naming
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
async function executePigScript(script, exerciseId) {
    const timestamp = Date.now();
    const scriptFilename = `user_${exerciseId}_${timestamp}.pig`;
    const scriptPath = path.join(SCRIPTS_DIR, scriptFilename);

    try {
        // Write script to shared volume
        await fs.writeFile(scriptPath, script);
        console.log(`[Docker Executor] Created script: ${scriptFilename}`);

        // Execute in Docker container using Pig in local mode for speed
        // Note: Pig writes ALL output (including data) to stderr, so we need to capture both
        // Use bash -c to properly redirect within the container
        // Set smaller heap size to avoid out-of-memory errors in container
        const command = `docker exec ${DOCKER_CONTAINER} bash -c "export PIG_HEAPSIZE=512 && pig -x local /scripts/${scriptFilename} 2>&1"`;

        console.log(`[Docker Executor] Executing: ${command}`);

        const { stdout, stderr } = await execPromise(command, {
            timeout: SCRIPT_TIMEOUT,
            maxBuffer: 1024 * 1024 * 10 // 10MB buffer
        });

        console.log(`[Docker Executor] Execution completed for ${scriptFilename}`);

        // Since we redirected stderr to stdout, everything is in stdout now
        return { stdout, stderr: '' };

    } catch (error) {
        console.error(`[Docker Executor] Error executing script:`, error.message);

        // Handle timeout
        if (error.killed && error.signal === 'SIGTERM') {
            throw new Error('Script execution timed out (30s limit)');
        }

        // Return all output (Pig writes to stderr)
        return {
            stdout: error.stdout || '',
            stderr: error.stderr || error.message
        };


    } finally {
        // Cleanup: delete temporary script file
        try {
            await fs.unlink(scriptPath);
            console.log(`[Docker Executor] Cleaned up: ${scriptFilename}`);
        } catch (cleanupError) {
            console.warn(`[Docker Executor] Failed to cleanup ${scriptFilename}:`, cleanupError.message);
        }
    }
}

/**
 * Checks if Docker container is running
 * @returns {Promise<boolean>}
 */
async function checkDockerContainer() {
    try {
        const { stdout } = await execPromise(`docker ps --filter name=${DOCKER_CONTAINER} --format "{{.Names}}"`);
        return stdout.trim() === DOCKER_CONTAINER;
    } catch (error) {
        console.error('[Docker Executor] Error checking container:', error.message);
        return false;
    }
}

/**
 * Gets Docker container status information
 * @returns {Promise<object>}
 */
async function getContainerStatus() {
    try {
        const { stdout } = await execPromise(`docker inspect ${DOCKER_CONTAINER}`);
        const info = JSON.parse(stdout)[0];

        return {
            running: info.State.Running,
            status: info.State.Status,
            startedAt: info.State.StartedAt
        };
    } catch (error) {
        return {
            running: false,
            status: 'not found',
            error: error.message
        };
    }
}

module.exports = {
    executePigScript,
    checkDockerContainer,
    getContainerStatus
};

const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises;
const path = require('path');

const execPromise = util.promisify(exec);

const DOCKER_CONTAINER = process.env.DOCKER_CONTAINER_NAME || 'hive-executor';
const SCRIPT_TIMEOUT = parseInt(process.env.SCRIPT_TIMEOUT_MS) || 30000;
const SCRIPTS_DIR = path.join(__dirname, '../../docker/scripts');

/**
 * Execute HiveQL script in Docker container
 * @param {string} script - HiveQL script content
 * @param {string} exerciseId - Exercise identifier for temp file naming
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
async function executeHiveScript(script, exerciseId) {
    const timestamp = Date.now();
    const scriptFilename = `user_${exerciseId}_${timestamp}.hql`;
    const scriptPath = path.join(SCRIPTS_DIR, scriptFilename);

    try {
        // Write script to shared volume
        await fs.writeFile(scriptPath, script);
        console.log(`[Hive Executor] Created script: ${scriptFilename}`);

        // Execute in Docker container using Hive CLI
        // Note: Hive writes output to stdout, errors to stderr
        const command = `docker exec ${DOCKER_CONTAINER} bash -c "hive -f /scripts/${scriptFilename} 2>&1"`;

        console.log(`[Hive Executor] Executing: ${command}`);

        const { stdout, stderr } = await execPromise(command, {
            timeout: SCRIPT_TIMEOUT,
            maxBuffer: 1024 * 1024 * 10 // 10MB buffer
        });

        console.log(`[Hive Executor] Execution completed for ${scriptFilename}`);

        // Since we redirected stderr to stdout, everything is in stdout now
        return { stdout, stderr: '' };

    } catch (error) {
        console.error(`[Hive Executor] Error executing script:`, error.message);

        // Handle timeout
        if (error.killed && error.signal === 'SIGTERM') {
            throw new Error('Script execution timed out (30s limit)');
        }

        // Return all output (Hive writes to stderr)
        return {
            stdout: error.stdout || '',
            stderr: error.stderr || error.message
        };

    } finally {
        // Cleanup: delete temporary script file
        try {
            await fs.unlink(scriptPath);
            console.log(`[Hive Executor] Cleaned up: ${scriptFilename}`);
        } catch (cleanupError) {
            console.warn(`[Hive Executor] Failed to cleanup ${scriptFilename}:`, cleanupError.message);
        }
    }
}

/**
 * Check if Docker container is running
 * @returns {Promise<boolean>}
 */
async function checkDockerContainer() {
    try {
        const { stdout } = await execPromise(`docker ps --filter name=${DOCKER_CONTAINER} --format "{{.Names}}"`);
        return stdout.trim() === DOCKER_CONTAINER;
    } catch (error) {
        console.error('[Hive Executor] Error checking Docker container:', error.message);
        return false;
    }
}

/**
 * Get Docker container status
 * @returns {Promise<string>}
 */
async function getContainerStatus() {
    try {
        const { stdout } = await execPromise(`docker ps -a --filter name=${DOCKER_CONTAINER} --format "{{.Status}}"`);
        return stdout.trim() || 'not found';
    } catch (error) {
        return 'error';
    }
}

module.exports = {
    executeHiveScript,
    checkDockerContainer,
    getContainerStatus
};

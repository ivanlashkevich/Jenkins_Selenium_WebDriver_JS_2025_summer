import dotenv from 'dotenv';
dotenv.config();

const JENKINS_HOST = process.env.LOCAL_HOST || 'localhost';
const JENKINS_PORT = process.env.LOCAL_PORT || 8080;
const JENKINS_USER = process.env.LOCAL_ADMIN_USERNAME || 'admin';
const JENKINS_API_TOKEN = process.env.LOCAL_ADMIN_TOKEN;

async function getJenkinsCrumb() {
    const crumbUrl = `http://${JENKINS_HOST}:${JENKINS_PORT}/crumbIssuer/api/json`;
    const response = await fetch(crumbUrl, {
        headers: {
            Authorization: `Basic ${Buffer.from(`${JENKINS_USER}:${JENKINS_API_TOKEN}`).toString('base64')}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        return { crumb: data.crumb, field: data.crumbRequestField };
    } else {
        throw new Error(`Failed to fetch crumb. Status: ${response.status} - ${response.statusText}`);
    }
}

async function deleteJobs() {
    try {
        const projectNames = await listProjects();
        // console.log('Deleting jobs:', projectNames);
        await deleteMultipleProjects(projectNames);
    } catch (error) {
        console.error('Error deleting jobs:', error);
    }
}

async function cleanData() {
    await deleteJobs();
}

async function listProjects() {
    const url = `http://${JENKINS_HOST}:${JENKINS_PORT}/api/json?tree=jobs[name]`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Basic ${Buffer.from(`${JENKINS_USER}:${JENKINS_API_TOKEN}`).toString('base64')}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        return data.jobs.map(job => job.name);
    } else {
        throw new Error(`Failed to list projects. Status: ${response.status} - ${response.statusText}`);
    }
}

async function deleteMultipleProjects(projectNames) {
    for (const jobName of projectNames) {
        await deleteProjectByAPI(jobName);
    }
}

async function deleteProjectByAPI(jobName) {
    try {
        const { crumb, field } = await getJenkinsCrumb();

        const url = `http://${JENKINS_HOST}:${JENKINS_PORT}/job/${encodeURIComponent(jobName)}/doDelete`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`${JENKINS_USER}:${JENKINS_API_TOKEN}`).toString('base64')}`,
                [field]: crumb,
            },
        });

        if (response.ok) {
            // console.log(`Project "${jobName}" deleted successfully.`);
        } else if (response.status === 404) {
            console.warn(`Project "${jobName}" not found for deletion.`);
        } else {
            console.error(`Failed to delete project "${jobName}". Status: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error deleting project "${jobName}":`, error);
    }
}

export { cleanData };
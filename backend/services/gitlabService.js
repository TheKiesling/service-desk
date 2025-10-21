import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GITLAB_API_URL = 'https://gitlab.com/api/v4';
const PROJECT_ID = process.env.GITLAB_PROJECT_ID || '75469260';
const GITLAB_TOKEN = process.env.GITLAB_TOKEN;

const gitlabApi = axios.create({
  baseURL: GITLAB_API_URL,
  headers: {
    'PRIVATE-TOKEN': GITLAB_TOKEN,
    'Content-Type': 'application/json',
  },
});

export const createGitLabIssue = async (ticketData) => {
  try {
    const issueData = {
      title: ticketData.title,
      description: ticketData.description,
      labels: ticketData.service,
    };

    const response = await gitlabApi.post(`/projects/${PROJECT_ID}/issues`, issueData);
    
    return {
      success: true,
      gitlabIssueId: response.data.iid,
      gitlabIssueUrl: response.data.web_url,
      data: response.data,
    };
  } catch (error) {
    console.error('Error creando issue en GitLab:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

export const updateGitLabIssue = async (gitlabIssueId, updates) => {
  try {
    const updateData = {};
    
    if (updates.status) {
      if (updates.status === 'Cerrado') {
        updateData.state_event = 'close';
      } else if (updates.status === 'Abierto') {
        updateData.state_event = 'reopen';
      }
    }

    if (updates.labels) {
      updateData.labels = updates.labels;
    }

    const response = await gitlabApi.put(
      `/projects/${PROJECT_ID}/issues/${gitlabIssueId}`,
      updateData
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error actualizando issue en GitLab:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

export const addGitLabComment = async (gitlabIssueId, comment) => {
  try {
    const noteData = {
      body: `**${comment.author}** ${comment.isInternal ? '(Comentario Interno)' : ''}:\n\n${comment.content}`,
    };

    const response = await gitlabApi.post(
      `/projects/${PROJECT_ID}/issues/${gitlabIssueId}/notes`,
      noteData
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error agregando comentario en GitLab:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

export default {
  createGitLabIssue,
  updateGitLabIssue,
  addGitLabComment,
};

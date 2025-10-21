import axios from 'axios';

const GITLAB_API_URL = 'https://gitlab.com/api/v4';
const PROJECT_ID = '75469260';
const PRIVATE_TOKEN = import.meta.env.VITE_GITLAB_TOKEN;

const gitlabApi = axios.create({
  baseURL: GITLAB_API_URL,
  headers: {
    'PRIVATE-TOKEN': PRIVATE_TOKEN,
  },
});

export const gitlabService = {
  getAllIssues: async () => {
    const response = await gitlabApi.get(`/projects/${PROJECT_ID}/issues`);
    return response.data;
  },

  getIssueByIid: async (iid) => {
    const response = await gitlabApi.get(`/projects/${PROJECT_ID}/issues/${iid}`);
    return response.data;
  },

  createIssue: async (issueData) => {
    const { title, description, labels, priority, category, affectedUser } = issueData;
    
    const fullDescription = `${description}

---
**Información del Usuario Afectado:**
- **Nombre:** ${affectedUser.name}
- **Email:** ${affectedUser.email}
- **Rol:** ${affectedUser.role}

---
**Categoría:** ${category}
**Prioridad:** ${priority}`;

    const response = await gitlabApi.post(`/projects/${PROJECT_ID}/issues`, {
      title,
      description: fullDescription,
      labels: labels ? (Array.isArray(labels) ? labels.join(',') : labels) : '',
    });
    return response.data;
  },

  updateIssue: async (iid, updates) => {
    const params = {};
    
    if (updates.state) {
      params.state_event = updates.state;
    }
    if (updates.labels) {
      params.labels = Array.isArray(updates.labels) ? updates.labels.join(',') : updates.labels;
    }
    if (updates.title) {
      params.title = updates.title;
    }
    if (updates.description) {
      params.description = updates.description;
    }

    const response = await gitlabApi.put(`/projects/${PROJECT_ID}/issues/${iid}`, params);
    return response.data;
  },

  getIssueNotes: async (iid) => {
    const response = await gitlabApi.get(`/projects/${PROJECT_ID}/issues/${iid}/notes`);
    return response.data;
  },

  addIssueNote: async (iid, body) => {
    const response = await gitlabApi.post(
      `/projects/${PROJECT_ID}/issues/${iid}/notes`,
      null,
      {
        params: { body }
      }
    );
    return response.data;
  },

  closeIssue: async (iid) => {
    return await gitlabService.updateIssue(iid, { state: 'close' });
  },

  reopenIssue: async (iid) => {
    return await gitlabService.updateIssue(iid, { state: 'reopen' });
  },
};

export default gitlabService;


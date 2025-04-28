"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5001";

export function useApiClient() {
  const router = useRouter();
  
 
const getApiClient = async () => {
  const apiClient = axios.create({
    baseURL: API_URL,
  });
  
  apiClient.interceptors.request.use(async (config) => {
   
    const token = localStorage.getItem('auth_token') || 
                 document.cookie
                   .split('; ')
                   .find(row => row.startsWith('auth_token='))
                   ?.split('=')[1];
    
    if (token) {
      console.log("Using token:", token.substring(0, 20) + "...");
      
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No authentication token found");
    }
    
    return config;
  });
  
  return apiClient;
};
  
  return { getApiClient };
}
export function useUserApi() {
  const { getApiClient } = useApiClient();
  
  const getUserProfile = async () => {
    const api = await getApiClient();
    return api.get("/api/users/profile");
  };
  
  const updateUserProfile = async (data) => {
    const api = await getApiClient();
    return api.put("/api/users/profile", data);
  };
  
  return {
    getUserProfile,
    updateUserProfile,
  };
}

export function useCVApi() {
  const { getApiClient } = useApiClient();
  
  const uploadCV = async (file) => {
    const api = await getApiClient();
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/api/cvs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  
  const uploadMultipleCVs = async (files) => {
    const api = await getApiClient();
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return api.post('/api/cvs/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  
  const getAllMyCVs = async () => {
    const api = await getApiClient();
    return api.get('/api/cvs');
  };
  const deleteCV = async (cvId) => {
    const api = await getApiClient();
    return api.delete(`/api/cvs/${cvId}`);
  };
  
  return {
    uploadCV,
    uploadMultipleCVs,
    getAllMyCVs,
    deleteCV
  };
}

export function useJDApi() {
  const { getApiClient } = useApiClient();
  
  const uploadJD = async (file) => {
    const api = await getApiClient();
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/api/jds/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  
  const uploadMultipleJDs = async (files) => {
    const api = await getApiClient();
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return api.post('/api/jds/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  
  const getAllMyJDs = async () => {
    const api = await getApiClient();
    return api.get('/api/jds');
  };
  const deleteJD = async (jdId) => {
    const api = await getApiClient();
    return api.delete(`/api/jds/${jdId}`);
  };
  
  
  return {
    uploadJD,
    uploadMultipleJDs,
    getAllMyJDs,
    deleteJD
  };
}

const USE_MOCK_DATA = false;

export function useMatchApi() {
  const { getApiClient } = useApiClient();
  const router = useRouter();

  const getMatchById = async (matchId) => {
    try {
      const api = await getApiClient();
      const response = await api.get(`/api/matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting match with ID ${matchId}:`, error);
      throw error;
    }
  };

  const getAllMatches = async () => {
    try {
      const api = await getApiClient();
      const response = await api.get('/api/matches');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all matches:", error);
      throw error;
    }
  };

  const matchCVWithJDs = async (cvId, skillWeights = []) => {
    try {
      const api = await getApiClient();
      if (skillWeights.length > 0) {
        const totalWeight = skillWeights.reduce((sum, item) => sum + item.weight, 0);
        if (Math.abs(totalWeight - 1.0) > 0.001) {
          throw new Error("Sum of weights must be equal to 1");
        }
      }
      
      const response = await api.post(`/api/matches/cvs/${cvId}`);
      return response.data;
    } catch (error) {
      console.error(`Error matching CV with ID ${cvId}:`, error);
      throw error;
    }
  };

  const matchJDWithCVs = async (jdId, skillWeights = []) => {
    console.log(`--- matchJDWithCVs DEBUG START ---`);
    console.log(`Attempting to match JD ${jdId} with CVs`);
    console.log('Request URL:', `${API_URL}/api/matches/jds/${jdId}`);
    console.log('Skill weights provided:', skillWeights);
    
    try {
      const api = await getApiClient();
      
      console.log('API base URL:', api.defaults.baseURL);
      console.log('Headers:', api.defaults.headers);
      
      if (skillWeights.length > 0) {
        const totalWeight = skillWeights.reduce((sum, item) => sum + item.weight, 0);
        console.log('Total weight sum:', totalWeight);
        
        if (Math.abs(totalWeight - 1.0) > 0.001) {
          console.error('Weight validation failed - sum is not 1.0');
          throw new Error("Sum of weights must be equal to 1");
        }
      }
      
      console.log('Request payload:', skillWeights.length > 0 ? skillWeights : 'No weights (empty array)');
      
      console.log('Sending API request...');
      const response = await api.post(`/api/matches/jds/${jdId}`, skillWeights);
      
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      console.log(`--- matchJDWithCVs DEBUG END (SUCCESS) ---`);
      
      return response.data;
    } catch (error) {
      console.error(`--- matchJDWithCVs DEBUG END (ERROR) ---`);
      console.error(`Error matching JD with ID ${jdId}:`, error);
      
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout - server did not respond in time');
      }
      
      if (error.code === 'ERR_NETWORK') {
        console.error('Network error - check if API server is running');
      }
      
      throw error;
    }};

    const deleteMatch = async (matchId) => {
      try {
        const api = await getApiClient();
        const response = await api.delete(`/api/matches/${matchId}`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting match with ID ${matchId}:`, error);
        throw error;
      }
    };

  const deleteAllMatches = async () => {
    try {
      const api = await getApiClient();
      const response = await api.delete('/api/matches');
      return response.data;
    } catch (error) {
      console.error("Error deleting all matches:", error);
      throw error;
    }
  };

  const navigateToMatchDetails = (matchId) => {
    router.push(`/matches/${matchId}`);
  };

  return {

    getMatchById,
    getAllMatches,
    matchCVWithJDs,
    matchJDWithCVs,
    deleteMatch,
    deleteAllMatches,
    navigateToMatchDetails
  };
}
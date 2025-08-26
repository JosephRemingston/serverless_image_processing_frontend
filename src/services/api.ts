const API_BASE_URL = "https://vm5i52o5g1.execute-api.ap-south-1.amazonaws.com/api";

interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
}

class ApiService {
  private getHeaders(includeAuth = false, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth && token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  private getMultipartHeaders(includeAuth = false, token?: string) {
    const headers: Record<string, string> = {};
    
    if (includeAuth && token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  async signup(username: string, password: string, email: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ username, password, email }),
      });
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      return {
        statusCode: 500,
        message: error.message || 'Network error occurred',
        error: error.message
      };
    }
  }

  async confirmSignup(username: string, code: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/confirm-user`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ username, code }),
      });
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      return {
        statusCode: 500,
        message: error.message || 'Network error occurred',
        error: error.message
      };
    }
  }

  async signin(username: string, password: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      return {
        statusCode: 500,
        message: error.message || 'Network error occurred',
        error: error.message
      };
    }
  }

  async detectLabels(imageFile: File, token: string): Promise<ApiResponse> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch(`${API_BASE_URL}/rekognition/labels`, {
        method: 'POST',
        headers: this.getMultipartHeaders(true, token),
        body: formData,
      });
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      return {
        statusCode: 500,
        message: error.message || 'Network error occurred',
        error: error.message
      };
    }
  }

  async convertImageToBytes(imageFile: File): Promise<ApiResponse> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch(`${API_BASE_URL}/image/convert`, {
        method: 'POST',
        headers: this.getMultipartHeaders(),
        body: formData,
      });
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      return {
        statusCode: 500,
        message: error.message || 'Network error occurred',
        error: error.message
      };
    }
  }

  async convertImageToBytesWithProcessing(
    imageFile: File, 
    options: {
      resize?: boolean;
      width?: number;
      quality?: number;
      format?: string;
    } = {}
  ): Promise<ApiResponse> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Add processing options to form data
      if (options.resize !== undefined) {
        formData.append('resize', options.resize.toString());
      }
      if (options.width) {
        formData.append('width', options.width.toString());
      }
      if (options.quality) {
        formData.append('quality', options.quality.toString());
      }
      if (options.format) {
        formData.append('format', options.format);
      }
      
      const response = await fetch(`${API_BASE_URL}/image/convert-with-processing`, {
        method: 'POST',
        headers: this.getMultipartHeaders(),
        body: formData,
      });
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      return {
        statusCode: 500,
        message: error.message || 'Network error occurred',
        error: error.message
      };
    }
  }

  async getUserProfile(token: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: this.getHeaders(true, token),
      });
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      return {
        statusCode: 500,
        message: error.message || 'Network error occurred',
        error: error.message
      };
    }
  }
}

export const apiService = new ApiService();
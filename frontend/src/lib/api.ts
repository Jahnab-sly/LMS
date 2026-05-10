/**
 * API Service for connecting to Express backend
 * Base URL: http://localhost:5500
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500';

// Types
export interface LoginResponse {
  success: boolean;
  role?: 'admin' | 'student';
  user?: {
    username: string;
    userId?: string;
    name?: string;
    role: string;
  };
  message?: string;
}

export interface Transaction {
  transaction_id: number;
  user_id: string;
  name: string;
  title: string;
  author?: string;
  category?: string;
  reserve_date: string;
  due_date: string;
  status: 'Issued' | 'Returned';
}

export interface Book {
  authNo: string;
  title: string;
  author?: string;
  category?: string;
  publisher?: string;
  year?: number;
}

export interface Student {
  user_id: string;
  name: string;
  email?: string;
  phone_no?: string;
  address?: string;
  enrollment_date?: string;
  expiry_date?: string;
}

// API Helper
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  async login(username: string, password: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};

// Books API
export const booksApi = {
  async getAll(): Promise<Book[]> {
    return apiRequest<Book[]>('/doc');
  },

  async add(data: {
    authNo: string;
    title: string;
    author?: string;
    ISBN?: string;
    edition?: string;
    category?: string;
    price?: number;
    publisher_id?: number;
  }): Promise<{ success: boolean; message: string }> {
    return apiRequest('/add-book', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Students API
export const studentsApi = {
  async getAll(): Promise<Student[]> {
    return apiRequest<Student[]>('/students');
  },

  async register(data: {
    user_id: string;
    firstname: string;
    lastname?: string;
    email?: string;
    phone_no?: string;
    address?: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> {
    return apiRequest('/register-user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Transactions API
export const transactionsApi = {
  async getAll(): Promise<Transaction[]> {
    return apiRequest<Transaction[]>('/transactions');
  },

  async getByUserId(userId: string): Promise<Transaction[]> {
    return apiRequest<Transaction[]>(`/student-transactions/${userId}`);
  },

  async issueBook(data: {
    userId: string;
    studentName: string;
    authNo: string;
    issue_date: string;
    due_date: string;
  }): Promise<{ success: boolean; message: string }> {
    return apiRequest('/issue-book', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Export all APIs
export const api = {
  auth: authApi,
  books: booksApi,
  students: studentsApi,
  transactions: transactionsApi,
};

export default api;

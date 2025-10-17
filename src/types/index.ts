// User profile types
export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  photos: string[];
  interests: string[];
  gender: 'male' | 'female' | 'other';
  lookingFor: 'male' | 'female' | 'other' | 'everyone';
  distance: number;
  verified: boolean;
  lastSeen: Date;
  createdAt: Date;
}

// Match types
export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  matchedAt: Date;
  conversationId?: string;
}

// Message types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'gif' | 'voice';
}

// Conversation types
export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageAt?: Date;
  unreadCount: number;
  matchedAt: Date;
}

// Swipe action types
export interface SwipeAction {
  id: string;
  userId: string;
  targetUserId: string;
  action: 'like' | 'pass' | 'super_like';
  timestamp: Date;
}

// Filter and preference types
export interface DatingPreferences {
  ageRange: {
    min: number;
    max: number;
  };
  maxDistance: number;
  interestedIn: ('male' | 'female' | 'other')[];
  showMe: ('male' | 'female' | 'other')[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form types
export interface ProfileFormData {
  name: string;
  age: number;
  bio: string;
  location: string;
  interests: string[];
  gender: 'male' | 'female' | 'other';
  lookingFor: 'male' | 'female' | 'other' | 'everyone';
}

export interface AuthFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'profile_view' | 'like';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

// App state types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  preferences: DatingPreferences;
  matches: Match[];
  conversations: Conversation[];
  notifications: Notification[];
}

import type { AuthResponse, Session, User } from '@supabase/supabase-js';

export interface IAuthentication {
    signInAsync(email: string, password: string): Promise<AuthResponse>;
    signOutAsync(): Promise<void>;
    getCurrentUserAsync(): Promise<User | null>;
    getCurrentSessionAsync(): Promise<Session | null>;
}

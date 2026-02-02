// Authentication Service
const AUTH_CONFIG = {
    userPoolId: 'ap-south-1_vTAVjSOra',
    clientId: '42dipcrd3r5uf9elpech2138',
    region: 'ap-south-1'
};

export const authService = {
    async login(username, password) {
        // Mock authentication for development
        console.log('Login attempt:', { username, password });
        
        if (username === 'testuser' && password === 'Password123!') {
            const mockToken = 'mock-jwt-token-' + Date.now();
            
            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', username);
            
            console.log('Login successful');
            return { success: true, token: mockToken, username };
        }
        
        console.log('Login failed - credentials do not match');
        return { success: false, error: 'Invalid username or password' };
    },

    async logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { success: true };
    },

    getToken() {
        return localStorage.getItem('token');
    },

    getUser() {
        return localStorage.getItem('user');
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};

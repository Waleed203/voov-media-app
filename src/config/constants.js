export const APP_CONSTANTS = {

	// API Headers
	API_HEADERS: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},

	// Storage Keys
	STORAGE_KEYS: {
		TOKEN: 'token',
		TOKEN_FORGOT: 'forgot',
		UID: 'uid',
		USER_DATA: 'userData',
		THEME: 'theme',
		LANGUAGE: 'language',
		THEME: 'theme'
	},

	// API Endpoints
	ENDPOINTS: {
		LOGIN: 'auth/login',
		SIGNUP: 'auth/signup',
		FORGOT_PASSWORD: 'auth/forgot-password',
		RESET_PASSWORD: 'auth/resET-password',
		PROFILE: 'user/profile',
		UPDATE_PROFILE: 'user/update-profile',
	},

	// Timeouts
	TIMEOUTS: {
		API: 10000,
		TOAST: 3000,
	},

	// Pagination
	PAGINATION: {
		PAGE_SIZE: 10,
		INITIAL_PAGE: 1,
	},

	// Validation
	VALIDATION: {
		MIN_PASSWORD_LENGTH: 8,
		MAX_NAME_LENGTH: 50,
		EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
	},

	// Image Upload
	IMAGE_UPLOAD: {
		MAX_SIZE: 5 * 1024 * 1024, // 5MB
		ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
	},
};
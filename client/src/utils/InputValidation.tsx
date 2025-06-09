export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) 
	return "Email is required.";
  if (/\s/.test(email))
	return "Email cannot contain spaces.";
  if (!emailRegex.test(email)) 
	return "Invalid email format.";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) 
	return "Password is required.";
  if (password.length < 4) 
	return "Password must be at least 4 characters.";
  if (/\s/.test(password)) 
    return "Password cannot contain spaces.";
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username) 
	return "Username is required.";
  if (username.length < 2) 
	return "Username must be at least 2 characters.";
  if (/^\s/.test(username)) 
    return "Username cannot start with a whitespace.";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) 
	return "Username can only contain letters, numbers, and underscores.";
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) 
	return "Name is required.";
  if (name.length < 2) 
	return "Name must be at least 2 characters.";
  if (/^\s/.test(name)) 
    return "Name cannot start with a whitespace.";
  if (!/^[a-zA-Z\s\-']+$/.test(name)) 
	return "Name can only contain letters, spaces, hyphens, or apostrophes.";
  return null;
};
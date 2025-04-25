// utils/auth.js
let mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [
  {
    email: "test@example.com",
    password: "test1234",
    name: "Test User",
    themeColor: "#6457f9",
    id: 1
  },
  {
    email: "demo@example.com",
    password: "demo1234",
    name: "Demo User",
    themeColor: "#4CAF50",
    id: 2
  }
];

export const authService = {
  mockUsers,

   // LOGIN FUNCTION
   login: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = authService.mockUsers.find(
          u => u.email === email && u.password === password
        );

        if (user) {
          resolve({
            success: true,
            user: {
              email: user.email,
              name: user.name,
              id: user.id,
              themeColor: user.themeColor
            }
          });
        } else {
          resolve({
            success: false,
            message: "Invalid email or password"
          });
        }
      }, 1000);
    });
  },


  signup: async (name, email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userExists = mockUsers.some(u => u.email === email);
        if (userExists) {
          resolve({ success: false, message: "Email already exists" });
        } else {
          const newUser = {
            email,
            password,
            name,
            themeColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
            id: Date.now()
          };
          mockUsers.push(newUser);
          localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
          
          // Return the user data without password
          resolve({ 
            success: true, 
            user: {
              email: newUser.email,
              name: newUser.name,
              id: newUser.id,
              themeColor: newUser.themeColor
            } 
          });
        }
      }, 500);
    });
  },

 // LOGOUT FUNCTION
 logout: async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
}
};

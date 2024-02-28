// a function to check if a valid email is entered
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// a function to check if a passowrd entered is valid
// password is minimum 8 characters long
// atleast one uppercase
// atleast one lowercase
// at least one digit (1,2,3,4,5,6,7,8,9)
export const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password);

}


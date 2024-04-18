// a function to check if a valid email is entered
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// a function to check if the name is valid
export const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name)

}

export const isValidUsername = (name) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(name)
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

export const isValidPhoneNumber = (phoneNumber) => {
    const regex = /^\+\d{11}$/;
    return regex.test(phoneNumber);
}

export const isValidSixDigitCode = (code) => {
    const regex = /^\d{6}$/;
    return regex.test(code);
}




export default function SignupValidation(values){
    let error = {}
    const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if(values.firstName === ''){
        error.firstName = "Please enter your first name"
    }else{
        error.firstName = ""
    }
    if(values.lastName === ''){
        error.lastName = "Please enter your last name"
    }else{
        error.lastName = ""
    }

    if(values.email === ''){
        error.email = "Please enter your email"
    }else if(!email_pattern.test(values.email)){
        error.email = "Please enter a valid email address"
    }else{
        error.email = ""
    }

    if(values.password === ''){
        error.password = "Please enter your password"
    }else if(!password_pattern.test(values.password)){
        error.password = "Password must be at least 8 characters and include uppercase, lowercase, and a number"
    } else {
        error.password = ""
    }

    return error;

}

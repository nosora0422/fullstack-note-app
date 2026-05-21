export default function SignupValidation(values){
    let error = {}
    const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if(values.name === ''){
        error.name = "Please enter your name"
    }else{
        error.name = ""
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

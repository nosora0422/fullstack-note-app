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
        error.email = "Email or password did not match"
    }else{
        error.email = ""
    }

    if(values.password === ''){
        error.password = "Please enter your password"
    }else if(!password_pattern.test(values.password)){
        error.password = "Email or password did not match"
    } else {
        error.password = ""
    }

    return error;

}
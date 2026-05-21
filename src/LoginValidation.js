export default function LoginValidation(values){
    let error = {}
    const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(values.email === ''){
        error.email = "Please enter your email"
    }else if(!email_pattern.test(values.email)){
        error.email = "Please enter a valid email address"
    }else{
        error.email = ""
    }

    if(values.password === ''){
        error.password = "Please enter your password"
    } else {
        error.password = ""
    }

    return error;

}    

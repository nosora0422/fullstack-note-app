export const getFirebaseAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    "auth/email-already-in-use": "This email is already registered. Please log in instead.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/invalid-credential": "Email or password did not match.",
    "auth/popup-closed-by-user": "Google login was closed before it finished.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
    "auth/user-not-found": "Email or password did not match.",
    "auth/wrong-password": "Email or password did not match.",
    "auth/weak-password": "Password should be at least 6 characters.",
  };

  return errorMessages[errorCode] || "Something went wrong. Please try again.";
};

export const hasValidationErrors = (errors) => {
  return Object.values(errors).some(Boolean);
};

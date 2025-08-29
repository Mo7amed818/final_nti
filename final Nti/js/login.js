document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  // الإيميل والباسورد اللي إنت تحددهم
  const validEmail = "admin@gmail.com";
  const validPassword = "123456";

  if(email === "" || password === ""){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please fill in all fields!'
    });
  } 
  else if (email === validEmail && password === validPassword) {
    localStorage.setItem("isLoggedIn", "true");

    Swal.fire({
      icon: 'success',
      title: 'Login Successful!',
      text: 'Redirecting to Home...',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      window.location.href = "index.html";
    });
  } 
  else {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Credentials',
      text: 'Email or password is incorrect!'
    });
  }
});
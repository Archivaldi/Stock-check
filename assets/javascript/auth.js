//listen for auth status changes
auth.onAuthStateChanged(user => {
    console.log(user);
});

//signUp
$("#Sign_Up").on("click", (e) => {
    event.preventDefault();

    //get user info
    const email = $("#signUp_email").val();
    const password = $("#signUp_password").val();

    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log(cred.user);
        $("#signUp_form").hide();
    })
})

//log out
$("#log-out").on("click", (e) => {
    event.preventDefault();
    auth.signOut().then(() => {
        console.log("user logged out");
    })

})

//log In
$("#Log_In").on("click", (e) => {
    event.preventDefault();

    //get user info
    const email = $("#signIn_email").val();
    const password = $("#signIn_password").val();

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        console.log(cred.user);
    })
})

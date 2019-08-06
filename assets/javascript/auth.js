//listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        //get data from firestore
        db.collection("stocks").get().then(snapshot => {
            setupStock(snapshot.docs);
        });

        $("#screen_3").show();
    } else {
        setupStock ([]);
        $("#screen_2").hide();
    }
});

//signUp
$("#Sign_Up").on("click", (e) => {
    event.preventDefault();

    //get user info
    const email = $("#signUp_email").val();
    const password = $("#signUp_password").val();

    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        $("#signUp_form").hide();
    })
})

//log out
$("#log-out").on("click", (e) => {
    event.preventDefault();
    auth.signOut();
})


//log In
$("#Log_In").on("click", (e) => {
    event.preventDefault();

    //get user info
    const email = $("#signIn_email").val();
    const password = $("#signIn_password").val();

    auth.signInWithEmailAndPassword(email, password).then(cred => {
    })
})

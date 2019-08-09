const accountDetails = document.querySelector("#user-info");
let firstName = "";
let lastName = "";
let userUID = "";
//listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {

        // account info 
        const html = `<h2>Logged in as ${user.email}</h2>`;
        if (accountDetails) {
            accountDetails.innerHTML = html;
        }

        //hide forms 
        if (($("#signUp_form")) && ($("#signIn_form"))) {
            $("#signUp_form").hide();
            $("#signIn_form").hide();

        }

        //save userUID for access to user data
        userUID = user.uid;

        //get data from firestore
        db.collection("users").doc(userUID).collection("stocks").onSnapshot(snapshot => {
            setupStock(snapshot.docs);
        }, err => {
            console.log(err.message);
        })
        $("#screen_3").show();
    } else {
        if (($("#signUp_form")) && ($("#signIn_form"))) {
            $("#signUp_form").show();
            $("#signIn_form").show();
        }
        //show up signUp and singIn forms
        //hide account info
        if (accountDetails) {
            accountDetails.innerHTML = "";
        }
        setupStock([]);
    }
});

//signUp
$("#Sign_Up").on("click", (e) => {
    event.preventDefault();

    //get user info
    const email = $("#signUp_email").val();
    const password = $("#signUp_password").val();

    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection("users").doc(cred.user.uid).set({
            age: $("#signUp_age").val()
        })
    }).then(() => {
        $("#signUp_form").hide();
        $("#signIn_form").hide();
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

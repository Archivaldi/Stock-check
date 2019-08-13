const accountInfo = document.querySelector(".account-details");
const accountDetails = document.querySelector("#user-info");
let firstName = "";
let lastName = "";
let userUID = "";
let userEmail = "";
let counter;
var iStr;
//listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        //save userUID for access to user data
        userUID = user.uid;
        userEmail = user.email;
        db.collection("users").doc(userUID).get().then(doc => {

            firstName = doc.data().First_Name;
            lastName = doc.data().Last_Name;
            // account info 
            const html = `<h4>Hello ${firstName} ${lastName}<h4/>`;
            if (accountDetails) {
                accountDetails.innerHTML = html;
            }
            const accountFullInfo = `<h4>First name: ${doc.data().First_Name}</h4>
                                <h4>Last name: ${doc.data().Last_Name}</h4>
                                 <h4>Email: ${userEmail}</h4>`
            if (accountInfo) {
                accountInfo.innerHTML = accountFullInfo;
            }

            uploadStockInfo();
        })

        //get data from firestore
        db.collection("users").doc(userUID).collection("stocks").onSnapshot(snapshot => {
            setupStock(snapshot.docs);
        }, err => {
            console.log(err.message);
        })

         //get messages from firestore
         db.collection("chat").orderBy("number").onSnapshot(snapshot => {
            showChat(snapshot.docs);
        });

        
        setupUI(user);
    } else {
        //hide account info
        if (accountDetails) {
            accountDetails.innerHTML = "";
        }
        if (accountInfo) {
            accountInfo.innerHTML = "";
        }
        setupStock([]);
        setupUI();
        showChat([]);
    }
});

//signUp
$("#Sign_Up").on("click", (e) => {
    event.preventDefault();
    //get user info
    const email = $("#signUp_email").val();
    const password = $("#signUp_password").val();
    const firstName = $("#First_Name").val();
    const lastName = $("#Last_Name").val();
    const signUpForm = document.querySelector("#signUp_form");

    if ((email != "") && (password != "") && (firstName != "") && (lastName != "")) {
        auth.createUserWithEmailAndPassword(email, password).then(cred => {
            return db.collection("users").doc(cred.user.uid).set({
                First_Name: firstName,
                Last_Name: lastName
            })
        }).then(() => {
            const modal = document.querySelector("#modal-signup");
            M.Modal.getInstance(modal).close();
            signUpForm.reset();
            $("#error").text("");
        })
    } else {
        $("#error").text("Please, fill out all fields");
    }

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
    const signInForm = document.querySelector("#signIn_form");

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        const modal = document.querySelector("#modal-login");
        M.Modal.getInstance(modal).close();
        signInForm.reset();
        $("#sighInError").text("");
    }).catch(err => {
        $("#signInError").text(err.message);
    })
});
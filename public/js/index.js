const electron = require('electron');
let ipcRenderer = require('electron').ipcRenderer;



$(".form-signin #signInbtn").click(function () {
    alert("work");
    $("#signInbtn").submit(function (e) {
        e.preventDefault();
    });
    if ($(".form-signin")[0].checkValidity()) {
        var email = $(".form-signin #inputEmail").val();
        var password = $(".form-signin #inputPassword").val();
        alert(password+"---------------"+email);
        var x =  ipcRenderer.sendSync('synchronous-message', email,password)
        // log result
        alert(x);

    }
});


async function login(email, password) {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/login',
            data: {
                email, password
            }
        })
        if (res.data.status == "Succesful") {
            window.setTimeout(() => {
                location.assign('/')
            }, 100);
        }
    }
    catch (error) {
        console.log(error)
    }
}

async function logout() {

    const res = await axios({
        method: 'GET',
        url: '/api/logout',
    })
    if (res.data.message == 'success') {
        location.assign('/login');
    }

}
try {

    document.querySelector('#submitButton').addEventListener('click', e => {
        const email = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        login(email, password);
    })
} catch (error) {
    console.log(error)
}

document.querySelector('.logout').addEventListener('click', e => {
    logout();
})
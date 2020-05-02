class Auth {

    constructor(username = null, isAuthenticated = false) {
        this.username = username
        this.isAuthenticated = isAuthenticated
    }

    setUsername(name) {
        this.username = name
    }

    setIsAuthenticated(flag) {
        this.isAuthenticated = flag
    }

    getUsername() {
        return this.username
    }

    getIsAuthenticated() {
        return this.isAuthenticated
    }

    reset() {
        this.username = null
        this.isAuthenticated = false
    }
}

export default Auth;
<template>
    <div class="container center-container">
        <div class="card login-card">
            <div class="card-body">
                <h3 class="card-title card-title-center margin-bottom-none" style="margin-bottom: 0;">Kata-Ku</h3>
                <h5 class="card-title card-title-center">Login Akun</h5>

                <div class="form-group">
                    <label>Email</label>
                    <input class="input-block" type="email" placeholder="Masukkan email">
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input class="input-block" type="password" placeholder="Masukkan password">
                </div>

                <h5 class="card-title">Belum Punya Akun? <a href="#"><b>Daftar</b></a></h5>

                <button>Daftar</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.login-card {
    width: 20rem;
}

.card-title-center {
    text-align: center;
}
</style>
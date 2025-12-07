<template>
  <section class="wrapper-coming-soon">
    <div class="logo">Kang Ipsum</div>
    <div class="divider"></div>

    <div class="coming-soon--content">
      <h1>Coming soon</h1>
      
      <p class="subtitle">
          We are going to launch our website Very Soon<br>
          Stay Tune
      </p>
  
      <div class="social-icons">
          <a href="https://www.instagram.com/" target="_blank" title="Instagram" class="instagram">
            <i class="uil uil-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/in/" title="LinkedIn" target="_blank" class="linkedin">
            <i class="uil uil-linkedin"></i>
          </a>
      </div>
    </div>
    

    <footer>
      <div class="container py-0">
        <hr class="mt-0 mb-7" />
        <div class="d-md-flex align-items-center justify-content-center">
          <p class="mb-2 mb-lg-0">© 2025 Kang Ipsum. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.wrapper-coming-soon {
  background: rgba(255, 255, 255, 0.98);
  padding: 50px 60px 30px 60px;
  text-align: center;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.coming-soon--content{
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  font-size: 14px;
  letter-spacing: 8px;
  color: #a0a0a0;
  margin-bottom: 10px;
  font-weight: 300;
  text-transform: uppercase;
}

.divider {
  width: 50px;
  height: 1px;
  background: #d0d0d0;
  margin: 15px auto 50px;
}

h1 {
    font-size: 72px;
    font-weight: 400;
    margin-bottom: 30px;
    color: #3f3f3f;
    line-height: 1.2;
}

.subtitle {
    font-size: 18px;
    color: #666;
    margin-bottom: 60px;
    line-height: 1.6;
    font-weight: 300;
}

.green-text {
    color: #4a7c2e;
    font-weight: 400;
}

.footer {
    margin-top: 80px;
    font-size: 11px;
    color: #aaa;
}

.footer a {
    color: #aaa;
    text-decoration: none;
    margin: 0 5px;
}

.footer a:hover {
    color: #4a7c2e;
}

.social-icons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
}

.social-icons a {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    font-size: 16px;
    transition: background 0.3s ease;
}

.social-icons .instagram:hover {
  background: #FC0AC5;
}

.social-icons .linkedin:hover {
    background: #0882BD;
}

@media (max-width: 768px) {
    .container {
        padding: 50px 30px;
    }

    h1 {
        font-size: 48px;
    }

    .email-form {
        flex-direction: column;
        align-items: center;
    }

    .email-input {
        width: 100%;
    }

    .date-badge {
        display: none;
    }
}
</style>
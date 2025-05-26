<template>
  <footer class="footer">
    <div class="footer-content">
      <span>© {{ new Date().getFullYear() }} MyApp. All rights reserved.</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  background: transparent;
  backdrop-filter: blur(8px);
  padding: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 -2px 8px rgba(24,136,255,0.08);
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
}

.footer-content {
  color: #e3f2fd;
  font-size: 1.08rem;
  font-weight: 500;
  letter-spacing: 1px;
}
</style>
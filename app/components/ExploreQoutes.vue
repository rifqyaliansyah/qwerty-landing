<script setup>
import { PhEye } from '@phosphor-icons/vue'
</script>

<template>
    <div class="container">
        <h3 class="padding-top-medium margin-bottom-none">Explore lebih banyak kata-kata</h3>
        <p class="padding-top-none margin-top-none">Masih banyak kata lain yang bisa kamu temukan di sini.</p>
        <div class="row">
            <div class="sm-12 md-6">
                <div class="card margin-right-small margin-bottom-small margin-top-small">
                    <div class="card-body">
                        <h4 class="card-title">Judul Kata kata</h4>
                        <h5 class="card-subtitle">Penulis</h5>
                        <p class="card-text">This is a card on the left side using flexbox layout system.</p>
                        <div class="card-footer-inline">
                            <a class="card-link" href="#">Lihat</a>
                            <span class="view-count">
                                <PhEye :size="16" /> 1,234
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sm-12 md-6">
                <div class="card margin-left-small margin-bottom-small margin-top-small">
                    <div class="card-body">
                        <h4 class="card-title">Second Card</h4>
                        <h5 class="card-subtitle">Card kedua</h5>
                        <p class="card-text">This is a card on the right side, placed next to the first card.</p>
                        <div class="card-footer-inline">
                            <a class="card-link" href="#">Lihat</a>
                            <span class="view-count">
                                <PhEye :size="16" /> 1,234
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sm-12 md-6">
                <div class="card margin-right-small margin-bottom-small margin-top-small">
                    <div class="card-body">
                        <h4 class="card-title">Third Card</h4>
                        <h5 class="card-subtitle">Card ketiga</h5>
                        <p class="card-text">This is the third card positioned on the left of second row.</p>
                        <div class="card-footer-inline">
                            <a class="card-link" href="#">Lihat</a>
                            <span class="view-count">
                                <PhEye :size="16" /> 1,234
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sm-12 md-6">
                <div class="card margin-left-small margin-bottom-small margin-top-small">
                    <div class="card-body">
                        <h4 class="card-title">Fourth Card</h4>
                        <h5 class="card-subtitle">Card keempat</h5>
                        <p class="card-text">This is the fourth card positioned on the right of second row.</p>
                        <div class="card-footer-inline">
                            <a class="card-link" href="#">Lihat</a>
                            <span class="view-count">
                                <PhEye :size="16" /> 1,234
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row padding-top-large margin-bottom-none">
                <div class="sm-12" style="text-align: center;">
                    <button>Lihat lebih banyak</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-footer-inline {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.view-count {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;
    color: #666;
}
</style>
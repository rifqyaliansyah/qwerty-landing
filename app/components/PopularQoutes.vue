<script setup>
import { PhEye } from '@phosphor-icons/vue'
</script>

<template>
    <div class="container">
        <h3 class="padding-top-large margin-bottom-none">Kata-Kata Paling Populer</h3>
        <p class="padding-top-none margin-top-none">Yuk, intip kata-kata yang lagi banyak dibaca.</p>
        <div class="row">
            <div class="sm-12 md-6">
                <div class="card margin-right-small margin-bottom-small margin-top-small card-no-border">
                    <div class="card-body background-primary">
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
                <div class="card margin-left-small margin-bottom-small margin-top-small card-no-border">
                    <div class="card-body background-secondary">
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
                <div class="card margin-right-small margin-bottom-small margin-top-small card-no-border">
                    <div class="card-body background-success">
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
                <div class="card margin-left-small margin-bottom-small margin-top-small card-no-border">
                    <div class="card-body background-warning">
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
            <div class="sm-12 md-6">
                <div class="card margin-left-small margin-bottom-small margin-top-small card-no-border">
                    <div class="card-body">
                        <h4 class="card-title">Five Card</h4>
                        <h5 class="card-subtitle">Card kelima</h5>
                        <p class="card-text">This is the five card positioned on the right of second row.</p>
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
                <div class="card margin-left-small margin-bottom-small margin-top-small card-no-border">
                    <div class="card-body background-danger">
                        <h4 class="card-title">Six Card</h4>
                        <h5 class="card-subtitle">Card keenam</h5>
                        <p class="card-text">This is the six card positioned on the right of second row.</p>
                        <div class="card-footer-inline">
                            <a class="card-link" href="#">Lihat</a>
                            <span class="view-count">
                                <PhEye :size="16" /> 1,234
                            </span>
                        </div>
                    </div>
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

.card-no-border {
    border: none !important;
}

.card-body {
    padding: 1.5rem;
}
</style>
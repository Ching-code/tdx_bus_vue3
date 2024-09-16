<script setup>
import CountryButton from '@/components/CountryButton.vue'
import 'boxicons'
</script>

<template>
  <div class="banner">
    <img class="object-fit w-full" src="@/assets/Thumbnail-02.png" alt="" />
  </div>
  <div class="w-full mx-auto flex flex-wrap items-center justify-center gap-5">
    <CountryButton country="台北市/新北市" desc="Taipei/NewTaipei" textColor="#000000">
    </CountryButton>
    <CountryButton country="桃園市" desc="Taoyuan" textColor="#0284c7"></CountryButton>
    <CountryButton country="台中市" desc="Taichung" textColor="#f87171"></CountryButton>
    <CountryButton country="台南市" desc="Tainan" textColor="#4ade80"></CountryButton>
    <CountryButton country="高雄市" desc="Kaohsiung" textColor="#15803d"></CountryButton>
    <CountryButton country="其他地區" desc="Other City" textColor="#14532d"></CountryButton>
  </div>
</template>

<style lang=""></style>

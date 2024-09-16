<template>
  <header class="w-full bg-gray-200 flex items-center justify-between">
    <div class="logoArea flex items-center justify-center py-3 px-5 md:px-20">
      <box-icon name="bus" class="size-12"></box-icon>
      <div class="logoText flex flex-col ml-5">
        <h1 class="md:text-lg font-bold">台灣公車</h1>
        <p class="">Taiwan Bus</p>
      </div>
    </div>
    <div class="menuArea flex mr-5 md:hidden">
      <!-- <p class="mr-5 font-bold cursor-pointer">附近站牌</p> -->
      <box-icon name="menu" class="cursor-pointer"></box-icon>
    </div>
  </header>
</template>
<script setup>
import 'boxicons'
</script>
<style lang=""></style>

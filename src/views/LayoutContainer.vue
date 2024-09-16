<script setup>
import PageHeader from '@/components/PageHeader.vue'
import PageFooter from '@/components/PageFooter.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex flex-col h-screen">
    <PageHeader class="flex-shrink-0"></PageHeader>
    <main class="flex-grow overflow-auto">
      <router-view class="h-full"></router-view>
    </main>
    <PageFooter class="flex-shrink-0"></PageFooter>
  </div>
</template>

<style lang=""></style>

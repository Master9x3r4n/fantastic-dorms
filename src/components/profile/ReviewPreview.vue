<script setup>
defineProps({
  img: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Really Cool Apartment'
  },
  review: {
    type: String,
    default: '“This Is the Title of the Review”'
  },
  rating: {
    type: Number,
    default: 4
  },
  listingId: {
    type: Number,
    default: 1
  }
})
</script>

<template>
  <div class="flex flex-row justify-between items-center w-full max-w-[580px] h-[80px] self-stretch flex-none order-1">
    <RouterLink :to="{name: 'listing', params: {id: listingId}}">
    <div class="flex flex-row items-center gap-3.75">

      <div
          class="w-[117px] h-[80px] bg-[linear-gradient(135deg,#355AFF_-3.87%,#2C0ED6_103.87%)] rounded-[20px] shrink-0 bg-cover bg-center"
          :style="img ? { backgroundImage: `url(${img})` } : {}"
      ></div>

      <div class="flex flex-col justify-center items-start gap-[5px]">
        <h3 class="font-semibold text-[20px] leading-[24px] text-black dark:text-white">
          {{ title }}
        </h3>
        <p class="italic font-normal text-[16px] leading-[19px] text-black dark:text-white">
          {{ review }}
        </p>
      </div>

    </div>
    </RouterLink>

    <div class="flex flex-row justify-center items-center gap-[10px]">

      <div class="flex items-center justify-center w-[42px] h-[42px]">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#355AFF"/>
        </svg>
      </div>

      <span class="font-bold text-[24px] leading-7.25 text-black dark:text-white">
        {{ rating.toFixed(1) }}
      </span>

    </div>

  </div>
</template>
<script setup>
    import { iconsData } from '@/assets/icons-data.js'
    import { computed, ref, onMounted, onUnmounted } from 'vue';

    const props = defineProps({
        name: {
            type: String,
            default: ""
        }
    });

    const isDark = ref(false) // ref for dark mode toggle

    const iconConfig = computed(() => {
        const data = iconsData[props.name] || {};
        
        return {
            src: isDark.value ? (data.srcDark || data.src) : data.src,
            alt: isDark.value ? (data.altDark || data.alt) : data.alt,
            width: isDark.value ? (data.widthDark || data.width) : data.width,
            height: isDark.value ? (data.heightDark || data.height) : data.height,
            isInternal: data.isInternal ?? true
        };
    });

    const updateTheme = () => {
        isDark.value = document.documentElement.classList.contains('dark');
    };

    //From gemini: function to observe the dark mode
    let observer = null;

    onMounted(() => {
        updateTheme(); // Initial check
        
        observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    updateTheme();
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
    });

    onUnmounted(() => {
        if (observer) observer.disconnect();
    });

</script>

<template>

    <template v-if="iconConfig.isInternal">
        <img 
            :src="iconConfig.src" 
            :alt="iconConfig.alt" 
            :width="iconConfig.width" 
            :height="iconConfig.height"
        >
    </template>
    <template v-else>
        after
    </template>
</template>
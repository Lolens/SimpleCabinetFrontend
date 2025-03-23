<script setup>
</script>
<template>
    <div class="dropdown">
        <slot name="header"><span>Menu</span></slot>
        <div class="dropdown-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
<style scoped>
.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: var(--colors-background-secondary);
    min-width: 160px;
    box-shadow: 0px 5px 10px 0px var(--colors-background-shadow);
    z-index: 1;
    transition: 0.3s;
}

.dropdown:hover .dropdown-content {
    display: block;
}
</style>
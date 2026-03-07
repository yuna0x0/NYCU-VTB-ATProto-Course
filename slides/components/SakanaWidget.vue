<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import SakanaWidget from "sakana-widget";
import "sakana-widget/lib/sakana.min.css";
import yunyaImage from "../assets/yunya.webp";

const wrapper = ref(null);
let widget = null;
let registered = false;
let observer = null;
let mountTarget = null;

function createMount() {
    if (widget || !wrapper.value) return;
    if (!registered) {
        const chisato = SakanaWidget.getCharacter("chisato");
        chisato.image = yunyaImage;
        SakanaWidget.registerCharacter("yunya", chisato);
        registered = true;
    }
    // Create a fresh div to mount into
    mountTarget = document.createElement("div");
    wrapper.value.appendChild(mountTarget);
    widget = new SakanaWidget({ character: "yunya", controls: false, size: 350 })
        .setState({ i: 0.005 })
        .mount(mountTarget);
}

function destroyMount() {
    if (widget) {
        widget.unmount();
        widget = null;
    }
    if (mountTarget && wrapper.value) {
        wrapper.value.removeChild(mountTarget);
        mountTarget = null;
    }
}

onMounted(() => {
    let hasBeenVisible = false;
    observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                hasBeenVisible = true;
                createMount();
            } else if (hasBeenVisible) {
                destroyMount();
            }
        },
        { threshold: 0.1 },
    );
    observer.observe(wrapper.value);
});

onUnmounted(() => {
    observer?.disconnect();
    destroyMount();
});
</script>

<template>
    <div ref="wrapper" />
</template>

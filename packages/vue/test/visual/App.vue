<script setup>
import {Teleport, ref, computed} from 'vue';
import {useFloating, flip, offset} from '@floating-ui/vue';

const reference = ref(null);
const floating = ref(null);
const middleware = ref([]);
const {x, y, strategy} = useFloating(reference, floating, {
  placement: 'right',
  middleware,
});
const top = computed(() => `${y.value ?? 0}px`);
const left = computed(() => `${x.value ?? 0}px`);
</script>

<template>
  <div class="reference" ref="reference">Reference</div>
  <Teleport to="#floating-ui-root">
    <div class="floating" ref="floating">Floating</div>
  </Teleport>
  <button type="button" @click="middleware = []">[]</button>
  <button type="button" @click="middleware = [offset(10)]">offset(10)</button>
  <button type="button" @click="middleware = [offset()]">offset()</button>
  <button type="button" @click="middleware = [flip()]">flip()</button>
</template>

<style scoped>
:global(body) {
  font-family: sans-serif;
  color: rgba(255, 255, 255, 0.9);
  background: #1d1e20;
  color-scheme: dark;
}

:global(*),
:global(*)::before,
:global(*)::after {
  box-sizing: border-box;
}

.reference {
  background: blueviolet;
  color: white;
  display: grid;
  place-items: center;
  width: 200px;
  height: 200px;
}

.floating {
  background: #333;
  color: white;
  left: v-bind('left');
  padding: 15px;
  position: v-bind('strategy');
  top: v-bind('top');
  width: 500px;
}
</style>

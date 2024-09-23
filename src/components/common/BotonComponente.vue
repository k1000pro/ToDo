<template>
  <button :class="buttonClass" @click="handleClick" :type="props.type" :aria-label="ariaLabel">
    <i v-if="iconoClass" :class="iconoClass"></i>
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  tipo: {
    type: String,
    default: "primary", 
  },
  iconoClass: {
    type: String,
    default: "", 
  },
  type: {
    type: String,
    default: "button", 
  },
  ariaLabel: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["click"]);

const buttonClass = computed(() => {
  return {
    btn: true,
    [`btn-${props.tipo}`]: true, 
  };
});

const handleClick = (event) => {
  emit("click", event); 
};
</script>

<style scoped>
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  transition: background-color 0.3s ease;
}


.btn-primary {
  background-color: #a29bfe;
  color: white;
}

.btn-primary:hover {
  background-color: #403e64;
}


.btn-secondary {
  background-color: #383838;
  color: white;
}

.btn-secondary:hover {
  background-color: #6b6b6b;
}


.btn-danger {
  background-color: #682222;
  color: white;
}

.btn-danger:hover {
  background-color: #a72727;
}
</style>

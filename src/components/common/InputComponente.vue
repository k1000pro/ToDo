<template>
  <div class="input-group">
    <label v-if="label" :for="id">{{ label }}</label>
  
    <input 
      :id="id" 
      :type="type" 
      v-model="inputValue" 
      @input="updateValue" 
      :placeholder="placeholder" 
      :disabled="disabled" 
      :required="required" 
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';


const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: false
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
});


const emit = defineEmits(['update:modelValue']);


const inputValue = ref(props.modelValue);


watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue;
});


const updateValue = () => {
  emit('update:modelValue', inputValue.value);
};
</script>

<style scoped>

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}


label {
  margin-bottom: 5px;
  color: #ffffff;
}


input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}


input:focus {
  outline: none;
  border-color: #007bff;
}


input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}


@media (max-width: 600px) {
  .input-group {
    margin-bottom: 10px;
  }

  label {
    font-size: 0.9rem;
  }
}
</style>

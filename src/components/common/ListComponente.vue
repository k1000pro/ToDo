<template>
  <ul>
    <h2 v-if="title !== ''" class="list-title">
      <strong>{{ title }}</strong>
    </h2>
    <li
      v-for="item in items"
      :key="item.nombre"
      @click="selectItem(item.nombre)"
      :class="{ active: selectedItem === item.nombre }"
    >
      <span class="color-indicator" :style="{ backgroundColor: item.color }"></span>
      <strong>{{ item.nombre }}</strong>
      <button
        v-if="showButton"
        @click.stop="buttonClicked(item)"
        class="item-button"
      >
        <i :class="buttonIcon"></i>
      </button>
    </li>
  </ul>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';


const props = defineProps({
  title: {
    type: String,
    required: true
  },
  //array de objetos
  items: {
    type: Array,
    required: true
  },
  //objeto seleccionado
  selectedItem: {
    type: String,
    default: "Todos"
  },
  //mostrar icono a la par del item
  showButton: {
    type: Boolean,
    default: false
  },
  //clase del icono 
  buttonIcon: {
    type: String,
    default: 'fas fa-info-circle' 
  }
});


const emit = defineEmits(['item-selected', 'button-clicked']);


const selectItem = (name) => {
  emit('item-selected', name);
};


const buttonClicked = (item) => {
  emit('button-clicked', item);
};
</script>

<style scoped>
.list-title {
  font-size: 18px;
  font-weight: 400;
  padding: 10px;
  color: #a29bfe;
  border-bottom: 1px solid #444;
}

ul {
  list-style: none;
  padding: 20px;
  background-color: #2c2c2c;
  border-radius: 10px;
  margin: 20px;
}

li {
  padding: 5px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  border-radius: 5px;
  margin: 5px 0;
  font-size: 14px;
  color: white;
  word-break: break-all;
}

li:hover {
  background-color: #444;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

li.active {
  background-color: #444;
  color: white;
}

.color-indicator {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-right: 10px;
}

.item-button {
  margin-left: auto;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 15px;
  padding: 5px;
  opacity: 0;
  transition: all 0.4s ease;
  pointer-events: none;
}

li:hover .item-button {
  opacity: 1; 
  pointer-events: auto; 
}

.item-button:hover {
  color: #812727;
}
</style>

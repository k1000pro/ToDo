import { createRouter, createWebHistory } from 'vue-router'
import TasksView from '../views/TasksView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/tareas',
      name: 'tasks',
      component: TasksView,
    },
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/registrarse',
      name: 'register',
      component: RegisterView,
    },
  ]
})

export default router

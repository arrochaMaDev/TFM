import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AltaUsuario from '../components/AltaUsuario.vue'
import AltaAlumno from '../components/AltaAlumno.vue'
import AltaProfesor from '@/components/AltaProfesor.vue'
import BuscadorAlumno from '@/components/BuscadorAlumno.vue'
import ListadoAlumnos from '@/components/ListadoAlumnos.vue'
import Alumno from '@/components/Alumno.vue'
import LoginUser from '@/components/LoginUser.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/alta_usuario',
      name: 'alta_usuario',

      component: AltaUsuario
    },
    {
      path: '/alta_alumno',
      name: 'alta_alumno',

      component: AltaAlumno
    },
    {
      path: '/alta_profesor',
      name: 'alta_profesor',

      component: AltaProfesor
    },
    {
      path: '/buscador_alumno',
      name: 'buscador_alumno',

      component: BuscadorAlumno
    },
    {
      path: '/listado_alumnos',
      name: 'listado_alumnos',

      component: ListadoAlumnos
    },
    {
      path: '/alumno/:id',
      name: 'alumno',

      component: Alumno,
      // props: { shouldGetData: true } // para pasar información mediante los props (ejemplo: id)
      props: true // para pasar información mediante los props (ejemplo: id)
    },
    {
      path: '/login',
      name: 'login',

      component: LoginUser
    }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AltaUsuario from '../components/AltaUsuario.vue'
import AltaAlumno from '../components/AltaAlumno.vue'
import AltaProfesor from '@/components/AltaProfesor.vue'
import AltaAsignatura from '@/components/AltaAsignatura.vue'
import BuscadorAlumno from '@/components/BuscadorAlumno.vue'
import ListadoAlumnos from '@/components/ListadoAlumnos.vue'
import Alumno from '@/components/Alumno.vue'
import LoginUser from '@/components/LoginUser.vue'
import ListadoProfesores from '@/components/ListadoProfesores.vue'

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
      path: '/alta-usuario',
      name: 'alta-usuario',

      component: AltaUsuario
    },
    {
      path: '/alta-alumno',
      name: 'alta-alumno',

      component: AltaAlumno,
      props: true // para pasar información mediante los props (ejemplo: id)
    },
    {
      path: '/alta-profesor',
      name: 'alta-profesor',

      component: AltaProfesor,
      props: true // para pasar información mediante los props (ejemplo: id)
    },
    {
      path: '/alta-asignatura',
      name: 'alta-asignatura',

      component: AltaAsignatura
    },
    {
      path: '/buscador-alumno',
      name: 'buscador-alumno',

      component: BuscadorAlumno
    },
    {
      path: '/listado-alumnos',
      name: 'listado-alumnos',

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
      path: '/listado-profesores',
      name: 'listado-profesores',

      component: ListadoProfesores
    },
    // {
    //   path: '/profesor/:id',
    //   name: 'profesor',

    //   component: Profesor,
    //   // props: { shouldGetData: true } // para pasar información mediante los props (ejemplo: id)
    //   props: true // para pasar información mediante los props (ejemplo: id)
    // },
    {
      path: '/login',
      name: 'login',

      component: LoginUser
    }
  ]
})

export default router

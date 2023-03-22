import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './../components/Home.vue'
import ZipApp from './../components/ZipApp.vue'
import notFound from './../components/notFound.vue'


export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/zip-search',
            component: ZipApp
        },
        {
            path: '/:pathMatch(.*)*',
            component: notFound
        }
    ]
})
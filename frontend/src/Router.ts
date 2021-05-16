import { createWebHistory, createRouter } from "vue-router";
import Users from "./components/pages/Users.vue";
import Home from "./components/pages/Home.vue";
import UserEdit from "./components/pages/UserEdit.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/users",
        name: "Users",
        component: Users,
    },
    {
        path: "/user/:id/edit",
        name: "UserEdit",
        component: UserEdit,
        props: true,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
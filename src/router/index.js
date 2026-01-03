import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AuthService from "@/services/auth-service";

// Роли
const ROLES = {
  ANY: "ANY", // любой пользователь, даже неавторизованный
  GUEST: "GUEST", // неавторизованный
  USER: "USER", // авторизованный пользователь
  ADMIN: "ADMIN", // администратор
};

// Иерархия ролей (чем выше число, тем выше права)
const ROLE_HIERARCHY = {
  [ROLES.GUEST]: 0,
  [ROLES.USER]: 1,
  [ROLES.ADMIN]: 2,
};

// Основные маршруты (доступны всем)
const publicRoutes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
    meta: { title: "Главная", minRole: ROLES.ANY },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/HomeView.vue"),
    meta: { title: "О нас", minRole: ROLES.ANY },
  },
];

// Маршруты для гостей
const guestRoutes = [
  {
    path: "/auth",
    name: "auth",
    component: () => import("@/views/AuthView.vue"),
    meta: { title: "Авторизация", guestOnly: true }, // ОСОБЫЙ ФЛАГ ДЛЯ ГОСТЕЙ
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
    meta: { title: "Регистрация", guestOnly: true }, // ОСОБЫЙ ФЛАГ ДЛЯ ГОСТЕЙ
  },
];

// Маршруты для авторизованных пользователей
const userRoutes = [
  {
    path: "/cabinet",
    name: "cabinet",
    component: () => import("@/views/cabinet/CabinetView.vue"),
    meta: { title: "Личный кабинет", minRole: ROLES.USER },
  },
  {
    path: "/logout",
    name: "logout",
    component: () => import("@/views/debug/LogoutView.vue"),
    meta: { title: "Выйти", minRole: ROLES.USER },
  },
  {
    path: "/refresh",
    name: "refresh",
    component: () => import("@/views/debug/RefreshView.vue"),
    meta: { title: "Обновить сессию", minRole: ROLES.USER },
  },
  {
    path: "/cabinet/security/disable2fa",
    name: "disable2fa",
    component: () => import("@/views/cabinet/security/Disable2FaView.vue"),
    meta: { title: "Отключить 2FA", minRole: ROLES.USER },
  },
  {
    path: "/cabinet/security/enable2fa",
    name: "enable2fa",
    component: () => import("@/views/cabinet/security/Disable2FaView.vue"),
    meta: { title: "Включить 2FA", minRole: ROLES.USER },
  },
];

// Маршруты для администраторов
const adminRoutes = [
  {
    path: "/admin/users",
    name: "admin-users",
    component: () => import("@/views/users/UsersView.vue"),
    meta: { title: "Управление пользователями", minRole: ROLES.ADMIN },
  },
  {
    path: "/shop/item",
    name: "shop-item",
    component: () => import("@/views/shop/ItemShopView.vue"),
    meta: { title: "Магазин предметов", minRole: ROLES.ADMIN },
  },
  {
    path: "/shop/group",
    name: "shop-group",
    component: () => import("@/views/shop/GroupShopView.vue"),
    meta: { title: "Магазин групп", minRole: ROLES.ADMIN },
  },
  {
    path: "/admin/group",
    name: "panel-group",
    component: () => import("@/views/admin/AdminGroupManagement.vue"),
    meta: { title: "Редактор групп", minRole: ROLES.ADMIN },
  },
  {
    path: "/admin/group/id/:id",
    name: "panel-group-one",
    component: () => import("@/views/admin/AdminOneGroupManagement.vue"),
    meta: { title: "Редактор групп", minRole: ROLES.ADMIN },
  },
  {
    path: "/admin/users/by/id/:id",
    name: "panel-user-by-id",
    component: () => import("@/views/users/UserById.vue"),
    meta: { title: "Пользователь по ID", minRole: ROLES.ADMIN },
  },
  {
    path: "/admin/users/by/uuid/:uuid",
    name: "panel-user-by-uuid",
    component: () => import("@/views/users/UserByUUID.vue"),
    meta: { title: "Пользователь по UUID", minRole: ROLES.ADMIN },
  },
  {
    path: "/admin/users/by/name/:name",
    name: "panel-user-by-username",
    component: () => import("@/views/users/UserByUsername.vue"),
    meta: { title: "Пользователь по логину", minRole: ROLES.ADMIN },
  },
];

// Страница "Доступ запрещен" (добавьте её!)
const forbiddenRoute = {
  path: "/forbidden",
  name: "forbidden",
  component: () => import("@/views/ForbiddenView.vue"),
  meta: { title: "Доступ запрещен", minRole: ROLES.ANY },
};

// Запасной маршрут для 404
const fallbackRoute = {
  path: "/:pathMatch(.*)*",
  name: "not-found",
  component: () => import("@/views/NotFoundView.vue"),
  meta: { title: "Страница не найдена", minRole: ROLES.ANY },
};

// Комбинируем маршруты
const routes = [
  ...publicRoutes,
  ...guestRoutes,
  ...userRoutes,
  ...adminRoutes,
  forbiddenRoute,
  fallbackRoute,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Вспомогательная функция для получения уровня роли пользователя
function getUserRoleLevel(authStore) {
  if (!authStore.user) return ROLE_HIERARCHY[ROLES.GUEST]; // 0 - гость
  
  const userRoles = authStore.user?.groups?.map((g) => g.groupName) || [];
  
  // Находим максимальный уровень роли пользователя
  const maxLevel = Math.max(
    ...userRoles.map(role => ROLE_HIERARCHY[role] || 0),
    ROLE_HIERARCHY[ROLES.USER] // Минимум USER для авторизованных
  );
  
  return maxLevel;
}

// Навигационный хук по минимальной роли
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Ждём восстановления сессии
  await AuthService.wait();

  const isAuthenticated = !!authStore.user;
  
  // 1. Проверка для страниц только для гостей
  if (to.meta.guestOnly) {
    if (isAuthenticated) {
      // Авторизованного пользователя перенаправляем из страниц для гостей
      return next({ name: "cabinet" });
    }
    // Гость может оставаться
    document.title = to.meta.title || document.title;
    return next();
  }
  
  // 2. Проверка по минимальной роли
  if (to.meta.minRole) {
    const userRoleLevel = getUserRoleLevel(authStore);
    let requiredRoleLevel;
    
    // Определяем требуемый уровень
    switch (to.meta.minRole) {
      case ROLES.ANY:
        requiredRoleLevel = -1; // Любой уровень
        break;
      case ROLES.GUEST:
        requiredRoleLevel = ROLE_HIERARCHY[ROLES.GUEST];
        break;
      case ROLES.USER:
        requiredRoleLevel = ROLE_HIERARCHY[ROLES.USER];
        break;
      case ROLES.ADMIN:
        requiredRoleLevel = ROLE_HIERARCHY[ROLES.ADMIN];
        break;
      default:
        requiredRoleLevel = -1; // По умолчанию разрешаем всем
    }
    
    // Проверяем доступ
    if (userRoleLevel < requiredRoleLevel) {
      if (!isAuthenticated) {
        // Неавторизованный пользователь
        return next({ 
          name: "auth", 
          query: { redirect: to.fullPath } 
        });
      } else {
        // Авторизованный, но без достаточных прав
        return next({ name: "forbidden" });
      }
    }
  }
  
  // Устанавливаем заголовок страницы
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  
  next();
});

export { ROLES };
export default router;
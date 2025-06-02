export default [
      {
        path: '/admin/group',
        name: 'adminGroup',
        component: () => import('../views/admin/AdminGroupManagement.vue'),
      },
      {
        path: '/admin/group/id/:id',
        name: 'adminGroupOne',
        props: true,
        component: () => import('../views/admin/AdminOneGroupManagement.vue'),
      },
]
<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :collapse="isCollapse"
      :default-active="$route.path"
      mode="vertical"
     background-color="#333"
      text-color="#fff"
      active-text-color="#4ae387"

      style="border:none">

      <sidebar-item :routes="routers"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';

export default {
  components: {
    SidebarItem,
  },
  computed: {
    ...mapGetters(['routers']),
    isCollapse() {
      return !this.$store.getters.sidebar.opened;
    },
  },
  created() {
  },
};
</script>

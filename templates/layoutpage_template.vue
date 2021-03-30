<!-- {{Object}} pages -->
<template>
  <div>
    <div class="container right">
      <b-button class="float-right" v-if="$route.name != router_actions.route_new" @click="novo" variant="primary">Novo</b-button>
    </div>
    <transition name="fade-in-up">
      <router-view :router_actions="router_actions"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      router_actions: {
        route_new: '{{object}}-new',
        route_edit: '{{object}}-edit'
      }
    };
  },
  methods:{
    novo() {
      this.$router.push( {name: this.router_actions.route_new})
    }
  },
  components: {}
};
</script>

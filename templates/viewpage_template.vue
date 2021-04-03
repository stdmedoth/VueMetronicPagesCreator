<template>
  <div>

    <p v-if="errors.length">
      <b>Status:</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>

    <form @submit.stop.prevent="onSubmit" class="form">
     <div class="card-body">
      <h3 class="font-size-lg text-dark font-weight-bold mb-6">1. Informações Básicas:</h3>
      <div class="mb-15">
      	{{ObjectRowsInputs}}
     </div>
     <div class="card-footer">
      <div class="row">
       <div class="col-lg-3"></div>
       <div class="col-lg-6">
         <b-button v-if="$route.name == router_actions.route_new" type="submit" class="btn btn-success mr-2">Cadastrar</b-button>
         <b-button v-if="$route.name == router_actions.route_edit" type="submit" class="btn btn-success mr-2">Atualizar</b-button>
         <b-button type="reset" class="btn btn-secondary">Cancelar</b-button>
       </div>
      </div>
     </div>

    </form>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
export default {
  name: "store",
  props: {
    id: String,
    router_actions: Object
  },
  mounted() {

    if(this.$route.name == this.router_actions.route_edit){
      let id = this.$route.params.id;
      ApiService.get('{{Object}}/get')
        .then(({data}) =>{
          this.errors.push(data.message);
          {{cols_editget}}
        })
          .catch(({response}) => {
            this.errors.push(response.data.errors);
          });
          
    }else{
      this.FormReset();
    }
  },
  components: {},
  data() {
    return {
      {{cols_declaration}}
      errors: []
    };
  },
  methods: {
    FormReset() {
      {{cols_reset}}
    },

    onSubmit(e) {
      let id = null;
      if(this.errors.length){
        this.message = [];
      }
      if(this.$route.name == this.router_actions.route_edit){
        id = this.$route.params.id;
      }

      ApiService.post('{{Object}}/add', {
        {{col_listpost}}
      })
        .then(({data}) => {
          this.errors.push(data.message);
          this.FormReset();
        })
          .catch(({response}) => {
            this.errors.push(response.data.errors);
          });

      e.preventDefault();
    }
  },
};
</script>

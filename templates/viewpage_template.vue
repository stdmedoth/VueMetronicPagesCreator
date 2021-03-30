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

    ApiService.get('compananies/get')
      .then(({data}) =>{
        this.errors.push(data.message);
        //console.log(data);
        this.companies_list = data.compananies.map((curval, indice, array)=>{
          return {value: curval['id'], text: curval['con_name']}
        })
      })
        .catch(({response}) => {
          this.errors.push(response.data.errors);
        });

    if(this.$route.name == this.router_actions.route_edit){
      let id = this.$route.params.id;
      ApiService.get('Stores/get')
        .then(({data}) =>{
          this.errors.push(data.message);

          this.compananies_id = data.stores[0].compananies_id;
          this.CompanySelected();
          this.users_id = data.stores[0].users_id;
          this.UserSelected();
          this.categories_id = data.stores[0].categories_id;
          this.sto_title = data.stores[0].sto_title;
          this.sto_description = data.stores[0].sto_description;
          this.sto_phone = data.stores[0].sto_phone;
          this.sto_celphone = data.stores[0].sto_celphone;
          this.sto_website = data.stores[0].sto_website;
          this.sto_city = data.stores[0].sto_city;
          this.sto_uf = data.stores[0].sto_uf;
        })
          .catch(({response}) => {
            this.errors.push(response.data.errors);
          });
          
    }else{
      this.compananies_id = '';
      this.categories_id = '';
      this.sto_title = '';
      this.sto_city = '';
      this.sto_uf = '';
      this.sto_description = '';
      this.users_id = '';
      this.sto_phone = '';
      this.sto_celphone = '';
      this.sto_website = '';
    }
  },
  components: {},
  data() {
    return {
      sto_title: '',
      sto_description: '',
      users_id: 0,
      compananies_id: 0,
      categories_id: 0,
      sto_phone: '',
      sto_celphone: '',
      sto_website: '',
      sto_city: '',
      sto_uf:  '',
      users_list: [],
      companies_list: [],
      categories_list: [],
      errors: []
    };
  },
  methods: {
    FormReset() {
      sto_title = '';
      sto_description = '';
      this.users_id = 0;
      this.compananies_id = 0;
      this.categories_id = 0;
      this.sto_phone = '';
      this.sto_celphone = '';
      this.sto_website = '';
      this.sto_city = '';
      this.sto_uf =  '';
      this.users_list = [];
      this.companies_list = [];
      this.categories_list = [];
    },
    CompanySelected(){
      ApiService.post('users/getUser',{
        fields: [],
        where: {
          compananies_id: this.compananies_id
        }
      })
        .then(({data}) =>{
          this.errors.push(data.message);
          //console.log(data);
          this.users_list = data.user.map((curval, indice, array)=>{
            return {value: curval['id'], text: curval['usu_name']}
          })
        })
          .catch(({response}) => {
            this.users_list = [];
            this.errors.push(response.data.errors);
          });
    },
    UserSelected(){
      ApiService.post('categories/getCategorias',{
        fields: [],
        where: {
          compananies_id: this.compananies_id,
          users_id: this.users_id
        }
      })
        .then(({data}) =>{
          this.errors.push(data.message);
          //console.log(data);
          this.categories_list = data.categorias.map((curval, indice, array)=>{
            return {value: curval['id'], text: curval['cat_title']}
          })
        })
          .catch(({response}) => {
            this.categories_list = [];
            this.errors.push(response.data.errors);
          });
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
        id: id,
        compananies_id: this.compananies_id,
        categories_id: this.categories_id,
        sto_title: this.sto_title,
        sto_description: this.sto_description,
        users_id: this.users_id,
        sto_phone: this.sto_phone,
        sto_celphone: this.sto_celphone,
        sto_website: this.sto_website,
        sto_city: this.sto_city,
        sto_uf: this.sto_uf
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

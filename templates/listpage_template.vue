<template>
  <div>
    <v-alert v-show="show_msg" :type="msg_type">
      {{ errors }}
    </v-alert>
    <b-table :fields="column" striped hover :items="items">
      <template #cell(actions)="row">
        <b-button size="sm" variant="primary" @click="editStore(row.item.id)"> Editar </b-button>
        <b-button size="sm" variant="danger" @click="deletarStore(row.item.id, row.index)"> Deletar </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ApiService from "@/core/services/api.service";
export default {
  name: "User",
  data() {
    return {
      column: [
        {
          key: "id",
          thClass: 'd-none',
          tdClass: 'd-none',
          sortable: true,
          label: "Id da Loja",
        },
        {
          key: "sto_title",
          sortable: true,
          label: "Nome da Loja",
        },
        {
          key: "sto_description",
          sortable: true,
          label: "Email",
        },
        {
          key: "sto_city",
          sortable: true,
          label: "Cidade",
        },
        {
          key: "actions",
          sortable: false,
          label: "Acões",
        },

      ],
      errors: [],
      show_msg: false,
      msg_type: null,
      items: null,
    };
  },
  mounted() {
    ApiService.get("Stores/get")
      .then(({ data }) => {
        this.items = data.stores;
      })
      .catch(({ response }) => {
        this.errors = response.data.errors;
        this.msg_type = "error";
        this.show_msg = true;
      });
  },
  computed: {
    ...mapState({
      user: state => state.auth.user
    }),
  },
  methods: {
    editStore(id) {
      this.$router.push('/stores/edit/'+ id);
    },
    deletarStore(id, index) {

      ApiService.post("Stores/delete", {
        id: id ,
      })
        .then(({ data }) => {
          this.errors = data.message;
          this.show_msg = true;
          this.msg_type = "success";
          this.items.splice(index,1);
        })
        .catch(({ response }) => {
          this.errors = response.data.errors;
          this.msg_type = "error";
          this.show_msg = true;
        });
    },
  },
  components: {},
};
</script>
